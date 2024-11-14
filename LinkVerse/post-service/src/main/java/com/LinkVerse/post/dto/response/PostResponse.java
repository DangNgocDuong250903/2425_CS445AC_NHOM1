package com.LinkVerse.post.dto.response;

import com.LinkVerse.post.entity.PostVisibility;
import jakarta.persistence.ElementCollection;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.mongodb.core.mapping.MongoId;

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
}