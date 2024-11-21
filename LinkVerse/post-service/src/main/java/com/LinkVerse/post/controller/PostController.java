package com.LinkVerse.post.controller;

import com.LinkVerse.post.FileUtil;
import com.LinkVerse.post.dto.ApiResponse;
import com.LinkVerse.post.dto.PageResponse;
import com.LinkVerse.post.dto.request.PostRequest;
import com.LinkVerse.post.dto.request.SharePostRequest;
import com.LinkVerse.post.dto.response.PostResponse;
import com.LinkVerse.post.service.PostService;
import com.LinkVerse.post.service.TranslationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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

    final PostService postService;
    TranslationService translationService;

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

    @PostMapping("/{postId}/share")
    public ApiResponse<PostResponse> sharePost(
            @PathVariable String postId,
            @RequestBody SharePostRequest request) {

        ApiResponse<PostResponse> response = postService.sharePost(postId, request.getContent(), request.getVisibility());

        // Trả về ApiResponse bao bọc PostResponse
        return ApiResponse.<PostResponse>builder()
                .code(response.getCode()) // Mã trạng thái HTTP
                .message(response.getMessage()) // Thông báo cho người dùng
                .result(response.getResult()) // Kết quả bài viết chia sẻ
                .build(); // Xây dựng ApiResponse
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

    @GetMapping("/download-image")
    public ResponseEntity<byte[]> downloadImage(
            @RequestParam String postId,
            @RequestParam String fileName) {
        try {
            // Tải hình ảnh từ bài viết
            ApiResponse<byte[]> response = postService.downloadImageFromPost(postId, fileName);

            String contentType = FileUtil.getContentTypeFromFileName(fileName);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType(contentType)); // Xác định Content-Type tự động
            headers.setContentDispositionFormData("attachment", fileName);

            return new ResponseEntity<>(response.getResult(), headers, HttpStatus.OK);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
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
}