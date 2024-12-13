package com.LinkVerse.profile.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.List;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProfileCreationRequest {
    String userId;
    String username;
    String imageUrl;
    String email;
    String firstName;
    String lastName;
    LocalDate dob;
    String city;
}
