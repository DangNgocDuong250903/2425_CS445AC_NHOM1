package com.LinkVerse.profile.controller;


import com.LinkVerse.profile.dto.response.UserProfileResponse;
import com.LinkVerse.profile.service.UserProfileService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;


import org.springframework.web.bind.annotation.*;
import com.LinkVerse.profile.service.impl.UploadImageFileImpl;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@RequestMapping("/profile/users")
public class UploadImageController {

    final UserProfileService userProfileService;
    final UploadImageFileImpl uploadImageFile;

    @PostMapping("/{id}/uploadProfilePic")
    public UserProfileResponse uploadProfilePic(@PathVariable String id, @RequestParam("file") MultipartFile file) throws IOException {
        log.info("Uploading profile picture for user: {}", id);
        String profilePicUrl = uploadImageFile.uploadImage(file);
        return userProfileService.updateBackgroundImageUrlById(id, profilePicUrl);
    }

    @PostMapping("/{id}/uploadBackgroundImage")
    public UserProfileResponse uploadBackgroundImage(@PathVariable String id, @RequestParam("file") MultipartFile file) throws IOException {
        log.info("Uploading background image for user: {}", id);
        String backgroundImageUrl = uploadImageFile.uploadImage(file);
        return userProfileService.updateBackgroundImageUrlById(id, backgroundImageUrl);
    }
}