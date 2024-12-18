package com.LinkVerse.post.dto.request;

import com.LinkVerse.post.entity.StoryVisibility;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StoryCreationRequest {
    StoryVisibility visibility;
}