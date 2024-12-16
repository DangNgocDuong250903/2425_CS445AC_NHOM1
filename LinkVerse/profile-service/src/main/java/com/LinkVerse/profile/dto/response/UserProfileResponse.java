package com.LinkVerse.profile.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.Date;
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
    String city;
    boolean emailVerified;
    Set<RoleResponse> roles;
    LocalDateTime createdAt;
    Date dateOfBirth;
    String phoneNumber;
}