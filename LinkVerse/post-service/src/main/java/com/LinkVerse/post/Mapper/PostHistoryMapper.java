package com.LinkVerse.post.Mapper;

import com.LinkVerse.post.dto.response.PostResponse;
import com.LinkVerse.post.entity.PostHistory;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PostHistoryMapper {

    PostResponse toPostResponse(PostHistory postHistory);
}