package com.LinkVerse.identity.mapper;

import com.LinkVerse.identity.dto.request.ProfileCreationRequest;
import com.LinkVerse.identity.dto.request.UserCreationRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProfileMapper {
    @Mapping(target = "dateOfBirth", source = "dateOfBirth")
    @Mapping(target = "phoneNumber", source = "phoneNumber")
    @Mapping(target = "gender", source = "gender")
    @Mapping(target = "createdAt", ignore = true)
    ProfileCreationRequest toProfileCreationRequest(UserCreationRequest request);
}