package com.LinkVerse.post.service;


import com.LinkVerse.post.FileUtil;
import com.LinkVerse.post.Mapper.PostHistoryMapper;
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
import com.LinkVerse.post.repository.client.IdentityServiceClient;
import com.LinkVerse.post.repository.client.ProfileServiceClient;
import com.amazonaws.SdkClientException;
import com.amazonaws.services.s3.model.S3Object;
import feign.FeignException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.EnumUtils;
import org.springframework.data.domain.Page;
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
import java.util.*;
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
    PostHistoryMapper postHistoryMapper;
    KeywordService keywordService;
    KafkaTemplate<String, Object> kafkaTemplate;
    S3Service s3Service;
    ContentModerationService contentModerationService;
    TranslationService translationService;
    RekognitionService rekognitionService;
    SentimentAnalysisService sentimentAnalysisService;
    IdentityServiceClient identityServiceClient;
    TagProcessor tagProcessor;
    HashtagRepository hashtagRepository;
    ProfileServiceClient profileServiceClient;

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
            String avatarUrl = s3Service.uploadFile(avatarFile);

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
                    .imgAvatarUrl(avatarUrl)
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
                identityServiceClient.updateImage(currentUserId, post.getImgAvatarUrl());
                profileServiceClient.updateImage(currentUserId, post.getImgAvatarUrl());

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

        List<PostResponse> sharedPostResponses = post.getSharedPost() != null
                ? shareMapper.toPostResponseList(post.getSharedPost())
                : null;

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
                .sharedPost(sharedPostResponses)
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
                        .data(posts.stream()
                                .map(postHistoryMapper::toPostResponse) // Use PostHistoryMapper here
                                .collect(Collectors.toList()))
                        .build())
                .build();
    }

    public ApiResponse<PageResponse<PostResponse>> getPostsByLanguage(int page, int size, String language) {
        Sort sort = Sort.by(Sort.Order.desc("createdDate"));
        Pageable pageable = PageRequest.of(page - 1, size, sort);

        var pageData = postRepository.findAllByLanguage(language, pageable);

        List<Post> posts = pageData.getContent().stream()
                .filter(post -> post.getVisibility() == PostVisibility.PUBLIC ||
                        (post.getVisibility() == PostVisibility.PRIVATE && post.getUserId().equals(SecurityContextHolder.getContext().getAuthentication().getName())))
                .collect(Collectors.toList());

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

    public ApiResponse<PostResponse> changePostVisibility(String postId, PostVisibility newVisibility) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserId = authentication.getName();

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!post.getUserId().equals(currentUserId)) {
            throw new RuntimeException("You are not authorized to change the visibility of this post");
        }

        // Update the visibility
        post.setVisibility(newVisibility);
        post.setModifiedDate(Instant.now());
        post = postRepository.save(post);

        // Map the updated post to PostResponse
        PostResponse postResponse = postMapper.toPostResponse(post);

        return ApiResponse.<PostResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Post visibility updated successfully")
                .result(postResponse)
                .build();
    }

    public ApiResponse<PageResponse<PostResponse>> getMyPosts(int page, int size, boolean includeDeleted) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userID = authentication.getName();

        Sort sort = Sort.by(Sort.Order.desc("createdDate"));
        Pageable pageable = PageRequest.of(page - 1, size, sort);

        var pageData = postRepository.findAllByUserId(userID, pageable);

        List<Post> filteredPosts = pageData.getContent().stream()
                .filter(post -> post.getVisibility() == PostVisibility.PUBLIC ||
                        (post.getVisibility() == PostVisibility.FRIENDS && isFriend(userID, post.getUserId())) ||
                        post.getVisibility() == PostVisibility.PRIVATE)
                .filter(post -> includeDeleted || !post.isDeleted())
                .filter(post -> post.getGroupId() == null)
                .toList();

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
        Post originalPost = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (originalPost.isDeleted()) {
            throw new RuntimeException("Cannot share a deleted post.");
        }

        if (originalPost.getVisibility() == PostVisibility.PRIVATE &&
                !originalPost.getUserId().equals(SecurityContextHolder.getContext().getAuthentication().getName())) {
            throw new RuntimeException("You are not authorized to share this post.");
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserId = authentication.getName();

        List<String> fileUrls = originalPost.getImageUrl() != null ?
                List.copyOf(originalPost.getImageUrl()) : List.of();

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
                .language(originalPost.getLanguage())
                .primarySentiment(originalPost.getPrimarySentiment())
                .build();

        List<Keyword> extractedKeywords = keywordService.extractAndSaveKeyPhrases(content, sharedPost.getId());
        List<String> keywordIds = extractedKeywords.stream().map(Keyword::getId).collect(Collectors.toList());
        sharedPost.setKeywords(keywordIds);

        sharedPost = sharedPostRepository.save(sharedPost);

        PostResponse postResponse = shareMapper.toPostResponse(sharedPost);

        return ApiResponse.<PostResponse>builder()
                .code(200)
                .message("Post shared successfully")
                .result(postResponse)
                .build();
    }

    public ApiResponse<PageResponse<PostResponse>> getAllPost(int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size);
        var pageData = postRepository.findByVisibilityNot(PostVisibility.PRIVATE, pageable); // lấy các bài viết != PRIVATE

        List<Post> posts = pageData.getContent().stream()
                .filter(post -> post.getGroupId() == null) // tìm post k có groupId
                .collect(Collectors.toList());

        List<Post> modifiablePosts = new ArrayList<>(posts);
        Collections.shuffle(modifiablePosts);

        return ApiResponse.<PageResponse<PostResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Posts retrieved successfully")
                .result(PageResponse.<PostResponse>builder()
                        .currentPage(page)
                        .pageSize(size)
                        .totalPage(pageData.getTotalPages())
                        .totalElement(pageData.getTotalElements())
                        .data(modifiablePosts.stream()
                                .map(postMapper::toPostResponse)
                                .collect(Collectors.toList()))
                        .build())
                .build();
    }

    public ApiResponse<PageResponse<PostResponse>> getUserPost(int page, int size, String userId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserId = authentication.getName();
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<Post> originalPostsPage = postRepository.findPostByUserId(userId, pageable);
        Page<SharedPost> sharedPostsPage = sharedPostRepository.findSharedPostByUserId(userId, pageable);

        boolean isFriend = profileServiceClient.areFriends(currentUserId, userId);

        List<Post> originalPosts = originalPostsPage.getContent().stream()
                .filter(post -> post.getVisibility() == PostVisibility.PUBLIC ||
                        (post.getVisibility() == PostVisibility.FRIENDS && isFriend) ||
                        (post.getVisibility() == PostVisibility.PRIVATE && post.getUserId().equals(currentUserId)))
                .filter(post -> post.getGroupId() == null)
                .toList();

        List<Post> sharedPosts = sharedPostsPage.getContent().stream()
                .filter(sharedPost -> sharedPost.getVisibility() == PostVisibility.PUBLIC ||
                        (sharedPost.getVisibility() == PostVisibility.FRIENDS && isFriend) ||
                        (sharedPost.getVisibility() == PostVisibility.PRIVATE && sharedPost.getUserId().equals(currentUserId)))
                .map(Post.class::cast)
                .toList();

        List<Post> combinedPosts = new ArrayList<>(originalPosts);
        combinedPosts.addAll(sharedPosts);

        combinedPosts.sort(Comparator.comparing(Post::getCreatedDate).reversed());

        return ApiResponse.<PageResponse<PostResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Posts retrieved successfully")
                .result(PageResponse.<PostResponse>builder()
                        .currentPage(page)
                        .pageSize(size)
                        .totalPage(Math.max(originalPostsPage.getTotalPages(), sharedPostsPage.getTotalPages()))
                        .totalElement(originalPostsPage.getTotalElements() + sharedPostsPage.getTotalElements())
                        .data(combinedPosts.stream().map(postMapper::toPostResponse).collect(Collectors.toList()))
                        .build())
                .build();
    }

    public ApiResponse<PostResponse> getPostById(String postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (post.getVisibility() == PostVisibility.PRIVATE &&
                !post.getUserId().equals(SecurityContextHolder.getContext().getAuthentication().getName())) {
            throw new RuntimeException("You are not authorized to view this post.");
        }

        PostResponse postResponse = postMapper.toPostResponse(post);

        return ApiResponse.<PostResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Post retrieved successfully")
                .result(postResponse)
                .build();
    }

    public ApiResponse<PostResponse> savePost(String postId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserId = authentication.getName();

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (post.getVisibility() == PostVisibility.PRIVATE &&
                !post.getUserId().equals(currentUserId)) {
            throw new RuntimeException("You are not authorized to save this post.");
        }

        if (post.getSavedBy().contains(currentUserId)) {
            return ApiResponse.<PostResponse>builder()
                    .code(HttpStatus.BAD_REQUEST.value())
                    .message("Post already saved")
                    .build();
        }

        post.getSavedBy().add(currentUserId);
        post = postRepository.save(post);

        PostResponse postResponse = postMapper.toPostResponse(post);

        return ApiResponse.<PostResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Post saved successfully")
                .result(postResponse)
                .build();
    }

    public ApiResponse<PostResponse> unSavePost(String postId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserId = authentication.getName();

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (post.getVisibility() == PostVisibility.PRIVATE &&
                !post.getUserId().equals(currentUserId)) {
            throw new RuntimeException("You are not authorized to save this post.");
        }

        if (post.getSavedBy().contains(currentUserId)) {
            return ApiResponse.<PostResponse>builder()
                    .code(HttpStatus.BAD_REQUEST.value())
                    .message("Post not be saved")
                    .build();
        }

        post.getSavedBy().remove(currentUserId);
        post = postRepository.save(post);

        PostResponse postResponse = postMapper.toPostResponse(post);

        return ApiResponse.<PostResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Post saved successfully")
                .result(postResponse)
                .build();
    }

    public ApiResponse<PageResponse<PostResponse>> getAllPostsave(int page, int size) {
        if (page < 1 || size < 1) {
            return ApiResponse.<PageResponse<PostResponse>>builder()
                    .code(HttpStatus.BAD_REQUEST.value())
                    .message("Page and size parameters must be greater than 0.")
                    .build();
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null) {
            return ApiResponse.<PageResponse<PostResponse>>builder()
                    .code(HttpStatus.UNAUTHORIZED.value())
                    .message("User is not authenticated.")
                    .build();
        }

        String currentUserId = authentication.getName();

        try {
            Pageable pageable = PageRequest.of(page - 1, size);
            var pageData = postRepository.findAllBySavedBy(currentUserId, pageable);

            List<PostResponse> postResponses = pageData.getContent().stream()
                    .filter(post -> post.getVisibility() == PostVisibility.PUBLIC ||
                            (post.getVisibility() == PostVisibility.PRIVATE && post.getUserId().equals(currentUserId)))
                    .map(postMapper::toPostResponse)
                    .collect(Collectors.toList());

            PageResponse<PostResponse> pageResponse = PageResponse.<PostResponse>builder()
                    .currentPage(page)
                    .pageSize(size)
                    .totalPage(pageData.getTotalPages())
                    .totalElement(pageData.getTotalElements())
                    .data(postResponses)
                    .build();

            return ApiResponse.<PageResponse<PostResponse>>builder()
                    .code(HttpStatus.OK.value())
                    .message("Saved posts retrieved successfully")
                    .result(pageResponse)
                    .build();

        } catch (Exception ex) {
            log.error("Failed to retrieve saved posts for user: {}", currentUserId, ex);
            return ApiResponse.<PageResponse<PostResponse>>builder()
                    .code(HttpStatus.INTERNAL_SERVER_ERROR.value())
                    .message("An error occurred while retrieving saved posts.")
                    .build();
        }
    }

    public boolean isFriend(String currentUserId, String postUserId) {
        return profileServiceClient.areFriends(currentUserId, postUserId);
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