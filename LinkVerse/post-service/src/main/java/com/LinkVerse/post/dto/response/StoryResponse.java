package com.LinkVerse.post.dto.response;

import com.LinkVerse.post.entity.StoryVisibility;
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
