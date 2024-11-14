package com.LinkVerse.identity.dto.response;

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
    String userId;
    Instant createdDate;
    Instant modifiedDate;
    int like;
    int unlike;
    int commentCount; // Add

    List<CommentResponse> comments; // Danh sách bình luận
    PostResponse sharedPost;
}
