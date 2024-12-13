package com.LinkVerse.profile.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserProfileResponse {
    String id;
    String username;
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
