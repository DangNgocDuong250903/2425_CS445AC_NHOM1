package com.LinkVerse.post.Mapper;

import com.LinkVerse.post.dto.request.StoryCreationRequest;
import com.LinkVerse.post.dto.response.StoryResponse;
import com.LinkVerse.post.entity.Story;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface StoryMapper {
    Story toEntity(StoryCreationRequest request);

    StoryResponse toResponse(Story story);
}