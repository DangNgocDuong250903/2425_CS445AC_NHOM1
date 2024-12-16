package com.LinkVerse.profile.entity;

import com.LinkVerse.profile.validator.DobValidator.DobConstraint;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.PrePersist;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.neo4j.core.schema.*;
import org.springframework.data.neo4j.core.support.UUIDStringGenerator;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
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
    UserStatus status = UserStatus.ONLINE;
    String email;
    String firstName;
    String lastName;
    @Property("date_of_birth")
    @DobConstraint(min = 18, message = "Date of birth invalid format")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    @JsonFormat(pattern = "dd/MM/yyyy")
    Date dateOfBirth;
    String city;
    @Property("phone_number")
    String phoneNumber;
    @Relationship(type = "BLOCK_REQUESTS")
    List<Friendship> blockRequests = new ArrayList<>();

    @Relationship(type = "SENDING_REQUESTS")
    List<Friendship> sendingRequests = new ArrayList<>();

    @Relationship(type = "PENDING_REQUESTS")
    List<Friendship> pendingRequests = new ArrayList<>();

    @Relationship(type = "FRIENDSHIP", direction = Relationship.Direction.OUTGOING)
    List<Friendship> friends;
    Gender gender;

    @Property("created_at")
    LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}