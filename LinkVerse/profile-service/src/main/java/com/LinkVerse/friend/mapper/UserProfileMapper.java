package com.LinkVerse.profile.mapper;

import com.LinkVerse.profile.dto.request.ProfileCreationRequest;
import com.LinkVerse.profile.dto.response.UserProfileResponse;
import com.LinkVerse.profile.entity.UserProfile;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface UserProfileMapper {
        UserProfile toUserProfile(ProfileCreationRequest request);
        UserProfileResponse toUserProfileResponse(UserProfile entity);
        UserProfileMapper INSTANCE = Mappers.getMapper(UserProfileMapper.class);
}
