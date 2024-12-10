package com.LinkVerse.profile.dto.response;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserProfileResponse {
    @Id
    String id;
    String userId;
    String username;
    String imageUrl;
    String status;
    String email;
    String firstName;
    String lastName;
    LocalDate dob;
    String city;
}
