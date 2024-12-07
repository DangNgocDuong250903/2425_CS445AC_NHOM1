package com.LinkVerse.post.dto.response;

import com.LinkVerse.post.entity.PostVisibility;
import lombok.*;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SharedPostResponse {
    String id;
    String userId;
    String content;
    List<String> imageUrl; // Corrected to camelCase
    PostResponse originalPost;
    PostVisibility visibility;
    Instant createdDate;
    Instant modifiedDate;
    int like;
    int unlike;
    int commentCount;
    List<String> keywords;
}
