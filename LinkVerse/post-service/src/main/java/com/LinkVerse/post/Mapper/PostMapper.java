package com.LinkVerse.post.Mapper;

import com.LinkVerse.post.dto.response.CommentResponse;
import com.LinkVerse.post.dto.response.PostResponse;
import com.LinkVerse.post.entity.Comment;
import com.LinkVerse.post.entity.Post;
import com.LinkVerse.post.entity.PostDocument;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;
import java.util.stream.Collectors;

@Mapper
public interface PostMapper {
    @Named("toPostResponse")
    PostResponse toPostResponse(Post post);

    default List<CommentResponse> toCommentResponses(List<Comment> comments) {
        return comments.stream()
            .map(comment -> CommentResponse.builder()
                    .userId(comment.getUserId())
                    .CommentId(comment.getCommentID())
                .content(comment.getContent())
                .createdDate(comment.getCreatedDate())
                .build())
            .collect(Collectors.toList());
    }

    @Named("toPostResponseWithShared")
    @Mapping(source = "sharedPost", target = "sharedPost", qualifiedByName = "toPostResponse")
      // Ánh xạ Post có sharedPost
    default PostResponse toPostResponseWithShared(Post post) {
        return PostResponse.builder()
            .id(post.getId())
            .userId(post.getUserId())
            .content(post.getContent())
            .createdDate(post.getCreatedDate())
            .modifiedDate(post.getModifiedDate())
            .like(post.getLike())
            .unlike(post.getUnlike())
            .comments(toCommentResponses(post.getComments()))
            // Kiểm tra nếu có sharedPost thì gọi đệ quy để ánh xạ
            .sharedPost(post.getSharedPost() != null ? toPostResponse(post.getSharedPost()) : null)
            .build();
    }

}
