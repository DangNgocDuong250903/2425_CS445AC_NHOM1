package com.LinkVerse.friend.mapper;

import com.LinkVerse.friend.dto.request.ProfileCreationRequest;
import com.LinkVerse.friend.dto.response.UserProfileResponse;
import com.LinkVerse.friend.entity.UserProfile;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface UserProfileMapper {
        UserProfile toUserProfile(ProfileCreationRequest request);
        UserProfileResponse toUserProfileResponse(UserProfile entity);
}
