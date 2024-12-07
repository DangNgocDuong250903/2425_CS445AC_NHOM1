package com.LinkVerse.post.entity;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Document(collection = "stories")
public class Story {
    @Id
    String id;
    String userId;

    String content;

    LocalDateTime postedAt;

    // Thời gian hết hạn (24 giờ sau khi đăng)
    LocalDateTime expiryTime;

    StoryVisibility visibility = StoryVisibility.PUBLIC;

    List<String> imageUrl;
}