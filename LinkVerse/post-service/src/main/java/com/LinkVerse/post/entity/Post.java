
package com.LinkVerse.post.entity;

import jakarta.persistence.*;
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
@FieldDefaults(level = AccessLevel.PUBLIC)
public class Post {
    @MongoId
    String id;
    String userId;
    String content;

    @ElementCollection
    List<String> fileUrls;
    String fileUrl;

    @Enumerated(EnumType.STRING)
    PostVisibility visibility;

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
    boolean deleted = false;
}
