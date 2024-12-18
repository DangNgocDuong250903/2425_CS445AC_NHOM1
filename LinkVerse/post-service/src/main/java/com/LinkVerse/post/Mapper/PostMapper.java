package com.LinkVerse.post.Mapper;

import com.LinkVerse.post.dto.response.CommentResponse;
import com.LinkVerse.post.dto.response.PostResponse;
import com.LinkVerse.post.entity.Comment;
import com.LinkVerse.post.entity.Post;
import com.LinkVerse.post.entity.PostHistory;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", uses = {CommentMapper.class, PostHistoryMapper.class})
public interface PostMapper {

    @Named("toPostResponse")
    @Mapping(target = "sharedPost", source = "sharedPost", qualifiedByName = "toPostResponse")
    @Mapping(target = "language", source = "language")
    @Mapping(target = "imageUrl", source = "imageUrl")
    @Mapping(target = "imgAvatarUrl", source = "imgAvatarUrl")
    PostResponse toPostResponse(Post post);

    default List<CommentResponse> toCommentResponses(List<Comment> comments) {
        return comments.stream()
                .map(comment -> Mappers.getMapper(CommentMapper.class).toCommentResponse(comment))
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
                .imageUrl(post.getImageUrl())
                .imgAvatarUrl(post.getImgAvatarUrl())
                .like(post.getLike())
                .unlike(post.getUnlike())
                .comments(toCommentResponses(post.getComments()))
                .sharedPost(post.getSharedPost() != null ? toPostResponse(post.getSharedPost()) : null)
                .primarySentiment(post.getPrimarySentiment())
                .language(post.getLanguage())
                .build();
    }

    PostResponse toPostResponse(PostHistory postHistory);
}