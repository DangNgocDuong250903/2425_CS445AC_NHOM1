package com.LinkVerse.post.Mapper;

import com.LinkVerse.post.dto.response.CommentResponse;
import com.LinkVerse.post.dto.response.PostResponse;
import com.LinkVerse.post.entity.Comment;
import com.LinkVerse.post.entity.Post;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;
import java.util.stream.Collectors;
@Mapper
public interface CommentMapper {
      @Named("toPostResponse")
    CommentResponse toPostResponse(Post post);

    // Phương thức ánh xạ một comment đơn lẻ
    default CommentResponse toCommentResponse(Comment comment) {
        return CommentResponse.builder()
                .userId(comment.getUserId())
                .CommentId(comment.getCommentID())
                .content(comment.getContent())
                .createdDate(comment.getCreatedDate())
                .like(comment.getLike())
                .unlike(comment.getUnlike())
                .build();
    }

    // Phương thức ánh xạ danh sách comment
    default List<CommentResponse> toCommentResponses(List<Comment> comments) {
        return comments.stream()
            .map(this::toCommentResponse) // Sử dụng phương thức ánh xạ đơn lẻ
            .collect(Collectors.toList());
    }
}