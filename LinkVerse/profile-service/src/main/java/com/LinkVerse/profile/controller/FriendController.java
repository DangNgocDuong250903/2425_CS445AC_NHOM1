package com.LinkVerse.profile.controller;

import com.LinkVerse.profile.dto.response.FriendshipResponse;
import com.LinkVerse.profile.dto.response.UserProfileResponse;
import com.LinkVerse.profile.entity.UserProfile;
import com.LinkVerse.profile.service.FriendService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

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

    @PostMapping("/reject")
    public ResponseEntity<FriendshipResponse> rejectFriendRequest(@RequestParam String senderUserId) {
        return ResponseEntity.ok(friendService.rejectFriendRequest(senderUserId));
    }

    @PostMapping("/unfriend")
    public ResponseEntity<FriendshipResponse> unFriendRequest(@RequestParam String recipientUserId) {
        return ResponseEntity.ok(friendService.unfriend(recipientUserId));
    }

    @GetMapping("/friend")
    public ResponseEntity<Set<UserProfileResponse>> getFriendOfUser(@RequestParam String userId) {
        return ResponseEntity.ok(friendService.getAllFriends(userId));
    }

    @GetMapping("/my-friend-request")
    public ResponseEntity<Set<UserProfileResponse>> getFriendRequest() {
        return ResponseEntity.ok(friendService.getAllFriendsRequest());
    }

    @GetMapping("/request-sent")
    public ResponseEntity<Set<UserProfileResponse>> getRequestFriend() {
        return ResponseEntity.ok(friendService.getSentFriendRequests());
    }

    @GetMapping("/my-friends")
    public ResponseEntity<Set<UserProfileResponse>> getMyFriend() {
        return ResponseEntity.ok(friendService.getAllFriendsOfCurrentUser());
    }

}