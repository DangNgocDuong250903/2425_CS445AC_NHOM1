package com.LinkVerse.profile.controller;

import com.LinkVerse.profile.dto.request.ProfileCreationRequest;
import com.LinkVerse.profile.dto.response.UserProfileResponse;
import com.LinkVerse.profile.service.UserRepositoryService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserProfileController {
    UserRepositoryService userRepositoryService;

    @PostMapping("/profile")
    UserProfileResponse createProfile(@RequestBody ProfileCreationRequest request) {
        return userRepositoryService.createProfile(request);
    }

    @GetMapping("/${protifileId}")
    UserProfileResponse getProfile(@PathVariable String protifileId) {
        return userRepositoryService.getProfile(protifileId);
    }

    @DeleteMapping("/${protifileId}")
    void deleteProfile(@PathVariable String protifileId) {
        userRepositoryService.deleteProfile(protifileId);
    }
}
