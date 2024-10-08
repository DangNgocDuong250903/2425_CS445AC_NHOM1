package com.LinkVerse.post.entity;

import jakarta.persistence.PrePersist;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.time.Instant;
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
    @Getter
    String CommentID;

    int like;
    int unlike;
    int likeCount;


    public Comment() {
        this.CommentID = UUID.randomUUID().toString(); // Tạo UUID cho commentID
        this.createdDate = Instant.now(); // Gán thời gian tạo
    }

}
