package com.LinkVerse.post.Mapper;

import com.LinkVerse.post.dto.response.CommentResponse;
import com.LinkVerse.post.dto.response.PostResponse;
import com.LinkVerse.post.entity.Comment;
import com.LinkVerse.post.entity.Post;
import org.mapstruct.Mapper;

import java.util.List;
import java.util.stream.Collectors;

@Mapper
public interface PostMapper {
    PostResponse toPostResponse(Post post);

    default List<CommentResponse> toCommentResponses(List<Comment> comments) {
        return comments.stream()
            .map(comment -> CommentResponse.builder()
                    .userId(comment.getUserId())
                .content(comment.getContent())
                .createdDate(comment.getCreatedDate())
                .build())
            .collect(Collectors.toList());
    }
}
