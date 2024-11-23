package com.LinkVerse.post.service;

import com.LinkVerse.post.Mapper.PostMapper;
import com.LinkVerse.post.Mapper.ShareMapper;
import com.LinkVerse.post.dto.ApiResponse;
import com.LinkVerse.post.dto.PageResponse;
import com.LinkVerse.post.dto.request.PostRequest;
import com.LinkVerse.post.dto.response.PostResponse;
import com.LinkVerse.post.entity.*;
import com.LinkVerse.post.repository.PostHistoryRepository;
import com.LinkVerse.post.repository.PostRepository;
import com.LinkVerse.post.repository.SharedPostRepository;
import com.amazonaws.SdkClientException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PostService {
    PostRepository postRepository;
    PostMapper postMapper;
    SharedPostRepository sharedPostRepository;
    ShareMapper shareMapper;
    PostHistoryRepository postHistoryRepository;
    @Autowired
    KeywordService keywordService;

    KafkaTemplate<String, Object> kafkaTemplate;
    @Autowired
    S3Service s3Service;
    @Autowired
    ContentModerationService contentModerationService;
    @Autowired
    TranslationService translationService;

    SentimentAnalysisService sentimentAnalysisService;

    public ApiResponse<PostResponse> createPostWithFiles(PostRequest request, List<MultipartFile> files) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Check if the content is appropriate
        if (!contentModerationService.isContentAppropriate(request.getContent())) {
            return ApiResponse.<PostResponse>builder()
                    .code(HttpStatus.BAD_REQUEST.value())
                    .message("Post content is inappropriate and violates our content policy.")
                    .build();
        }

        try {
            List<String> fileUrls = (files != null && files.stream().anyMatch(file -> !file.isEmpty()))
                    ? s3Service.uploadFiles(files.stream().filter(file -> !file.isEmpty()).collect(Collectors.toList()))
                    : List.of();

            Post post = Post.builder()
                    .content(request.getContent())
                    .userId(authentication.getName())
                    .fileUrls(fileUrls)
                    .visibility(request.getVisibility())
                    .createdDate(Instant.now())
                    .modifiedDate(Instant.now())
                    .like(0)
                    .unlike(0)
                    .comments(List.of())
                    .build();

            String languageCode = keywordService.detectDominantLanguage(request.getContent());
            post.setLanguage(languageCode);


            List<Keyword> extractedKeywords = keywordService.extractAndSaveKeywords(request.getContent());
            List<String> keywordIds = extractedKeywords.stream().map(Keyword::getId).collect(Collectors.toList());
            post.setKeywords(keywordIds);

            sentimentAnalysisService.analyzeAndSaveSentiment(post);


            post = postRepository.save(post);
            PostResponse postResponse = postMapper.toPostResponse(post);
            postResponse.setKeywords(extractedKeywords.stream().map(Keyword::getPhrase).collect(Collectors.toList()));


            return ApiResponse.<PostResponse>builder()
                    .code(200)
                    .message("Post created successfully")
                    .result(postResponse)
                    .build();
        } catch (SdkClientException e) {
            log.error("AWS S3 Exception: ", e);

            return ApiResponse.<PostResponse>builder()
                    .code(HttpStatus.BAD_REQUEST.value())
                    .message("Failed to upload files due to AWS configuration issues.")
                    .build();
        }
    }

    public ApiResponse<Void> deletePost(String postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserId = authentication.getName();

        if (!post.getUserId().equals(currentUserId)) {
            throw new RuntimeException("Not authorized to delete this post");
        }

        List<String> fileUrls = post.getFileUrls();
        if (fileUrls != null && !fileUrls.isEmpty()) {
            for (String fileUrl : fileUrls) {
                String decodedUrl = decodeUrl(fileUrl);
                String fileName = extractFileNameFromUrl(decodedUrl);

                if (fileName != null) {
                    String result = s3Service.deleteFile(fileName);
                    log.info(result);
                }
            }
        }

        PostHistory postHistory = PostHistory.builder()
                .id(post.getId())
                .content(post.getContent())
                .fileUrls(post.getFileUrls())
                .visibility(post.getVisibility())
                .userId(post.getUserId())
                .createdDate(post.getCreatedDate())
                .modifiedDate(post.getModifiedDate())
                .like(post.getLike())
                .unlike(post.getUnlike())
                .commentCount(post.getCommentCount())
                .comments(post.getComments())
                .sharedPost(postMapper.toPostResponse(post.getSharedPost()))
                .build();

        postHistoryRepository.save(postHistory);

        postRepository.delete(post);

        return ApiResponse.<Void>builder()
                .code(HttpStatus.OK.value())
                .message("Post deleted and moved to history successfully")
                .build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<PageResponse<PostResponse>> getHistoryPosts(int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by(Sort.Order.desc("createdDate")));
        var pageData = postHistoryRepository.findAll(pageable);

        List<PostHistory> posts = pageData.getContent();

        return ApiResponse.<PageResponse<PostResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Deleted posts retrieved successfully")
                .result(PageResponse.<PostResponse>builder()
                        .currentPage(page)
                        .pageSize(pageData.getSize())
                        .totalPage(pageData.getTotalPages())
                        .totalElement(pageData.getTotalElements())
                        .data(posts.stream().map(postMapper::toPostResponse).collect(Collectors.toList()))
                        .build())
                .build();
    }

    public ApiResponse<PageResponse<PostResponse>> getPostsByLanguage(int page, int size, String language) {
        Sort sort = Sort.by(Sort.Order.desc("createdDate"));
        Pageable pageable = PageRequest.of(page - 1, size, sort);

        var pageData = postRepository.findAllByLanguage(language, pageable);

        List<Post> posts = pageData.getContent();

        return ApiResponse.<PageResponse<PostResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Posts retrieved successfully")
                .result(PageResponse.<PostResponse>builder()
                        .currentPage(page)
                        .pageSize(pageData.getSize())
                        .totalPage(pageData.getTotalPages())
                        .totalElement(pageData.getTotalElements())
                        .data(posts.stream().map(postMapper::toPostResponse).collect(Collectors.toList()))
                        .build())
                .build();
    }

    public ApiResponse<PageResponse<PostResponse>> getMyPosts(int page, int size, boolean includeDeleted) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userID = authentication.getName();

        Sort sort = Sort.by(Sort.Order.desc("createdDate"));
        Pageable pageable = PageRequest.of(page - 1, size, sort);

        var pageData = postRepository.findAllByUserId(userID, pageable);

        // Lọc bài viết, bao gồm hoặc loại trừ bài viết đã xóa
        List<Post> filteredPosts = pageData.getContent().stream()
                .filter(post -> post.getVisibility() == PostVisibility.PUBLIC ||
                        (post.getVisibility() == PostVisibility.FRIENDS && isFriend(userID, post.getUserId())) ||
                        post.getVisibility() == PostVisibility.PRIVATE)
                .filter(post -> includeDeleted || !post.isDeleted()) // Lọc bài viết đã xóa
                .collect(Collectors.toList());

        return ApiResponse.<PageResponse<PostResponse>>builder()
                .code(200)
                .message("My posts retrieved successfully")
                .result(PageResponse.<PostResponse>builder()
                        .currentPage(page)
                        .pageSize(pageData.getSize())
                        .totalPage(pageData.getTotalPages())
                        .totalElement(pageData.getTotalElements())
                        .data(filteredPosts.stream().map(postMapper::toPostResponse).collect(Collectors.toList()))
                        .build())
                .build();
    }


    public ApiResponse<PostResponse> sharePost(String postId, String content, PostVisibility visibility) {
        // Tìm bài gốc theo postId
        Post originalPost = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        // Kiểm tra xem bài gốc đã bị đánh dấu xóa hay chưa
        if (originalPost.isDeleted()) {
            throw new RuntimeException("Cannot share a deleted post.");
        }

        // Kiểm tra quyền chia sẻ dựa trên visibility của bài viết
        if (originalPost.getVisibility() == PostVisibility.PRIVATE &&
                !originalPost.getUserId().equals(SecurityContextHolder.getContext().getAuthentication().getName())) {
            throw new RuntimeException("You are not authorized to share this post.");
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserId = authentication.getName();

        // Lấy URL của các file từ bài viết gốc, nếu có
        List<String> fileUrls = originalPost.getFileUrls() != null ?
                List.copyOf(originalPost.getFileUrls()) : List.of();

        // Tạo một bản ghi SharedPost thay vì Post
        SharedPost sharedPost = SharedPost.builder()
                .content(content)
                .userId(currentUserId)
                .fileUrls(fileUrls)
                .visibility(visibility)
                .createdDate(Instant.now())
                .modifiedDate(Instant.now())
                .like(0)
                .unlike(0)
                .commentCount(0)
                .originalPost(originalPost)
                .build();

        // Extract and save keywords for the shared post
        List<Keyword> extractedKeywords = keywordService.extractAndSaveKeywords(content);
        List<String> keywordIds = extractedKeywords.stream().map(Keyword::getId).collect(Collectors.toList());
        sharedPost.setKeywords(keywordIds);

        // Lưu bài viết chia sẻ mới vào SharedPostRepository
        sharedPost = sharedPostRepository.save(sharedPost);

        // Sử dụng ShareMapper để ánh xạ SharedPost sang PostResponse
        PostResponse postResponse = shareMapper.toPostResponse(sharedPost);
        postResponse.setKeywords(extractedKeywords.stream().map(Keyword::getPhrase).collect(Collectors.toList()));

        return ApiResponse.<PostResponse>builder()
                .code(200)
                .message("Post shared successfully")
                .result(postResponse)
                .build();
    }


    boolean isFriend(String currentUserId, String postUserId) {
        // TODO nối qua friend-service để check relationship
        return true;
    }

    private String extractFileNameFromUrl(String fileUrl) {
        // Ví dụ URL: https://image-0.s3.ap-southeast-2.amazonaws.com/1731100957786_2553d883.jpg
        String fileName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
        return fileName;
    }

    private String decodeUrl(String encodedUrl) {
        return URLDecoder.decode(encodedUrl, StandardCharsets.UTF_8);
    }

    public ApiResponse<byte[]> downloadImageFromPost(String postId, String imageFileName) {
        // Lấy bài viết từ cơ sở dữ liệu
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        // Kiểm tra xem bài viết có chứa URL của hình ảnh hay không
        List<String> fileUrls = post.getFileUrls();
        if (fileUrls == null || fileUrls.isEmpty()) {
            throw new RuntimeException("No images found in this post");
        }

        // Tìm URL khớp với tên file hình ảnh
        String matchedUrl = fileUrls.stream()
                .filter(url -> extractFileNameFromUrl(decodeUrl(url)).equals(imageFileName))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Image not found in this post"));

        // Tải dữ liệu hình ảnh từ Amazon S3
        byte[] imageData = s3Service.downloadFile(imageFileName);

        return ApiResponse.<byte[]>builder()
                .code(HttpStatus.OK.value())
                .message("Image downloaded successfully")
                .result(imageData)
                .build();
    }

    public ApiResponse<PostResponse> translatePostContent(String postId, String targetLanguage) {
        return translationService.translatePostContent(postId, targetLanguage);
    }
}