package com.LinkVerse.post.service;


import com.LinkVerse.post.Mapper.PostMapper;
import com.LinkVerse.post.Mapper.ShareMapper;
import com.LinkVerse.post.configuration.TagProcessor;
import com.LinkVerse.post.dto.ApiResponse;
import com.LinkVerse.post.dto.PageResponse;
import com.LinkVerse.post.dto.request.PostGroupRequest;
import com.LinkVerse.post.dto.response.PostGroupResponse;
import com.LinkVerse.post.dto.response.PostResponse;
import com.LinkVerse.post.entity.*;
import com.LinkVerse.post.repository.HashtagRepository;
import com.LinkVerse.post.repository.PostGroupRepository;
import com.LinkVerse.post.repository.PostHistoryRepository;
import com.LinkVerse.post.repository.PostRepository;
import com.LinkVerse.post.repository.client.IdentityServiceClient;
import com.amazonaws.SdkClientException;
import com.amazonaws.services.s3.model.S3Object;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PostGroupService {
    PostGroupRepository postGroupRepository;
    PostMapper postMapper;
    KeywordService keywordService;
    S3Service s3Service;
    ContentModerationService contentModerationService;
    TranslationService translationService;
    RekognitionService rekognitionService;
    SentimentAnalysisService sentimentAnalysisService;
    IdentityServiceClient identityServiceClient;

    public ApiResponse<PostGroupResponse> createPostGroup(PostGroupRequest request, List<MultipartFile> files) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserId = authentication.getName();

        boolean isInGroup = identityServiceClient.isUserInGroup(request.getGroupId());
        if (!isInGroup) {
            return ApiResponse.<PostGroupResponse>builder()
                    .code(HttpStatus.BAD_REQUEST.value())
                    .message("User is not in the group.")
                    .build();
        }

        if (!contentModerationService.isContentAppropriate(request.getContent())) {
            return ApiResponse.<PostGroupResponse>builder()
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

            PostGroup post = PostGroup.builder()
                    .content(request.getContent())
                    .userId(currentUserId)
                    .imageUrl(safeFileUrls)
                    .createdDate(Instant.now())
                    .modifiedDate(Instant.now())
                    .groupId(request.getGroupId())
                    .like(0)
                    .unlike(0)
                    .comments(List.of())
                    .build();

            String languageCode = keywordService.detectDominantLanguage(request.getContent());
            post.setLanguage(languageCode);

            List<Keyword> extractedKeywords = keywordService.extractAndSaveKeyPhrases(request.getContent(), post.getId());
            List<String> keywordIds = extractedKeywords.stream().map(Keyword::getId).collect(Collectors.toList());
            post.setKeywords(keywordIds);

            post = postGroupRepository.save(post);

            sentimentAnalysisService.analyzeAndSaveSentiment(post);

            post = postGroupRepository.save(post);

            PostGroupResponse postResponse = postMapper.toPostGroupResponse(post);

            return ApiResponse.<PostGroupResponse>builder()
                    .code(200)
                    .message("Post created successfully")
                    .result(postResponse)
                    .build();
        } catch (SdkClientException e) {
            log.error("AWS S3 Exception: ", e);

            return ApiResponse.<PostGroupResponse>builder()
                    .code(HttpStatus.BAD_REQUEST.value())
                    .message("Failed to upload files due to AWS configuration issues.")
                    .build();
        }
    }

    public ApiResponse<Void> deletePost(String postId) {
        PostGroup post = postGroupRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserId = authentication.getName();

        if (!post.getUserId().equals(currentUserId)) {
            throw new RuntimeException("Not authorized to delete this post");
        }

        boolean isInGroup = identityServiceClient.isUserInGroup(post.getGroupId());
        if (!isInGroup) {
            return ApiResponse.<Void>builder()
                    .code(HttpStatus.BAD_REQUEST.value())
                    .message("User is not in the group.")
                    .build();
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
        postGroupRepository.delete(post);

        return ApiResponse.<Void>builder()
                .code(HttpStatus.OK.value())
                .message("Post deleted and moved to history successfully")
                .build();
    }


    public ApiResponse<PageResponse<PostGroupResponse>> getAllPost(int page, int size, String groupId) {
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by(Sort.Order.asc("createdDate")));

        boolean isInGroup = identityServiceClient.isUserInGroup(groupId);
        if (!isInGroup) {
            return ApiResponse.<PageResponse<PostGroupResponse>>builder()
                    .code(HttpStatus.BAD_REQUEST.value())
                    .message("User is not in the group.")
                    .build();
        }

        var pageData = postGroupRepository.findAll(pageable);

        List<PostGroup> posts = pageData.getContent().stream()
                .filter(post -> groupId.equals(post.getGroupId())) // Use equals method to compare strings
                .toList();

        return ApiResponse.<PageResponse<PostGroupResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Posts retrieved successfully")
                .result(PageResponse.<PostGroupResponse>builder()
                        .currentPage(page)
                        .pageSize(size)
                        .totalPage(pageData.getTotalPages())
                        .totalElement(pageData.getTotalElements())
                        .data(posts.stream()
                                .map(postMapper::toPostGroupResponse)
                                .collect(Collectors.toList()))
                        .build())
                .build();
    }

    public ApiResponse<PageResponse<PostGroupResponse>> getUserPost(int page, int size, String userId, String groupId) {
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by(Sort.Order.asc("createdDate")));

        boolean isInGroup = identityServiceClient.isUserInGroup(groupId);
        if (!isInGroup) {
            return ApiResponse.<PageResponse<PostGroupResponse>>builder()
                    .code(HttpStatus.BAD_REQUEST.value())
                    .message("User is not in the group.")
                    .build();
        }

        Page<PostGroup> pageData = postGroupRepository.findPostByUserId(userId, pageable);

        List<PostGroup> posts = pageData.getContent().stream()
                .filter(post -> post.getGroupId() != null) // Find posts containing 'groupId'
                .toList();

        return ApiResponse.<PageResponse<PostGroupResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Posts retrieved successfully")
                .result(PageResponse.<PostGroupResponse>builder()
                        .currentPage(page)
                        .pageSize(size)
                        .totalPage(pageData.getTotalPages())
                        .totalElement(pageData.getTotalElements())
                        .data(posts.stream()
                                .map(postMapper::toPostGroupResponse)
                                .collect(Collectors.toList()))
                        .build())
                .build();
    }

    public ApiResponse<PostGroupResponse> getPostById(String postId, String groupId) {
        PostGroup post = postGroupRepository.findById(postId)
                .filter(p -> p.getGroupId() != null && p.getGroupId().equals(groupId)) // Check if groupId matches
                .orElseThrow(() -> new RuntimeException("Post not found or groupId does not match"));

        // Map the PostGroup entity to PostResponse DTO
        PostGroupResponse postResponse = postMapper.toPostGroupResponse(post);

        // Return the ApiResponse with the post data
        return ApiResponse.<PostGroupResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Post retrieved successfully")
                .result(postResponse)
                .build();
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