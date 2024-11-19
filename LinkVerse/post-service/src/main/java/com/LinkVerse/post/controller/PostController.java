package com.LinkVerse.post.controller;

import com.LinkVerse.post.FileUtil;
import com.LinkVerse.post.dto.ApiResponse;
import com.LinkVerse.post.dto.PageResponse;
import com.LinkVerse.post.dto.request.PostRequest;
import com.LinkVerse.post.dto.request.SharePostRequest;
import com.LinkVerse.post.dto.response.PostResponse;
import com.LinkVerse.post.entity.PostDocument;
import com.LinkVerse.post.entity.PostVisibility;
import com.LinkVerse.post.repository.client.ProfileServiceClient;
import com.LinkVerse.post.service.PostService;
import com.LinkVerse.post.service.S3Service;
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

@RestController
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PostController {

    PostService postService;
    S3Service s3Service;
    ProfileServiceClient profileServiceClient;

    @PostMapping("/set-avatar")
    public ResponseEntity<String> updateImage(@RequestParam("userId") String userId,
                                            @RequestParam("request") String requestJson,
                                            @RequestParam("avatar") MultipartFile avatar) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        PostRequest request = objectMapper.readValue(requestJson, PostRequest.class);

        if (!FileUtil.isImageFile(avatar)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Only image files are allowed.");
        }

        postService.postImageAvatar(request, avatar);
        return ResponseEntity.ok("Avatar updated successfully.");
    }


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

    @GetMapping(value = "/search-posts", produces = "application/json")
    public ApiResponse<List<PostDocument>> searchPosts(
            @RequestParam(value = "searchString", required = false) String searchString,
            @RequestParam(value = "year", required = false) Integer year,
            @RequestParam(value = "visibility", required = false) PostVisibility visibility) {

        return postService.searchPosts(searchString, year, visibility);
    }

    @PostMapping("/{postId}/share")
    public ApiResponse<PostResponse> sharePost(
            @PathVariable String postId,
            @RequestBody SharePostRequest request) {

        ApiResponse<PostResponse> response = postService.sharePost(postId, request.getContent(), request.getVisibility());

        // Trả về ApiResponse bao bọc PostResponse
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
    public ApiResponse<PageResponse<PostResponse>> getMyPostsHistory(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        return postService.getMyPostsHistory(page, size);
    }
}