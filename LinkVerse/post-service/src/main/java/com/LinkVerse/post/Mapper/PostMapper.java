package com.LinkVerse.post.Mapper;

import com.LinkVerse.post.dto.response.CommentResponse;
import com.LinkVerse.post.dto.response.PostResponse;
import com.LinkVerse.post.entity.Comment;
import com.LinkVerse.post.entity.Post;
import com.LinkVerse.post.entity.PostHistory;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface PostMapper {

    @Named("toPostResponse")
    @Mapping(target = "sharedPost", source = "sharedPost", qualifiedByName = "toPostResponse")
    @Mapping(target = "keywords", source = "keywords")
    @Mapping(target = "language", source = "language")
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
                .sharedPost(post.getSharedPost() != null ? toPostResponse(post.getSharedPost()) : null)
                .keywords(post.getKeywords() != null ? post.getKeywords() : new ArrayList<>()) // Map keywords
                .primarySentiment(post.getPrimarySentiment()) // Map this field
                .language(post.getLanguage())
                .build();
    }

    PostResponse toPostResponse(PostHistory postHistory);

}