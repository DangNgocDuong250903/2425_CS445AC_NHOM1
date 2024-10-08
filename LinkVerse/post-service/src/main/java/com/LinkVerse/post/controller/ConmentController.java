package com.LinkVerse.post.controller;

import com.LinkVerse.post.dto.ApiResponse;
import com.LinkVerse.post.dto.request.CommentRequest;
import com.LinkVerse.post.dto.response.PostResponse;
import com.LinkVerse.post.service.CommentService;
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
public class ConmentController {
     final CommentService commentService;
    // Add a comment to a post
    @PostMapping("/{id}/comments")
    public ResponseEntity<ApiResponse<PostResponse>> addComment(@PathVariable String id, @RequestBody CommentRequest commentRequest) {
        log.info("Add comment to post: {}", id);
        ApiResponse<PostResponse> response = commentService.addComment(id, commentRequest);
        return ResponseEntity.ok(response);
    }
        // Edit a comment on a post
    @PutMapping("/{id}/comments/{commentId}")
    public ResponseEntity<ApiResponse<PostResponse>> editComment(@PathVariable String id, @PathVariable String commentId, @RequestBody CommentRequest commentRequest) {
        log.info("Edit comment on post: {}, commentId: {}", id, commentId);
        ApiResponse<PostResponse> response = commentService.editComment(id, commentId, commentRequest);
        return ResponseEntity.ok(response);
    }

    // Delete a comment from a post
    @DeleteMapping("/{id}/comments/{commentId}")
    public ResponseEntity<ApiResponse<Void>> deleteComment(@PathVariable String id, @PathVariable String commentId) {
        log.info("Delete comment from post: {}, commentId: {}", id, commentId);
        ApiResponse<Void> response = commentService.deleteComment(id, commentId);
        return ResponseEntity.ok(response);
    }
}
