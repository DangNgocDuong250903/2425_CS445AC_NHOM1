package com.LinkVerse.post.entity;


import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Set;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Document(collection = "groups")
public class Group {

    @Id
    String id;

    String name;

    String description;

    // Owner of the group, references the User entity
    @DBRef
    User owner;

    // Users in the group with a specific role
    @DBRef
    Set<GroupMember> members;

    GroupVisibility visibility;

    int memberCount;
}
