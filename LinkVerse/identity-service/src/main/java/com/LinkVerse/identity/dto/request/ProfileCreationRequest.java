package com.LinkVerse.identity.dto.request;

import java.time.LocalDate;

import com.LinkVerse.identity.entity.UserStatus;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProfileCreationRequest {

    String userId;
    String username;
    String email;
    UserStatus status = UserStatus.ONLINE;
    String firstName;
    String lastName;
    LocalDate dob;
    String city;
}
