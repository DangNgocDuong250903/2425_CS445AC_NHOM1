package com.LinkVerse.identity.dto.response;

import com.LinkVerse.identity.entity.GroupStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class GroupResponse {
    String id;
    String name;
    String description;
    GroupStatus status;
    int memberCount;
}