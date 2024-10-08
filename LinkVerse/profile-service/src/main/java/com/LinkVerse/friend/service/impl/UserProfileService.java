package com.LinkVerse.profile.service.impl;

import com.LinkVerse.profile.dto.request.ProfileCreationRequest;
import com.LinkVerse.profile.dto.response.UserProfileResponse;

public interface UserProfileService {
  UserProfileResponse updateProfilePicUrlById(String id, String profilePicUrl);
    UserProfileResponse updateBackgroundImageUrlById(String id, String backgroundImageUrl);
    UserProfileResponse createProfile(ProfileCreationRequest request);
}
