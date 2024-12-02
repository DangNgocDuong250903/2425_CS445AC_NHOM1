package com.LinkVerse.post.Mapper;

import com.LinkVerse.post.dto.response.PostResponse;
import com.LinkVerse.post.entity.SharedPost;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ShareMapper {

    // Map from SharedPost to PostResponse
    @Mapping(source = "originalPost.id", target = "sharedPost.id")
    @Mapping(source = "originalPost.content", target = "sharedPost.content")
    @Mapping(source = "originalPost.imageUrl", target = "sharedPost.imageUrl")
    @Mapping(source = "originalPost.visibility", target = "sharedPost.visibility")
    @Mapping(source = "originalPost.userId", target = "sharedPost.userId")
    @Mapping(source = "originalPost.createdDate", target = "sharedPost.createdDate")
    @Mapping(source = "originalPost.modifiedDate", target = "sharedPost.modifiedDate")
    @Mapping(source = "originalPost.like", target = "sharedPost.like")
    @Mapping(source = "originalPost.unlike", target = "sharedPost.unlike")
    @Mapping(source = "originalPost.commentCount", target = "sharedPost.commentCount")
    @Mapping(source = "imageUrl", target = "imageUrl")
    PostResponse toPostResponse(SharedPost sharedPost);

    default String mapImageUrl(List<String> imageUrl) {
        return imageUrl != null ? String.join(",", imageUrl) : "";
    }
}