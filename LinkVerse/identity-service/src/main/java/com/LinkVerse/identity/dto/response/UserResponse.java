package com.LinkVerse.identity.dto.response;

import com.LinkVerse.identity.entity.Gender;
import com.LinkVerse.identity.entity.UserStatus;
import com.LinkVerse.identity.validator.DobValidator.DobConstraint;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {
    String id; //users id
    String username;
    UserStatus status = UserStatus.ONLINE;
    String phoneNumber;
    String email;
    Date dateOfBirth;
    String profileId;
    boolean emailVerified;
    Set<RoleResponse> roles;
    LocalDateTime createdAt;
    Gender gender;
}