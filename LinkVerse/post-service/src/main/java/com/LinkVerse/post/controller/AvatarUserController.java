package com.LinkVerse.post.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping
public class AvatarUserController {

    @Autowired
    private UploadAvatarUserService uploadAvatarUserService;

    @PostMapping("/{userId}/avatar")
    public ResponseEntity<String> handleAvatarUpload(@PathVariable String userId, @RequestParam("file") MultipartFile file) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String authenticatedUserId = authentication.getName();

        if (!authenticatedUserId.equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not authorized to upload an avatar for this user.");
        }

        String fileUrl = uploadAvatarUserService.uploadAvatar(file, userId);
        return ResponseEntity.status(HttpStatus.OK).body("Avatar uploaded successfully: " + fileUrl);
    }
}
