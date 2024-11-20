package com.LinkVerse.profile.entity;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.*;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Document(indexName = "user_profiles")
public class UserProfileDocument {

    @Id
    String id;

    String userId;
    String username;
    String avatarUrl;
    String status;
    String email;
    String firstName;
    String lastName;
    LocalDate dob;
    String gender;
    String city;

}