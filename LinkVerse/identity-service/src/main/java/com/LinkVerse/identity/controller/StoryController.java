package com.LinkVerse.identity.controller;

import com.LinkVerse.identity.dto.request.StoryCreationRequest;
import com.LinkVerse.identity.dto.response.StoryResponse;
import com.LinkVerse.identity.service.StoryCleanupService;
import com.LinkVerse.identity.service.StoryService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/stories")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class StoryController {
    StoryService storyService;
    StoryCleanupService storyCleanupService;

    @PostMapping
    public ResponseEntity<StoryResponse> createStory(
            @RequestBody StoryCreationRequest request,
            @RequestHeader("Authorization") String token) {
        StoryResponse response = storyService.createStory(request, token);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/active")
    public ResponseEntity<List<StoryResponse>> getActiveStories(
            @RequestHeader("Authorization") String token) {
        List<StoryResponse> stories = storyService.getActiveStories(token);
        return ResponseEntity.ok(stories);
    }

    @DeleteMapping("/{storyId}")
    public ResponseEntity<String> deleteStory(
            @PathVariable String storyId,
            @RequestHeader("Authorization") String token) {
        try {
            storyService.deleteStory(storyId, token);
            return ResponseEntity.ok("Story deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(403).body("You are not authorized to delete this story");
        }
    }

    @Scheduled(fixedRate = 3600000)
    public void scheduleStoryCleanup() {
        storyCleanupService.deleteExpiredStories();
    }


}
