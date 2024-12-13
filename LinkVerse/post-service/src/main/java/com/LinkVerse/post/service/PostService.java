package com.LinkVerse.post.service;


import com.LinkVerse.post.FileUtil;
import com.LinkVerse.post.Mapper.PostMapper;
import com.LinkVerse.post.Mapper.ShareMapper;
import com.LinkVerse.post.configuration.TagProcessor;
import com.LinkVerse.post.dto.ApiResponse;
import com.LinkVerse.post.dto.PageResponse;
import com.LinkVerse.post.dto.request.PostRequest;
import com.LinkVerse.post.dto.response.PostResponse;
import com.LinkVerse.post.entity.*;
import com.LinkVerse.post.repository.HashtagRepository;
import com.LinkVerse.post.repository.PostHistoryRepository;
import com.LinkVerse.post.repository.PostRepository;
import com.LinkVerse.post.repository.SharedPostRepository;
import com.LinkVerse.post.repository.client.ProfileServiceClient;
import com.amazonaws.SdkClientException;
import com.amazonaws.services.s3.model.S3Object;
import feign.FeignException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.EnumUtils;
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
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
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
    @Autowired
    RekognitionService rekognitionService;
    SentimentAnalysisService sentimentAnalysisService;
    ProfileServiceClient profileServiceClient;

    @Autowired
    private TagProcessor tagProcessor;

    @Autowired
    private HashtagRepository hashtagRepository;

    public List<Post> getPostsByHashtag(String hashtagName) {
        Hashtag hashtag = hashtagRepository.findByName(hashtagName);
        if (hashtag == null) {
            throw new RuntimeException("Hashtag not found");
        }
        return hashtag.getPosts();
    }

    public ApiResponse<PostResponse> postImageAvatar(PostRequest request, MultipartFile avatarFile) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserId = authentication.getName();

        // Check if the content is appropriate
        if (!contentModerationService.isContentAppropriate(request.getContent())) {
            return ApiResponse.<PostResponse>builder()
                    .code(HttpStatus.BAD_REQUEST.value())
                    .message("Post content is inappropriate and violates our content policy.")
                    .build();
        }

        try {
            // Validate if the uploaded file is an image
            if (avatarFile == null || avatarFile.isEmpty() || !FileUtil.isImageFile(avatarFile)) {
                return ApiResponse.<PostResponse>builder()
                        .code(HttpStatus.BAD_REQUEST.value())
                        .message("Only non-empty image files are allowed.")
                        .build();
            }

            // Upload the avatar file to S3 and get the URL
            String avatarUrl = s3Service.uploadFiles(List.of(avatarFile)).get(0);

            // Validate and set visibility
            PostVisibility visibility = request.getVisibility();
            if (visibility == null) {
                visibility = PostVisibility.PUBLIC; // Default visibility
            } else if (!EnumUtils.isValidEnum(PostVisibility.class, visibility.name())) {
                return ApiResponse.<PostResponse>builder()
                        .code(HttpStatus.BAD_REQUEST.value())
                        .message("Invalid visibility value.")
                        .build();
            }

            Post post = Post.builder()
                    .content(request.getContent())
                    .userId(currentUserId)
                    .imageUrl(List.of(avatarUrl))
                    .visibility(visibility)
                    .createdDate(Instant.now())
                    .modifiedDate(Instant.now())
                    .like(0)
                    .unlike(0)
                    .comments(new ArrayList<>())
                    .build();

            String languageCode = keywordService.detectDominantLanguage(request.getContent());
            post.setLanguage(languageCode);

            List<Keyword> extractedKeywords = keywordService.extractAndSaveKeyPhrases(request.getContent(), post.getId());
            List<String> keywordIds = extractedKeywords.stream().map(Keyword::getId).collect(Collectors.toList());
            post.setKeywords(keywordIds);

            // Save the post first to generate the ID
            post = postRepository.save(post);

            Set<String> hashtags = tagProcessor.extractHashtags(request.getContent());
            List<Hashtag> hashtagEntities = new ArrayList<>();
            for (String hashtag : hashtags) {
                Hashtag existingHashtag = hashtagRepository.findByName(hashtag);
                if (existingHashtag == null) {
                    Hashtag newHashtag = new Hashtag();
                    newHashtag.setName(hashtag);
                    newHashtag.addPost(post);
                    hashtagEntities.add(hashtagRepository.save(newHashtag));
                } else {
                    existingHashtag.addPost(post);
                    hashtagEntities.add(hashtagRepository.save(existingHashtag));
                }
            }
            post.setHashtags(hashtagEntities);

            sentimentAnalysisService.analyzeAndSaveSentiment(post);

            post = postRepository.save(post);

            PostResponse postResponse = postMapper.toPostResponse(post);

            try {
                profileServiceClient.updateImage(currentUserId, avatarFile);
            } catch (FeignException e) {
                log.error("Error updating avatar in profile-service: {}", e.getMessage(), e);
                return ApiResponse.<PostResponse>builder()
                        .code(HttpStatus.INTERNAL_SERVER_ERROR.value())
                        .message("Failed to update avatar in profile-service.")
                        .build();
            }

            // Return a successful response
            return ApiResponse.<PostResponse>builder()
                    .code(HttpStatus.OK.value())
                    .message("Avatar post created successfully and profile updated.")
                    .result(postResponse)
                    .build();
        } catch (SdkClientException e) {
            log.error("AWS S3 Exception while uploading file: ", e);
            return ApiResponse.<PostResponse>builder()
                    .code(HttpStatus.INTERNAL_SERVER_ERROR.value())
                    .message("Failed to upload file due to AWS S3 issues.")
                    .build();
        } catch (Exception e) {
            log.error("Unexpected exception: ", e);
            return ApiResponse.<PostResponse>builder()
                    .code(HttpStatus.INTERNAL_SERVER_ERROR.value())
                    .message("An unexpected error occurred.")
                    .build();
        }
    }

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
            //1 mang luu tru cac file anh an toan, neu co file anh khong an toan thi xoa file do
            List<String> safeFileUrls = new ArrayList<>();
            for (String fileUrl : fileUrls) {
                String fileName = extractFileNameFromUrl(decodeUrl(fileUrl));
                S3Object s3Object = s3Service.getObject(fileName);
                log.info("Checking image safety for file: {}", fileName);
                if (rekognitionService.isImageSafe(s3Object)) {
                    safeFileUrls.add(fileUrl);
                } else {
                    log.warn("Unsafe content detected in file: {}", fileName);
                    s3Service.deleteFile(fileName);
                }
            }
            Post post = Post.builder()
                    .content(request.getContent())
                    .userId(authentication.getName())
                    .imageUrl(safeFileUrls) //-> cho ra " " vi pham an toan
                    .visibility(request.getVisibility())
                    .createdDate(Instant.now())
                    .modifiedDate(Instant.now())
                    .like(0)
                    .unlike(0)
                    .comments(List.of())
                    .build();

            String languageCode = keywordService.detectDominantLanguage(request.getContent());
            post.setLanguage(languageCode);

            List<Keyword> extractedKeywords = keywordService.extractAndSaveKeyPhrases(request.getContent(), post.getId());
            List<String> keywordIds = extractedKeywords.stream().map(Keyword::getId).collect(Collectors.toList());
            post.setKeywords(keywordIds);

            // Save the post first to generate the ID
            post = postRepository.save(post);

            // Extract and save hashtags
            Set<String> hashtags = tagProcessor.extractHashtags(request.getContent());
            List<Hashtag> hashtagEntities = new ArrayList<>();
            for (String hashtag : hashtags) {
                Hashtag existingHashtag = hashtagRepository.findByName(hashtag);
                if (existingHashtag == null) {
                    Hashtag newHashtag = new Hashtag();
                    newHashtag.setName(hashtag);
                    newHashtag.addPost(post);
                    hashtagEntities.add(hashtagRepository.save(newHashtag));
                } else {
                    existingHashtag.addPost(post);
                    hashtagEntities.add(hashtagRepository.save(existingHashtag));
                }
            }
            post.setHashtags(hashtagEntities);

            sentimentAnalysisService.analyzeAndSaveSentiment(post);

            post = postRepository.save(post);
            PostResponse postResponse = postMapper.toPostResponse(post);

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

        List<String> fileUrls = post.getImageUrl();
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
                .fileUrls(post.getImageUrl())
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
        List<String> fileUrls = originalPost.getImageUrl() != null ?
                List.copyOf(originalPost.getImageUrl()) : List.of();

        // Tạo một bản ghi SharedPost thay vì Post
        SharedPost sharedPost = SharedPost.builder()
                .content(content)
                .userId(currentUserId)
                .imageUrl(fileUrls)
                .visibility(visibility)
                .createdDate(Instant.now())
                .modifiedDate(Instant.now())
                .like(0)
                .unlike(0)
                .commentCount(0)
                .originalPost(originalPost)
                .build();

        // Extract and save keywords for the shared post
        List<Keyword> extractedKeywords = keywordService.extractAndSaveKeyPhrases(content, sharedPost.getId());
        List<String> keywordIds = extractedKeywords.stream().map(Keyword::getId).collect(Collectors.toList());
        sharedPost.setKeywords(keywordIds);


        // Lưu bài viết chia sẻ mới vào SharedPostRepository
        sharedPost = sharedPostRepository.save(sharedPost);

        // Sử dụng ShareMapper để ánh xạ SharedPost sang PostResponse
        PostResponse postResponse = shareMapper.toPostResponse(sharedPost);

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

    public ApiResponse<PostResponse> translatePostContent(String postId, String targetLanguage) {
        return translationService.translatePostContent(postId, targetLanguage);
    }
}