package com.LinkVerse.post.dto.request;

import com.LinkVerse.post.entity.PostVisibility;
import jakarta.persistence.ElementCollection;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PostRequest {
    String content;
    PostVisibility visibility;

    @ElementCollection
    List<String> fileUrls;
}