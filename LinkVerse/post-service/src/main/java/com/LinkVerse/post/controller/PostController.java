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

import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PostController {
    PostService postService;
    @PostMapping("/create")
    ApiResponse<PostResponse> createPost(@RequestBody PostRequest request) {
        log.info("Create post request: {}", request);
        PostResponse postResponse = postService.createPost(request);
        return ApiResponse.<PostResponse>builder()
                .result(postService.createPost(request))
                .build();
    }

     @PostMapping("/{id}/like")
    public ResponseEntity<Void> likePost(@PathVariable String id) {
        log.info("Like post request: {}", id);
        postService.likePost(id);
        return ResponseEntity
                .ok()
                .build();
    }
      @PostMapping("/{id}/comments")
    public ResponseEntity<PostResponse> addComment(@PathVariable String id, @RequestBody CommentRequest commentRequest) {
        PostResponse response = postService.addComment(id, commentRequest);
        return ResponseEntity.ok(response);
    }
    @DeleteMapping("/{id}/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable String id, @PathVariable String commentId) {
        postService.deleteComment(id, commentId);
        return ResponseEntity.ok().build();
    }
    //edit comment
    @PutMapping("/{id}/comments/{commentId}")
    public ResponseEntity<PostResponse> editComment(@PathVariable String id, @PathVariable String commentId, @RequestBody CommentRequest commentRequest) {
        PostResponse response = postService.editComment(id, commentId, commentRequest);
        return ResponseEntity.ok(response);
    }

    //searchPost
    @GetMapping("/search")
    ApiResponse<PageResponse<PostResponse>> searchPost(
            @RequestParam(value = "content", required = false) String content,
            @RequestParam(value = "page", required = false, defaultValue = "1") int page,
            @RequestParam(value = "size", required = false, defaultValue = "10") int size
    ) {
        return ApiResponse.<PageResponse<PostResponse>>builder()
                .result(postService.searchPost(content, page, size))
                .build();
    }
    //DelePost
    @DeleteMapping("/{id}")
    ApiResponse<Void> deletePost(@PathVariable String id) {
        postService.deletePost(id);
        return ApiResponse.<Void>builder()
                .build();
    }
    @GetMapping("/my-posts")
    ApiResponse<PageResponse<PostResponse>> myPosts(
            @RequestParam(value = "page", required = false, defaultValue = "1") int page,
            @RequestParam(value = "size", required = false, defaultValue = "10") int size
    ) {
        return ApiResponse.<PageResponse<PostResponse>>builder()
                .result(postService.getMyPosts(page,size))
                .build();
    }


}