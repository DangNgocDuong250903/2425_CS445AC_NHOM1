package com.LinkVerse.profile.entity;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.neo4j.core.schema.*;
import org.springframework.data.neo4j.core.support.UUIDStringGenerator;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Node("Friendship")
public class Friendship {
    @Id
    @GeneratedValue(generatorClass = UUIDStringGenerator.class)
    String id;


    @Relationship(type = "USER1")
    UserProfile user1;

    @Relationship(type = "USER2")
    UserProfile user2;

    @Property("status")
    FriendshipStatus status;

    @Property("blocked_at")
    LocalDateTime blockedAt; // thời gian block nếu status là BLOCKED

}
