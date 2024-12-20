package com.LinkVerse.post.controller;

import com.LinkVerse.post.FileUtil;
import com.LinkVerse.post.Mapper.PostMapper;
import com.LinkVerse.post.dto.ApiResponse;
import com.LinkVerse.post.dto.PageResponse;
import com.LinkVerse.post.dto.request.PostRequest;
import com.LinkVerse.post.dto.request.SharePostRequest;
import com.LinkVerse.post.dto.response.PostResponse;
import com.LinkVerse.post.entity.Post;
import com.LinkVerse.post.entity.PostVisibility;
import com.LinkVerse.post.service.PostService;
import com.LinkVerse.post.service.TranslationService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PostController {

    final PostService postService;
    TranslationService translationService;
    PostMapper postMapper;

    @GetMapping("/hashtags/{hashtagName}/posts")
    public ResponseEntity<ApiResponse<List<PostResponse>>> getPostsByHashtag(@PathVariable String hashtagName) {
        List<Post> posts = postService.getPostsByHashtag(hashtagName);
        List<PostResponse> postResponses = posts.stream()
                .map(postMapper::toPostResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.<List<PostResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Posts retrieved successfully")
                .result(postResponses)
                .build());
    }

    // Create a new post
    @PostMapping("/post-file")
    public ResponseEntity<ApiResponse<PostResponse>> createPostWithImage(
            @RequestParam("request") String requestJson,
            @RequestParam("files") List<MultipartFile> files) throws IOException {

        // Chuyển String JSON thành PostRequest
        ObjectMapper objectMapper = new ObjectMapper();
        PostRequest request = objectMapper.readValue(requestJson, PostRequest.class);

        ApiResponse<PostResponse> response = postService.createPostWithFiles(request, files);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/set-avatar")
    public ResponseEntity<String> updateImage(@RequestParam("request") String requestJson,
                                              @RequestParam("avatar") MultipartFile avatar) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        PostRequest request = objectMapper.readValue(requestJson, PostRequest.class);
        if (!FileUtil.isImageFile(avatar)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Only image files are allowed.");
        }
        postService.postImageAvatar(request, avatar);
        return ResponseEntity.ok("Avatar updated successfully.");
    }

    @PostMapping("/{postId}/share")
    public ApiResponse<PostResponse> sharePost(
            @PathVariable String postId,
            @RequestBody SharePostRequest request) {

        ApiResponse<PostResponse> response = postService.sharePost(postId, request.getContent(), request.getVisibility());

        return ApiResponse.<PostResponse>builder()
                .code(response.getCode())
                .message(response.getMessage())
                .result(response.getResult())
                .build();
    }


    // Delete a post
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePost(@PathVariable String id) {
        log.info("Delete post request: {}", id);
        ApiResponse<Void> response = postService.deletePost(id);
        return ResponseEntity.ok(response);
    }

    // Get my posts
    @GetMapping("/my-posts")
    public ApiResponse<PageResponse<PostResponse>> getMyPosts(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "false") boolean includeDeleted) {
        return postService.getMyPosts(page, size, includeDeleted);
    }

    @GetMapping("/history")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<PageResponse<PostResponse>> getHistoryPosts(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        return postService.getHistoryPosts(page, size);
    }


    @PostMapping("/{postId}/translate")
    public ResponseEntity<ApiResponse<PostResponse>> translatePostContent(
            @PathVariable String postId,
            @RequestParam String targetLanguage) {
        ApiResponse<PostResponse> response = translationService.translatePostContent(postId, targetLanguage);
        return ResponseEntity.status(response.getCode()).body(response);
    }

    @GetMapping("/by-language")
    public ApiResponse<PageResponse<PostResponse>> getPostsByLanguage(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam String language) {
        return postService.getPostsByLanguage(page, size, language);
    }

    @GetMapping("/{postId}")
    public ApiResponse<PostResponse> getPostById(@PathVariable String postId) {
        return postService.getPostById(postId);
    }

    @PostMapping("/{postId}/change-visibility")
    public ResponseEntity<ApiResponse<PostResponse>> changePostVisibility(
            @PathVariable String postId,
            @RequestParam String visibility) {
        try {
            PostVisibility newVisibility = PostVisibility.valueOf(visibility.toUpperCase());
            ApiResponse<PostResponse> response = postService.changePostVisibility(postId, newVisibility);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.<PostResponse>builder()
                            .code(HttpStatus.FORBIDDEN.value())
                            .message(e.getMessage())
                            .build());
        }
    }


    @GetMapping("/all")
    public ApiResponse<PageResponse<PostResponse>> getAllPost(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        return postService.getAllPost(page, size);
    }

    @GetMapping("/user-posts")
    public ApiResponse<PageResponse<PostResponse>> getAllPost(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam String userId) {
        return postService.getUserPost(page, size, userId);
    }

    @PostMapping("/{postId}/save")
    public ApiResponse<PostResponse> savePost(@PathVariable String postId) {
        return postService.savePost(postId);
    }

    @GetMapping("/saved-posts")
    public ApiResponse<PageResponse<PostResponse>> getSavedPosts(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        return postService.getAllPostsave(page, size);
    }
}