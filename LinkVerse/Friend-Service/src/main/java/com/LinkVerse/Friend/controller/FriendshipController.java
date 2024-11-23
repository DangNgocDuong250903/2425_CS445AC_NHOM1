package com.LinkVerse.Friend.controller;

import com.LinkVerse.Friend.dto.FriendshipResponse;
import com.LinkVerse.Friend.entity.Friendship;
import com.LinkVerse.Friend.service.FriendshipService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/friendships")
@RequiredArgsConstructor
public class FriendshipController {
    private final FriendshipService friendshipService;

    @PostMapping("/request")
    public ResponseEntity<FriendshipResponse> sendFriendRequest(@RequestParam String recipientUserId) {
        FriendshipResponse response = friendshipService.sendFriendRequest(recipientUserId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/accept")
    public ResponseEntity<FriendshipResponse> acceptFriendRequest(@RequestParam String senderUserId) {
        FriendshipResponse response = friendshipService.acceptFriendRequest(senderUserId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/block")
    public ResponseEntity<FriendshipResponse> blockUser(@RequestParam String targetUserId) {
        FriendshipResponse response = friendshipService.blockUser(targetUserId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/accepted")
    public ResponseEntity<List<Friendship>> getAcceptedFriends() {
        List<Friendship> acceptedFriends = friendshipService.getAcceptedFriends();
        return ResponseEntity.ok(acceptedFriends);
    }
}