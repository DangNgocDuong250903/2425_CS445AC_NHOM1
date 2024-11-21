package com.LinkVerse.post.service;

import com.LinkVerse.post.Mapper.CommentMapper;
import com.LinkVerse.post.Mapper.PostMapper;
import com.LinkVerse.post.dto.ApiResponse;
import com.LinkVerse.post.dto.request.CommentRequest;
import com.LinkVerse.post.dto.response.PostResponse;
import com.LinkVerse.post.entity.Comment;
import com.LinkVerse.post.entity.Post;
import com.LinkVerse.post.repository.PostRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CommentService {
    PostRepository postRepository;
    PostMapper postMapper;
    CommentMapper commentMapper;

    public ApiResponse<PostResponse> addComment(String postId, CommentRequest commentRequest) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Comment newComment = Comment.builder()
                .content(commentRequest.getContent())
                .userId(SecurityContextHolder.getContext().getAuthentication().getName())
                .CommentID(UUID.randomUUID().toString())
                .createdDate(Instant.now())
                .build();

        post.getComments().add(newComment);
        post.setCommentCount(post.getComments().size());
        postRepository.save(post);

        return ApiResponse.<PostResponse>builder()
                .code(200)
                .message("Comment added successfully")
                .result(postMapper.toPostResponse(post))
                .build();
    }

    public ApiResponse<Void> deleteComment(String id, String commentID) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        boolean removed = post.getComments().removeIf(comment -> comment.getCommentID().equals(commentID));

        if (!removed) {
            return ApiResponse.<Void>builder()
                    .code(404)
                    .message("Comment not found or already deleted")
                    .build();
        }

        postRepository.save(post);

        return ApiResponse.<Void>builder()
                .code(200)
                .message("Comment deleted successfully")
                .build();
    }

    public ApiResponse<PostResponse> editComment(String postId, String commentId, CommentRequest commentRequest) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        post.getComments().stream()
                .filter(comment -> comment.getCommentID().equals(commentId))
                .findFirst()
                .ifPresent(comment -> {
                    comment.setContent(commentRequest.getContent());
                    comment.setCreatedDate(Instant.now());
                });

        post = postRepository.save(post);
        return ApiResponse.<PostResponse>builder()
                .code(200)
                .message("Comment edited successfully")
                .result(postMapper.toPostResponse(post))
                .build();
    }
}