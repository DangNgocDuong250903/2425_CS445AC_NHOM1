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
import com.LinkVerse.post.service.SearchService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
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
    SearchService searchService;
    S3Service s3Service;
    ProfileServiceClient profileServiceClient;

    @PostMapping("/set-avatar")
    public ResponseEntity<String> updateImage(
            @Parameter(description = "User ID for setting avatar", required = true)
            @RequestParam("userId") String userId,

            @Parameter(description = "Post request in JSON format", required = true)
            @RequestParam("request") String requestJson,

            @Parameter(description = "Avatar image file", required = true)
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
            @Parameter(description = "Post request in JSON format", required = true)
            @RequestParam("request") String requestJson,

            @Parameter(description = "List of files to upload", required = true)
            @RequestParam("files") List<MultipartFile> files) throws IOException {

        ObjectMapper objectMapper = new ObjectMapper();
        PostRequest request = objectMapper.readValue(requestJson, PostRequest.class);

        ApiResponse<PostResponse> response = postService.createPostWithFiles(request, files);
        return ResponseEntity.ok(response);
    }

    @GetMapping(value = "/search-posts", produces = "application/json")
    public ApiResponse<List<PostDocument>> searchPosts(
            @RequestParam(value = "searchString", required = false) String searchString,
            @RequestParam(value = "year", required = false) Integer year,
            @RequestParam(value = "month", required = false) Integer month,
            @RequestParam(value = "visibility", required = false) PostVisibility visibility) {

        return searchService.searchPosts(searchString, year, month, visibility);
    }



    @PostMapping("/{postId}/share")
    public ApiResponse<PostResponse> sharePost(
            @Parameter(description = "ID of the post to be shared", required = true)
            @PathVariable String postId,

            @Parameter(description = "Content and visibility of the shared post", required = true)
            @RequestBody SharePostRequest request) {

        ApiResponse<PostResponse> response = postService.sharePost(postId, request.getContent(), request.getVisibility());

        return ApiResponse.<PostResponse>builder()
                .code(response.getCode())
                .message(response.getMessage())
                .result(response.getResult())
                .build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePost(
            @Parameter(description = "ID of the post to be deleted", required = true)
            @PathVariable String id) {
        log.info("Delete post request: {}", id);
        ApiResponse<Void> response = postService.deletePost(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-posts")
    public ApiResponse<PageResponse<PostResponse>> getMyPosts(
            @Parameter(description = "Page number for pagination", in = ParameterIn.QUERY)
            @RequestParam(defaultValue = "1") int page,

            @Parameter(description = "Size of each page", in = ParameterIn.QUERY)
            @RequestParam(defaultValue = "10") int size,

            @Parameter(description = "Include deleted posts", in = ParameterIn.QUERY)
            @RequestParam(defaultValue = "false") boolean includeDeleted) {
        return postService.getMyPosts(page, size, includeDeleted);
    }

    @GetMapping("/history")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<PageResponse<PostResponse>> getMyPostsHistory(
            @Parameter(description = "Page number for pagination", in = ParameterIn.QUERY)
            @RequestParam(defaultValue = "1") int page,

            @Parameter(description = "Size of each page", in = ParameterIn.QUERY)
            @RequestParam(defaultValue = "10") int size) {
        return postService.getMyPostsHistory(page, size);
    }
}
