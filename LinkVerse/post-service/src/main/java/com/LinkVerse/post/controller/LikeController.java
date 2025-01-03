package com.LinkVerse.post.controller;

import com.LinkVerse.post.dto.ApiResponse;
import com.LinkVerse.post.dto.response.CommentResponse;
import com.LinkVerse.post.dto.response.PostResponse;
import com.LinkVerse.post.service.LikeService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class LikeController {
    final LikeService likeService;

    //likepost
    @PostMapping("/{postId}/like")
    public ResponseEntity<ApiResponse<PostResponse>> likePost(
            @PathVariable String postId,
            @RequestParam String emoji) {
        ApiResponse<PostResponse> postResponse = likeService.likePost(postId, emoji);
        return ResponseEntity.ok(postResponse);
    }

    //unlikepost
    @PostMapping("/{postId}/unlikes")
    public ResponseEntity<ApiResponse<PostResponse>> unlikePost(
            @PathVariable String postId) {
        ApiResponse<PostResponse> postResponse = likeService.unlikePost(postId);
        return ResponseEntity.ok(postResponse);
    }

    //likecmt
    @PostMapping("/{postId}/comments/{commentId}/like")
    public ResponseEntity<ApiResponse<CommentResponse>> likeComment(
            @PathVariable String postId,
            @PathVariable String commentId,
            @RequestParam String emoji) {
        ApiResponse<CommentResponse> commentResponse = likeService.likeComment(postId, commentId, emoji);
        return ResponseEntity.ok(commentResponse);
    }

    //unlikecmt
    @PostMapping("/{postId}/comments/{commentId}/unlike")
    public ResponseEntity<ApiResponse<CommentResponse>> unlikeComment(
            @PathVariable String postId,
            @PathVariable String commentId) {
        ApiResponse<CommentResponse> commentResponse = likeService.unlikeComment(postId, commentId);
        return ResponseEntity.ok(commentResponse);
    }
}
