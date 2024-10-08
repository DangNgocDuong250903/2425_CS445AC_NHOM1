package com.LinkVerse.friend.dto.response;

import com.LinkVerse.friend.entity.UserProfile;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserProfileResponse {
 String id;
    String firstName;
    String lastName;
    LocalDate dob;
    String city;
//     String profilePicUrl;
//     String backgroundImageUrl;


}
