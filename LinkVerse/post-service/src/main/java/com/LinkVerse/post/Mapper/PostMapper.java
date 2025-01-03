package com.LinkVerse.post.Mapper;

import com.LinkVerse.post.dto.response.PostGroupResponse;
import com.LinkVerse.post.dto.response.PostPendingResponse;
import com.LinkVerse.post.dto.response.PostResponse;
import com.LinkVerse.post.entity.Post;
import com.LinkVerse.post.entity.PostGroup;
import com.LinkVerse.post.entity.PostPending;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.ArrayList;
import java.util.List;

@Mapper(componentModel = "spring")
public interface PostMapper {

    @Named("toPostResponse")
    @Mapping(target = "sharedPost", ignore = true)
        // Adjust based on your exact needs
    PostResponse toPostResponse(Post post);

    @Mapping(target = "groupId", ignore = false)
    PostGroupResponse toPostGroupResponse(PostGroup post);

    @Named("toPostResponseList")
    default List<PostResponse> toPostResponseList(Post post) {
        if (post == null) {
            return new ArrayList<>();
        }
        List<PostResponse> responseList = new ArrayList<>();
        responseList.add(toPostResponse(post));
        return responseList; // Wrap single PostResponse in a List
    }

    @Mapping(target = "groupId", ignore = false)
    PostPendingResponse toPostPendingResponse(PostPending post);
}