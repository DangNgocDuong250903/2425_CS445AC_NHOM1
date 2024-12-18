package com.LinkVerse.post.entity;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@Builder
@Document(value = "comment")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Comment {
    String id;
    String userId;
    String content;
    Instant createdDate;
    int like;
    int unlike;
    int likeCount;
    List<String> likedEmojis;
    List<String> imageUrl;
    boolean deleted = false;
    @Getter
    String commentId;

    public Comment() {
        this.commentId = UUID.randomUUID().toString(); // Generate UUID for commentId
        this.createdDate = Instant.now(); // Set creation time
    }

}