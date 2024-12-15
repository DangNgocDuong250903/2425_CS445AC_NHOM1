package com.LinkVerse.identity.dto.request;

import com.LinkVerse.identity.entity.Gender;
import com.LinkVerse.identity.entity.UserStatus;
import com.LinkVerse.identity.validator.DobValidator.DobConstraint;
import com.LinkVerse.identity.validator.GenderValidator.GenderConstraint;
import com.LinkVerse.identity.validator.PhoneValidator.PhoneConstraint;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserCreationRequest {
    @Size(min = 4, max = 20, message = "USERNAME_INVALID")
    String username;

    @Size(min = 6, max = 50, message = "INVALID_PASSWORD")
    String password;

    String firstName;
    String lastName;

    @GenderConstraint(anyOf = {Gender.MALE, Gender.FEMALE, Gender.OTHER}, message = "INVALID_GENDER")
    Gender gender;

    @PhoneConstraint(message = "Phone number invalid format")
    String phoneNumber = "";

    @Email(message = "INVALID_EMAIL")
    @NotBlank(message = "EMAIL_IS_REQUIRED")
    String email;
    UserStatus status = UserStatus.ONLINE;

    @DobConstraint(min = 18, message = "Date of birth invalid format")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    @JsonFormat(pattern = "dd/MM/yyyy")
    Date dateOfBirth;

    String city;
}
