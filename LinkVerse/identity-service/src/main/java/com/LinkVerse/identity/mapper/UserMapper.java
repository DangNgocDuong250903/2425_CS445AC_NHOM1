package com.LinkVerse.identity.mapper;

import com.LinkVerse.identity.dto.request.UserCreationRequest;
import com.LinkVerse.identity.dto.request.UserUpdateRequest;
import com.LinkVerse.identity.dto.request.UserUpdateRequestAdmin;
import com.LinkVerse.identity.dto.response.UserResponse;
import com.LinkVerse.identity.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(target = "firstName", source = "firstName") // Add this mapping
    @Mapping(target = "lastName", source = "lastName")
    @Mapping(target = "gender", source = "gender")
    User toUser(UserCreationRequest request);

    @Mapping(source = "createdAt", target = "createdAt")
    @Mapping(source = "gender", target = "gender")
    @Mapping(source = "phoneNumber", target = "phoneNumber")
    @Mapping(source = "dateOfBirth", target = "dateOfBirth")
    UserResponse toUserResponse(User user);

    @Mapping(target = "roles", ignore = true)
    void updateUser(@MappingTarget User user, UserUpdateRequestAdmin request);

    void updateUserbyUsers(@MappingTarget User user, UserUpdateRequest request); // Add this method

}