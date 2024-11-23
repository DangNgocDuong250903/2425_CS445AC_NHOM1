package com.LinkVerse.Friend.controller;

import com.LinkVerse.Friend.dto.FriendshipResponse;
import com.LinkVerse.Friend.service.BlockService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
}