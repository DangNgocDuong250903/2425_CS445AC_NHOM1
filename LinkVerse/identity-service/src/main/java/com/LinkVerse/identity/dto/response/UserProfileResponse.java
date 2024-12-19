package com.LinkVerse.identity.dto.response;

import com.LinkVerse.identity.entity.Gender;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserProfileResponse {
    String id;
    String userId;
    String username;
    String email;
    String firstName;
    String lastName;
    String phoneNumber;
    Date dateOfBirth;
    String city;
    Gender gender;
}
