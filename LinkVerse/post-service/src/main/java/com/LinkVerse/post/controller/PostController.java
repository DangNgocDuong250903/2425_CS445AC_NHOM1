package com.LinkVerse.post.controller;

import com.LinkVerse.post.dto.ApiResponse;
import com.LinkVerse.post.dto.PageResponse;
import com.LinkVerse.post.dto.request.CommentRequest;
import com.LinkVerse.post.dto.request.PostRequest;
import com.LinkVerse.post.dto.response.PostResponse;
import com.LinkVerse.post.service.PostService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PostController {

    final PostService postService;

    // Create a new post
    @PostMapping("/create")
    public ResponseEntity<ApiResponse<PostResponse>> createPost(@RequestBody PostRequest request) {
        log.info("Create post request: {}", request);
        ApiResponse<PostResponse> response = postService.createPost(request);
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