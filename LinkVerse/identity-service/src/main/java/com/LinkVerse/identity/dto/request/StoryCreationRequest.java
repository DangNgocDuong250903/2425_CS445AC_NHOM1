package com.LinkVerse.identity.dto.request;

import com.LinkVerse.identity.entity.StoryVisibility;
import lombok.Data;

@Data
public class StoryCreationRequest {
    String content;
    StoryVisibility visibility;
}