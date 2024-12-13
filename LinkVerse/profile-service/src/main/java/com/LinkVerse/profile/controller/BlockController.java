package com.LinkVerse.profile.controller;

import com.LinkVerse.profile.dto.response.FriendshipResponse;
import com.LinkVerse.profile.dto.response.UserProfileResponse;
import com.LinkVerse.profile.service.BlockService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Set;

@RestController
@RequiredArgsConstructor
public class BlockController {
    private final BlockService blockService;

    @PostMapping("/block")
    public ResponseEntity<FriendshipResponse> blockUser(@RequestParam String targetUserId) {
        return ResponseEntity.ok(blockService.blockUser(targetUserId));
    }

    @PostMapping("/unblock")
    public ResponseEntity<FriendshipResponse> unblockUser(@RequestParam String targetUserId) {
        return ResponseEntity.ok(blockService.unblockUser(targetUserId));
    }

    @PostMapping("/block-list")
    public ResponseEntity<Set<UserProfileResponse>> blockList() {
        return ResponseEntity.ok(blockService.getBlockedUsers());
    }
}