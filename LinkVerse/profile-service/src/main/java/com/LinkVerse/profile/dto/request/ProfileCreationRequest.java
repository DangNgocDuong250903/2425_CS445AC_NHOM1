package com.LinkVerse.friend.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.neo4j.core.schema.Id;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProfileCreationRequest {
   String userId;
    String firstName;
    String lastName;
    LocalDate dob;
    String city;
         String username;
//     String profilePicUrl;
//     String backgroundImageUrl;
}
