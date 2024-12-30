package com.LinkVerse.post.service;

import com.LinkVerse.event.dto.NotificationEvent;
import com.LinkVerse.post.Mapper.CommentMapper;
import com.LinkVerse.post.Mapper.PostMapper;
import com.LinkVerse.post.dto.ApiResponse;
import com.LinkVerse.post.dto.response.CommentResponse;
import com.LinkVerse.post.dto.response.PostResponse;
import com.LinkVerse.post.entity.Comment;
import com.LinkVerse.post.entity.Post;
import com.LinkVerse.post.entity.PostVisibility;
import com.LinkVerse.post.exception.CommentNotFoundException;
import com.LinkVerse.post.repository.CommentRespository;
import com.LinkVerse.post.repository.PostRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class LikeService {
    PostRepository postRepository;
    PostMapper postMapper;
    CommentMapper commentMapper;
    CommentRespository commentRespository;
    KafkaTemplate<String, Object> kafkaTemplate;

    private String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName(); // Assuming the user ID is stored in the name field
    }

    // Like a post
    public ApiResponse<PostResponse> likePost(String postId, String emojiSymbol) {
        String userId = getCurrentUserId();
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        // Check if the post is private and the user is not the owner
        if (post.getVisibility() == PostVisibility.PRIVATE && !post.getUserId().equals(userId)) {
            return ApiResponse.<PostResponse>builder()
                    .code(HttpStatus.FORBIDDEN.value())
                    .message("You are not authorized to like this post")
                    .build();
        }

        // Check if the user has already liked the post
        if (post.getLikedUserIds() != null && post.getLikedUserIds().contains(userId)) {
            return ApiResponse.<PostResponse>builder()
                    .code(HttpStatus.BAD_REQUEST.value())
                    .message("User has already liked this post")
                    .build();
        }

        // Update the like count
        post.setLike(post.getLike() + 1);

        // Add emoji to the list
        if (post.getLikedEmojis() == null) {
            post.setLikedEmojis(new ArrayList<>());
        }
        post.getLikedEmojis().add(emojiSymbol);

        // Add user ID to the list of users who liked the post
        if (post.getLikedUserIds() == null) {
            post.setLikedUserIds(new ArrayList<>());
        }
        post.getLikedUserIds().add(userId);

        // Save the updated post
        post = postRepository.save(post);
        NotificationEvent notificationEvent = NotificationEvent.builder()
                .channel("POST_LIKE")
                .recipient(post.getUserId())
                .templateCode("POST_LIKE_TEMPLATE")
                .param(Map.of("userId", userId, "postId", postId))
                .subject("Your post was liked")
                .body("Your post was liked by " + userId)
                .build();
        kafkaTemplate.send("post-like-event", notificationEvent);

        return ApiResponse.<PostResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Post liked successfully")
                .result(postMapper.toPostResponse(post))
                .build();
    }

    // Unlike a post
    public ApiResponse<PostResponse> unlikePost(String postId) {
        String userId = getCurrentUserId();
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        // Check if the post is private and the user is not the owner
        if (post.getVisibility() == PostVisibility.PRIVATE && !post.getUserId().equals(userId)) {
            return ApiResponse.<PostResponse>builder()
                    .code(HttpStatus.FORBIDDEN.value())
                    .message("You are not authorized to unlike this post")
                    .build();
        }

        // Check if the user has liked the post
        if (post.getLikedUserIds() == null || !post.getLikedUserIds().contains(userId)) {
            return ApiResponse.<PostResponse>builder()
                    .code(HttpStatus.BAD_REQUEST.value())
                    .message("User has not liked this post")
                    .build();
        }

        // Update the unlike count
        post.setUnlike(post.getUnlike() + 1);

        // Remove user ID from the list of users who liked the post
        post.getLikedUserIds().remove(userId);

        // Save the updated post
        post = postRepository.save(post);
        NotificationEvent notificationEvent = NotificationEvent.builder()
                .channel("POST_UNLIKE")
                .recipient(post.getUserId())
                .templateCode("POST_UNLIKE_TEMPLATE")
                .param(Map.of("userId", userId, "postId", postId))
                .subject("Your post was unliked")
                .body("Your post was unliked by " + userId)
                .build();
        kafkaTemplate.send("post-unlike-event", notificationEvent);

        return ApiResponse.<PostResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Post unliked successfully")
                .result(postMapper.toPostResponse(post))
                .build();
    }

    // Like a comment
    public ApiResponse<CommentResponse> likeComment(String postId, String commentId, String emojiSymbol) {
        String userId = getCurrentUserId();
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        // Check if the post is private and the user is not the owner
        if (post.getVisibility() == PostVisibility.PRIVATE && !post.getUserId().equals(userId)) {
            return ApiResponse.<CommentResponse>builder()
                    .code(HttpStatus.FORBIDDEN.value())
                    .message("You are not authorized to like this comment")
                    .build();
        }

        Optional<Comment> commentOptional = post.getComments().stream()
                .filter(comment -> comment.getCommentId().equals(commentId))
                .findFirst();

        if (!commentOptional.isPresent()) {
            throw new CommentNotFoundException("Comment not found");
        }
        Comment comment = commentOptional.get();

        // Check if the user has already liked the comment
        if (comment.getLikedUserIds() != null && comment.getLikedUserIds().contains(userId)) {
            return ApiResponse.<CommentResponse>builder()
                    .code(HttpStatus.BAD_REQUEST.value())
                    .message("User has already liked this comment")
                    .build();
        }

        // Update the like count
        comment.setLike(comment.getLike() + 1);

        // Add emoji to the list
        if (comment.getLikedEmojis() == null) {
            comment.setLikedEmojis(new ArrayList<>());
        }
        comment.getLikedEmojis().add(emojiSymbol);

        // Add user ID to the list of users who liked the comment
        if (comment.getLikedUserIds() == null) {
            comment.setLikedUserIds(new ArrayList<>());
        }
        comment.getLikedUserIds().add(userId);

        // Save the updated comment
        comment = commentRespository.save(comment);

        return ApiResponse.<CommentResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Comment liked successfully")
                .result(commentMapper.toCommentResponse(comment))
                .build();
    }

    // Unlike a comment
    public ApiResponse<CommentResponse> unlikeComment(String postId, String commentId) {
        String userId = getCurrentUserId();
        Comment comment = commentRespository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        // Check if the post is private and the user is not the owner
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        if (post.getVisibility() == PostVisibility.PRIVATE && !post.getUserId().equals(userId)) {
            return ApiResponse.<CommentResponse>builder()
                    .code(HttpStatus.FORBIDDEN.value())
                    .message("You are not authorized to unlike this comment")
                    .build();
        }

        // Check if the user has liked the comment
        if (comment.getLikedUserIds() == null || !comment.getLikedUserIds().contains(userId)) {
            return ApiResponse.<CommentResponse>builder()
                    .code(HttpStatus.BAD_REQUEST.value())
                    .message("User has not liked this comment")
                    .build();
        }

        // Update the unlike count
        comment.setUnlike(comment.getUnlike() + 1);

        // Remove user ID from the list of users who liked the comment
        comment.getLikedUserIds().remove(userId);

        // Save the updated comment
        comment = commentRespository.save(comment);

        return ApiResponse.<CommentResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Comment unliked successfully")
                .result(commentMapper.toCommentResponse(comment))
                .build();
    }
}