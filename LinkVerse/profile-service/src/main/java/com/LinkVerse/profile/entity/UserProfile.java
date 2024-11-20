package com.LinkVerse.profile.entity;

import java.time.LocalDate;
import java.util.List;

import com.LinkVerse.profile.enums.Gender;
import com.LinkVerse.profile.validator.GenderValidator.GenderConstraint;
import org.springframework.data.neo4j.core.schema.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import static com.LinkVerse.profile.enums.Gender.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Node("user_profile")
public class UserProfile {
    @Id
    @GeneratedValue
    String id;

    @Property("userId")
    String userId;

    String username;
    String avatarUrl;
    @Property("status")
    String status;
    String email;
    String firstName;
    String lastName;
    LocalDate dob;
    @GenderConstraint(anyOf = {MALE, FEMALE, OTHER})
    Gender gender;
    String city;


}
