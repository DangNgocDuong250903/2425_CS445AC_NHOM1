package com.LinkVerse.post.entity;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Document(collection = "group_members")
public class GroupMember {

    @Id
    String id;

    @DBRef
    Group group;

    @DBRef
    User user;

    MemberRole role;

    public enum MemberRole {
        LEADER,
        MEMBER,
        OWNER
    }
}