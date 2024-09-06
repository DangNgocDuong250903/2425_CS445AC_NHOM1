package com.LinkVerse.profile.controller;

import com.LinkVerse.profile.dto.response.UserProfileResponse;
import com.LinkVerse.profile.service.UserProfileService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UserProfileController {
    UserProfileService userProfileService;

    @GetMapping("/users/{profileId}")
    UserProfileResponse getProfile(@PathVariable String profileId) {
        return userProfileService.getProfile(profileId);
    }

    @GetMapping("/users/getAll")
    List<UserProfileResponse> getAllProfiles(){
        return userProfileService.getAllProfiles();
    }

    @DeleteMapping("/users/{profileId}")
    void deleteUser(@PathVariable String profileId) {
        log.info("User with ID {} has been deleted", profileId);
        userProfileService.deleteUser(profileId);
    }
}
