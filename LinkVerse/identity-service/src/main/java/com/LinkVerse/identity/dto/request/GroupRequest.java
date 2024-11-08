package com.LinkVerse.identity.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class GroupRequest {

    String name; // The name of the group
    String description; // A brief description of the group
    String visibility; // Visibility level of the group (e.g., PUBLIC, PRIVATE)
}
