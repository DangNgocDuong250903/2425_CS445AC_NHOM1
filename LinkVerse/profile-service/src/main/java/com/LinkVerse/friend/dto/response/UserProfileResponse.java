package com.LinkVerse.profile.dto.response;

import com.LinkVerse.profile.entity.UserProfile;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserProfileResponse {
  private String id;
    private String username;
    private String profilePicUrl;
    private String backgroundImageUrl;

    public UserProfileResponse(UserProfile userProfile) {
        this.id = userProfile.getId();
        this.username = userProfile.getUsername();
        this.profilePicUrl = userProfile.getProfilePicUrl();
        this.backgroundImageUrl = userProfile.getBackgroundImageUrl();
    }
}
