package com.LinkVerse.post.controller;

import com.LinkVerse.post.FileUtil;
import com.LinkVerse.post.dto.ApiResponse;
import com.LinkVerse.post.dto.PageResponse;
import com.LinkVerse.post.dto.request.CommentRequest;
import com.LinkVerse.post.dto.request.PostRequest;
import com.LinkVerse.post.dto.response.PostResponse;
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
import org.springframework.ui.Model;
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

    // Create a new post with file
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

    // Delete a post
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePost(@PathVariable String id) {
        log.info("Delete post request: {}", id);
        ApiResponse<Void> response = postService.deletePost(id);
        return ResponseEntity.ok(response);
    }

   // Get my posts
   @GetMapping("/my-posts")
public ResponseEntity<ApiResponse<PageResponse<PostResponse>>> getMyPosts(
        @RequestParam(value = "page", required = false, defaultValue = "1") int page,
        @RequestParam(value = "size", required = false, defaultValue = "10") int size
) {
    log.info("Get my posts, page: {}, size: {}", page, size);
    // Không cần bao nó trong một ApiResponse khác
    ApiResponse<PageResponse<PostResponse>> response = postService.getMyPosts(page, size);
    return ResponseEntity.ok(response);
}


    // Share a post
    @PostMapping("/{postId}/share")
    public ResponseEntity<ApiResponse<PostResponse>> sharePost(@PathVariable String postId, @RequestBody PostRequest postRequest) {
        log.info("Share post request: {}, with content: {}", postId, postRequest.getContent());
        ApiResponse<PostResponse> response = postService.sharePost(postId, postRequest.getContent());
        return ResponseEntity.ok(response);
    }
}