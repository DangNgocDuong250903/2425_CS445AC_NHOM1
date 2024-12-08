package com.LinkVerse.post.service;

import com.LinkVerse.post.Mapper.StoryMapper;
import com.LinkVerse.post.dto.ApiResponse;
import com.LinkVerse.post.dto.request.StoryCreationRequest;
import com.LinkVerse.post.dto.response.StoryResponse;
import com.LinkVerse.post.entity.Story;
import com.LinkVerse.post.repository.StoryRepository;
import com.amazonaws.services.s3.model.S3Object;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class StoryService {

    StoryRepository storyRepository;
    StoryMapper storyMapper;
    S3ServiceStory s3ServiceStory;
    RekognitionService rekognitionService;

    static final int STORY_EXPIRATION_HOURS = 24;

    public ApiResponse<StoryResponse> createStory(StoryCreationRequest request, List<MultipartFile> files, String token) {
        String userId = getCurrentUserId();
        List<String> fileUrls = (files != null && files.stream().anyMatch(file -> !file.isEmpty()))
                ? s3ServiceStory.uploadFiles(files.stream().filter(file -> !file.isEmpty()).collect(Collectors.toList()))
                : List.of();

        List<String> safeFileUrls = new ArrayList<>();
        for (String fileUrl : fileUrls) {
            String fileName = extractFileNameFromUrl(decodeUrl(fileUrl));
            S3Object s3Object = s3ServiceStory.getObject(fileName);
            log.info("Checking image safety for file: {}", fileName);
            if (rekognitionService.isImageSafe(s3Object)) {
                safeFileUrls.add(fileUrl);
            } else {
                log.warn("Unsafe content detected in file: {}", fileName);
                s3ServiceStory.deleteFile(fileName);
            }
        }

        Story story = storyMapper.toEntity(request);
        story.setUserId(userId);
        story.setImageUrl(safeFileUrls);
        story.setPostedAt(LocalDateTime.now());
        story.setExpiryTime(story.getPostedAt().plusHours(STORY_EXPIRATION_HOURS));

        Story savedStory = storyRepository.save(story);

        StoryResponse storyResponse = storyMapper.toResponse(savedStory);
        return ApiResponse.<StoryResponse>builder()
                .code(200)
                .message("Story created successfully")
                .result(storyResponse)
                .build();
    }

    private List<String> uploadAndValidateFiles(List<MultipartFile> files) {
        if (files == null || files.isEmpty()) {
            return List.of();
        }

        List<String> uploadedUrls = s3ServiceStory.uploadFiles(
                files.stream().filter(file -> !file.isEmpty()).collect(Collectors.toList())
        );

        return uploadedUrls.stream().filter(fileUrl -> {
            String fileName = extractFileNameFromUrl(decodeUrl(fileUrl));
            S3Object s3Object = s3ServiceStory.getObject(fileName);
            if (!rekognitionService.isImageSafe(s3Object)) {
                log.warn("Unsafe content detected in file: {}", fileName);
                s3ServiceStory.deleteFile(fileName);
                return false;
            }
            return true;
        }).collect(Collectors.toList());
    }

    private String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User is not authenticated");
        }
        return authentication.getName();
    }

    private String extractFileNameFromUrl(String fileUrl) {
        if (fileUrl == null || fileUrl.isEmpty()) {
            throw new IllegalArgumentException("Invalid file URL");
        }
        return fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
    }

    private String decodeUrl(String encodedUrl) {
        return URLDecoder.decode(encodedUrl, StandardCharsets.UTF_8);
    }
}