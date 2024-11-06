package com.LinkVerse.profile.mapper;

import org.mapstruct.Mapper;

import com.LinkVerse.profile.dto.request.ProfileCreationRequest;
import com.LinkVerse.profile.dto.response.UserProfileResponse;
import com.LinkVerse.profile.entity.UserProfile;

@Mapper(componentModel = "spring")
public interface UserProfileMapper {
      UserProfile toUserProfile(ProfileCreationRequest request);

        UserProfileResponse toUserProfileReponse(UserProfile entity);
}
