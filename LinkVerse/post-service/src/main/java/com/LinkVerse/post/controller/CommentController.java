package com.LinkVerse.post.controller;

import com.LinkVerse.post.dto.ApiResponse;
import com.LinkVerse.post.dto.request.CommentRequest;
import com.LinkVerse.post.dto.response.PostResponse;
import com.LinkVerse.post.service.CommentService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CommentController {

    CommentService commentService;

    @PostMapping("/{postId}/comment-file")
    public ResponseEntity<ApiResponse<PostResponse>> addCommentWithImage(
            @PathVariable String postId,
            @RequestParam("request") String requestJson,
            @RequestParam("files") List<MultipartFile> files) throws IOException {

        // Convert JSON string to CommentRequest object
        ObjectMapper objectMapper = new ObjectMapper();
        CommentRequest request = objectMapper.readValue(requestJson, CommentRequest.class);

        // Invoke the service to add a comment with files
        ApiResponse<PostResponse> response = commentService.addComment(postId, request, files);

        // Return the response
        return ResponseEntity.ok(response);
    }
}