package com.LinkVerse.profile.mapper;

import com.LinkVerse.profile.dto.request.ProfileCreationRequest;
import com.LinkVerse.profile.dto.response.UserProfileResponse;
import com.LinkVerse.profile.entity.UserProfile;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserProfileMapper {
    @Mapping(source = "userId", target = "userId")
    @Mapping(source = "gender", target = "gender")
    @Mapping(source = "phoneNumber", target = "phoneNumber")
    @Mapping(source = "dateOfBirth", target = "dateOfBirth")
    UserProfileResponse toUserProfileReponse(UserProfile entity);

    @Mapping(source = "gender", target = "gender")
    @Mapping(source = "phoneNumber", target = "phoneNumber")
    @Mapping(source = "dateOfBirth", target = "dateOfBirth")
    UserProfile toUserProfile(ProfileCreationRequest request);
}
