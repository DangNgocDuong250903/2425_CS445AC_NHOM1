package com.LinkVerse.identity.mapper;

import com.LinkVerse.identity.dto.request.ProfileCreationRequest;
import com.LinkVerse.identity.dto.request.UserCreationRequest;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProfileMapper {
    ProfileCreationRequest toProfileCreationRequest(UserCreationRequest request);
}
