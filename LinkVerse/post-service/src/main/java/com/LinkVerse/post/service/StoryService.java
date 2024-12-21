package com.LinkVerse.post.service;

import com.LinkVerse.post.Mapper.StoryMapper;
import com.LinkVerse.post.dto.ApiResponse;
import com.LinkVerse.post.dto.PageResponse;
import com.LinkVerse.post.dto.request.StoryCreationRequest;
import com.LinkVerse.post.dto.response.StoryResponse;
import com.LinkVerse.post.entity.Story;
import com.LinkVerse.post.entity.StoryVisibility;
import com.LinkVerse.post.repository.StoryRepository;
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

    public ApiResponse<StoryResponse> createStory(StoryCreationRequest request, List<MultipartFile> files) {
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

    public ApiResponse<PageResponse<StoryResponse>> getAllStories(int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by(Sort.Order.desc("postedAt")));
        Page<Story> pageData = storyRepository.findAll(pageable);

        List<Story> stories = pageData.getContent().stream()
                .filter(story -> story.getVisibility() == StoryVisibility.PUBLIC)
                .collect(Collectors.toList());

        return ApiResponse.<PageResponse<StoryResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Stories retrieved successfully")
                .result(PageResponse.<StoryResponse>builder()
                        .currentPage(page)
                        .pageSize(size)
                        .totalPage(pageData.getTotalPages())
                        .totalElement(pageData.getTotalElements())
                        .data(stories.stream().map(storyMapper::toResponse).collect(Collectors.toList()))
                        .build())
                .build();
    }

    public ApiResponse<PageResponse<StoryResponse>> getStoriesByUser(int page, int size, String userId) {
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by(Sort.Order.desc("postedAt")));
        Page<Story> pageData = storyRepository.findByUserId(userId, pageable);

        List<Story> stories = pageData.getContent().stream()
                .filter(story -> story.getVisibility() == StoryVisibility.PUBLIC ||
                        (story.getVisibility() == StoryVisibility.PRIVATE && story.getUserId().equals(getCurrentUserId())))
                .collect(Collectors.toList());

        return ApiResponse.<PageResponse<StoryResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("User's stories retrieved successfully")
                .result(PageResponse.<StoryResponse>builder()
                        .currentPage(page)
                        .pageSize(size)
                        .totalPage(pageData.getTotalPages())
                        .totalElement(pageData.getTotalElements())
                        .data(stories.stream().map(storyMapper::toResponse).collect(Collectors.toList()))
                        .build())
                .build();
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