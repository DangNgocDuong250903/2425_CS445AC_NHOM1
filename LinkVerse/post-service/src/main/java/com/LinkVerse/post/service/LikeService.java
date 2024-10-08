package com.LinkVerse.post.service;

import com.LinkVerse.post.Mapper.CommentMapper;
import com.LinkVerse.post.Mapper.PostMapper;
import com.LinkVerse.post.dto.ApiResponse;
import com.LinkVerse.post.dto.response.CommentResponse;
import com.LinkVerse.post.dto.response.PostResponse;
import com.LinkVerse.post.entity.Comment;
import com.LinkVerse.post.entity.Post;
import com.LinkVerse.post.repository.CommentRespository;
import com.LinkVerse.post.repository.PostRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class LikeService {
    PostRepository postRepository;
    PostMapper postMapper;
    //like
 public ApiResponse<PostResponse> likePost(String postId, String emojiSymbol) {
    Post post = postRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("Post not found"));

    // Cập nhật số lượt thích
    post.setLike(post.getLike() + 1);

    // Thêm emoji vào danh sách
    if (post.getLikedEmojis() == null) {
        post.setLikedEmojis(new ArrayList<>());
    }
    post.getLikedEmojis().add(emojiSymbol);

    // Lưu bài viết với thông tin đã cập nhật
    post = postRepository.save(post);

    return ApiResponse.<PostResponse>builder()
            .code(HttpStatus.OK.value())
            .message("Post liked successfully and emoji")
            .result(postMapper.toPostResponse(post))
            .build();
}
    //unlike
    public ApiResponse<PostResponse> unlikePost(String postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        // Cập nhật số lượt không thích
        post.setUnlike(post.getUnlike() + 1);

        // Lưu bài viết với thông tin đã cập nhật
        post = postRepository.save(post);

        return ApiResponse.<PostResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Post unliked successfully")
                .result(postMapper.toPostResponse(post))
                .build();
    }

    CommentMapper commentMapper;
    CommentRespository commentRespository;
    public ApiResponse<CommentResponse> likeComment(String commentId) {
        Comment comment = commentRespository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        // Cập nhật số lượt thích
        comment.setLikeCount(comment.getLikeCount() + 1);
        comment = commentRespository.save(comment);

        return ApiResponse.<CommentResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Comment liked successfully")
                .result(commentMapper.toCommentResponse(comment))
                .build();
    }
     public ApiResponse<CommentResponse> unlikeComment(String commentId) {
        Comment comment = commentRespository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        // Cập nhật số lượt không thích
        comment.setUnlike(comment.getUnlike() + 1);
        comment = commentRespository.save(comment);

        return ApiResponse.<CommentResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Comment unliked successfully")
                .result(commentMapper.toCommentResponse(comment))
                .build();
    }
}
