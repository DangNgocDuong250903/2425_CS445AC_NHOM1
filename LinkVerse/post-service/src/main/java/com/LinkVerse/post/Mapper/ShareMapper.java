package com.LinkVerse.post.Mapper;

import com.LinkVerse.post.dto.response.PostResponse;
import com.LinkVerse.post.entity.SharedPost;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;

@Mapper(componentModel = "spring", uses = PostMapper.class)
public interface ShareMapper {

    @Mapping(source = "id", target = "id")
    @Mapping(source = "content", target = "content")
    @Mapping(source = "imageUrl", target = "imageUrl")
    @Mapping(source = "visibility", target = "visibility")
    @Mapping(source = "userId", target = "userId")
    @Mapping(source = "createdDate", target = "createdDate")
    @Mapping(source = "modifiedDate", target = "modifiedDate")
    @Mapping(source = "like", target = "like")
    @Mapping(source = "unlike", target = "unlike")
    @Mapping(source = "commentCount", target = "commentCount")
    @Mapping(source = "originalPost", target = "sharedPost", qualifiedByName = "toPostResponseList")
    PostResponse toPostResponse(SharedPost sharedPost);

    @Named("toPostResponseList")
    List<PostResponse> toPostResponseList(List<SharedPost> sharedPosts);
}