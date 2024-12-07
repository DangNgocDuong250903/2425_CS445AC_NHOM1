package com.LinkVerse.post.controller;

import com.LinkVerse.post.FileUtil;
import com.LinkVerse.post.dto.ApiResponse;
import com.LinkVerse.post.dto.request.PostRequest;
import com.LinkVerse.post.dto.response.PostResponse;
import com.LinkVerse.post.service.PostService;
import com.LinkVerse.post.service.TranslationService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)

public class avatarController {
    final PostService postService;
    TranslationService translationService;

    @PostMapping("/set-avatar")
    public ResponseEntity<String> updateImage(
            @RequestParam("userId") String userId,

            @RequestParam("request") String requestJson,

            @RequestParam("avatar") MultipartFile avatar) throws JsonProcessingException {

        ObjectMapper objectMapper = new ObjectMapper();
        PostRequest request = objectMapper.readValue(requestJson, PostRequest.class);

        if (!FileUtil.isImageFile(avatar)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Only image files are allowed.");
        }

        ApiResponse<PostResponse> response = postService.postImageAvatar(request, avatar);
        if (response.getCode() == HttpStatus.OK.value()) {
            return ResponseEntity.ok("Avatar updated successfully.");
        } else {
            return ResponseEntity.status(response.getCode()).body(response.getMessage());
        }
    }
}
