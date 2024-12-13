package com.LinkVerse.profile.entity;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.neo4j.core.schema.*;
import org.springframework.data.neo4j.core.support.UUIDStringGenerator;

import java.time.LocalDate;
import java.util.Set;

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
    LocalDate dob;
    String city;

    @Relationship(type = "HAS_ROLE", direction = Relationship.Direction.OUTGOING)
    Set<Role> roles;

    @Property("email_verified")
    boolean emailVerified;
}