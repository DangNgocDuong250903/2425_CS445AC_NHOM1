package com.LinkVerse.identity.entity;

import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(value = "post")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Post {
    String id;
    String userId;
    String content;
    Instant createdDate;
    Instant modifiedDate;
    int like;
    int unlike;
    int commentCount;
    List<Comment> comments = new ArrayList<Comment>();
    List<String> likedEmojis;
    @ManyToOne
    @JoinColumn(name = "shared_post_id")
    Post sharedPost;
     @ManyToOne
    @JoinColumn(name = "group_id")
    Group group; // Thêm tham chiếu đến Group
}
