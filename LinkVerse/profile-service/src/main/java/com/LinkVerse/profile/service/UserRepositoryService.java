package com.LinkVerse.profile.service;

import com.LinkVerse.profile.dto.request.ProfileCreationRequest;
import com.LinkVerse.profile.dto.response.UserProfileResponse;
import com.LinkVerse.profile.entity.UserProfile;
import com.LinkVerse.profile.mapper.UserProfileMapper;
import com.LinkVerse.profile.repository.UserProfileRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UserRepositoryService {
        UserProfileRepository userProfileRepository;
        UserProfileMapper userProfileMapper;

    public UserProfileResponse createProfile(ProfileCreationRequest request) {
        UserProfile userProfile = userProfileMapper.toUserProfile(request);
        userProfile = userProfileRepository.save(userProfile);

        return userProfileMapper.toUserProfileResponse(userProfile);
    }
    public UserProfileResponse getProfile(String id) {
        UserProfile userProfile =userProfileRepository.findById(id)
                .orElseThrow(()->new RuntimeException("User not found"));
        return userProfileMapper.toUserProfileResponse(userProfile);
    }
    public void deleteProfile(String id) {
        userProfileRepository.deleteById(id);
    }
}