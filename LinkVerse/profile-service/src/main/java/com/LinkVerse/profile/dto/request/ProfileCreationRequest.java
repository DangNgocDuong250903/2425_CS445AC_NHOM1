package com.LinkVerse.profile.dto.request;

import com.LinkVerse.profile.entity.Gender;
import com.LinkVerse.profile.validator.DobValidator.DobConstraint;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProfileCreationRequest {
    String userId;
    String username;
    String imageUrl;
    String status;
    String email;
    String firstName;
    String lastName;
    @DobConstraint(min = 18, message = "Date of birth invalid format")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    @JsonFormat(pattern = "dd/MM/yyyy")
    Date dateOfBirth;
    String city;
    String phoneNumber;
    Gender gender;
    LocalDateTime createdAt;
}