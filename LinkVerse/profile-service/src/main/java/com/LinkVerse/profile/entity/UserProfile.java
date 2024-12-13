package com.LinkVerse.profile.entity;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.neo4j.core.schema.*;
import org.springframework.data.neo4j.core.support.UUIDStringGenerator;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Node("user_profile")
public class UserProfile {
    @Id
    @GeneratedValue(generatorClass = UUIDStringGenerator.class)
    String id;

    @Property("userId")
    String userId;
    @Property("image_url")
    String imageUrl;
    String username;
    @Property("status")
    String status;
    String email;
    String firstName;
    String lastName;
    LocalDate dob;
    String city;

    @Relationship(type = "BLOCK_REQUESTS")
    List<Friendship> blockRequests = new ArrayList<>(); // ds user bị block

    @Relationship(type = "SENDING_REQUESTS")
    List<Friendship> sendingRequests = new ArrayList<>(); // ds user gửi kb = follow

    @Relationship(type = "PENDING_REQUESTS")
    List<Friendship> pendingRequests = new ArrayList<>(); // ds lời mời kết bạn

    @Relationship(type = "FRIENDSHIP", direction = Relationship.Direction.OUTGOING)
    List<Friendship> friends; // ds bạn bè
}