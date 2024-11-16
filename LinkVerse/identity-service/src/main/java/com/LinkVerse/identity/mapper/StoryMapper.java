package com.LinkVerse.identity.mapper;


import com.LinkVerse.identity.dto.request.StoryCreationRequest;
import com.LinkVerse.identity.dto.response.StoryResponse;
import com.LinkVerse.identity.entity.Story;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface StoryMapper {
    Story toStory(StoryCreationRequest request);

    StoryResponse toStoryResponse(Story story);
}