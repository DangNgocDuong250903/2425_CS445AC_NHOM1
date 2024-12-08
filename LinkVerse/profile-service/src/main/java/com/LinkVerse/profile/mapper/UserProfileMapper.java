package com.LinkVerse.profile.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import com.LinkVerse.profile.dto.request.ProfileCreationRequest;
import com.LinkVerse.profile.dto.response.UserProfileResponse;
import com.LinkVerse.profile.entity.UserProfile;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserProfileMapper {

      UserProfileResponse toUserProfileReponse(UserProfile entity);

      UserProfile toUserProfile(ProfileCreationRequest request);
}
