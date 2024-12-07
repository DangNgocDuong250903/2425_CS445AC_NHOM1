package com.LinkVerse.post.dto.request;

import com.LinkVerse.post.entity.StoryVisibility;
import lombok.Data;

@Data
public class StoryCreationRequest {
    StoryVisibility visibility;
}