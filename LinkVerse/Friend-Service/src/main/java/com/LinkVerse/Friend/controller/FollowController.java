package com.LinkVerse.Friend.controller;

import com.LinkVerse.Friend.service.FollowService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class FollowController {
    private final FollowService followService;

    @PostMapping("/follow")
    public ResponseEntity<Void> followUser(@RequestParam String targetUserId) {
        followService.followUser(targetUserId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/unfollow")
    public ResponseEntity<Void> unfollowUser(@RequestParam String targetUserId) {
        followService.unfollowUser(targetUserId);
        return ResponseEntity.ok().build();
    }
}