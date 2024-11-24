package com.LinkVerse.post.dto.response;

import com.LinkVerse.post.entity.PostVisibility;
import jakarta.persistence.ElementCollection;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PostResponse {
    String id;
    String content;

    @ElementCollection
    String fileUrl;
    PostVisibility visibility;
    String userId;
    Instant createdDate;
    Instant modifiedDate;
    int like;
    int unlike;
    int commentCount; // Add

    List<CommentResponse> comments; // Danh sách bình luận
    PostResponse sharedPost;
    String language;
    private String primarySentiment;
}