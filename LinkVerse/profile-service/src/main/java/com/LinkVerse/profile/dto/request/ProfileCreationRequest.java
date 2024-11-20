package com.LinkVerse.profile.dto.request;

import java.time.LocalDate;

import com.LinkVerse.profile.enums.Gender;
import com.LinkVerse.profile.validator.DobValidator.DobConstraint;
import com.LinkVerse.profile.validator.GenderValidator.GenderConstraint;
import com.LinkVerse.profile.validator.PhoneValidator.PhoneConstraint;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.format.annotation.DateTimeFormat;

import static com.LinkVerse.profile.enums.Gender.*;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProfileCreationRequest {
    String userId;
    String username;
    String email;
    String firstName;
    String lastName;

    @PhoneConstraint(message = "Phone number invalid format")
    String phoneNumber = "";

    @DobConstraint(min = 18,message = "Date of birth invalid format")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    @JsonFormat(pattern = "dd/MM/yyyy")
    LocalDate dob;

    String city;
    @GenderConstraint(anyOf = {MALE, FEMALE, OTHER})
    Gender gender;

}
