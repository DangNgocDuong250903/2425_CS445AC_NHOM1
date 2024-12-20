package com.LinkVerse.profile.dto.response;

import com.LinkVerse.profile.entity.Gender;
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
    String userId;
    String username;
    String status;
    String email;
    String firstName;
    String lastName;
    Gender gender;
    String phoneNumber;
    Date dateOfBirth;
    String city;
    boolean emailVerified;
    Set<RoleResponse> roles;
    LocalDateTime createdAt;
}
