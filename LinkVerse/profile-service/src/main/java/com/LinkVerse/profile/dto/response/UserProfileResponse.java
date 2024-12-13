package com.LinkVerse.profile.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.neo4j.core.schema.Property;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserProfileResponse {
    String id;
    String username;
    @Property("image_url")
    String imageUrl;
    String status;
    String email;
    String firstName;
    String lastName;
    LocalDate dob;
    String city;
    boolean emailVerified;
    Set<RoleResponse> roles;
    LocalDateTime createdAt;
}
