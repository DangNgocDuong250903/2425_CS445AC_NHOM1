package com.LinkVerse.Friend.controller;

import com.LinkVerse.Friend.dto.FriendshipResponse;
import com.LinkVerse.Friend.service.FriendService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/friends")
@RequiredArgsConstructor
public class FriendController {
    private final FriendService friendService;

    @PostMapping("/request")
    public ResponseEntity<FriendshipResponse> sendFriendRequest(@RequestParam String recipientUserId) {
        return ResponseEntity.ok(friendService.sendFriendRequest(recipientUserId));
    }

    @PostMapping("/accept")
    public ResponseEntity<FriendshipResponse> acceptFriendRequest(@RequestParam String senderUserId) {
        return ResponseEntity.ok(friendService.acceptFriendRequest(senderUserId));
    }
}