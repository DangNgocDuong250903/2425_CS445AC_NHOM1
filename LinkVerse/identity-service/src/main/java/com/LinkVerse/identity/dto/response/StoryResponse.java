package com.LinkVerse.identity.dto.response;

import com.LinkVerse.identity.entity.StoryVisibility;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class StoryResponse {
    String id;
    String content;
    LocalDateTime postedAt;
    LocalDateTime expiryTime;
    StoryVisibility visibility;
}
