//package com.LinkVerse.profile.service;
//
//import com.LinkVerse.profile.dto.response.FriendshipResponse;
//import com.LinkVerse.profile.entity.Friendship;
//import com.LinkVerse.profile.entity.FriendshipStatus;
//import com.LinkVerse.profile.entity.UserProfile;
//import com.LinkVerse.profile.repository.FriendshipRepository;
//import com.LinkVerse.profile.repository.UserProfileRepository;
//import lombok.AccessLevel;
//import lombok.RequiredArgsConstructor;
//import lombok.experimental.FieldDefaults;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.time.LocalDateTime;
//import java.util.Optional;
//
//@Service
//@RequiredArgsConstructor
//@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
//@Slf4j
//public class BlockService {
//
//    FriendshipRepository friendshipRepository;
//    UserProfileRepository userProfileRepository;
//
//    @Transactional
//    public FriendshipResponse blockUser(String targetUserId) {
//        String currentUserId = getAuthenticatedUserId();
//
//        UserProfile currentUser = userProfileRepository.findById(currentUserId)
//                .orElseThrow(() -> new IllegalArgumentException("Current user not found"));
//
//        UserProfile targetUser = userProfileRepository.findById(targetUserId)
//                .orElseThrow(() -> new IllegalArgumentException("Target user not found"));
//
//        if (isBlocked(targetUserId, currentUserId)) {
//            throw new IllegalStateException("Cannot block a user who has already blocked you");
//        }
//
//        // Find existing friendship or create a new one
//        Friendship friendship = friendshipRepository.findFriendshipBetween(currentUser.getUserId(), targetUser.getUserId())
//                .orElse(Friendship.builder()
//                        .user1(currentUser)
//                        .user2(targetUser)
//                        .build());
//
//        friendship.setStatus(FriendshipStatus.BLOCKED);
//        friendship.setBlockedAt(LocalDateTime.now());
//        friendshipRepository.save(friendship);
//
//
//        userProfileRepository.save(currentUser);
//        userProfileRepository.save(targetUser);
//
//        return buildFriendshipResponse(currentUser, targetUser, FriendshipStatus.BLOCKED);
//    }
//
//    @Transactional
//    public FriendshipResponse unblockUser(String targetUserId) {
//        String currentUserId = getAuthenticatedUserId();
//
//        UserProfile currentUser = userProfileRepository.findById(currentUserId)
//                .orElseThrow(() -> new IllegalArgumentException("Current user not found"));
//
//        UserProfile targetUser = userProfileRepository.findById(targetUserId)
//                .orElseThrow(() -> new IllegalArgumentException("Target user not found"));
//
//        Friendship friendship = friendshipRepository.findFriendshipBetween(currentUser.getUserId(), targetUser.getUserId())
//                .orElseThrow(() -> new IllegalStateException("No existing block relationship to unblock"));
//
//        if (friendship.getStatus() != FriendshipStatus.BLOCKED) {
//            throw new IllegalStateException("Cannot unblock a user who is not blocked");
//        }
//
//        friendship.setStatus(FriendshipStatus.NONE);
//        friendship.setBlockedAt(null);
//        friendshipRepository.save(friendship);
//
//        return buildFriendshipResponse(currentUser, targetUser, FriendshipStatus.NONE);
//    }
//
//    public boolean isBlocked(String userIdSend, String userIdReceive) {
//        UserProfile senderUser = userProfileRepository.findByUserId(userIdSend)
//                .orElseThrow(() -> new RuntimeException("Sender user not found"));
//
//        UserProfile recipientUser = userProfileRepository.findByUserId(userIdReceive)
//                .orElseThrow(() -> new RuntimeException("Recipient user not found"));
//
//        return friendshipRepository.findFriendshipBetween(senderUser.getUserId(), recipientUser.getUserId())
//                .map(friendship -> friendship.getStatus() == FriendshipStatus.BLOCKED)
//                .orElse(false);
//    }
//
//
//
//    private String getAuthenticatedUserId() {
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        return authentication.getName();
//    }
//
//    private FriendshipResponse buildFriendshipResponse(UserProfile sender, UserProfile recipient, FriendshipStatus status) {
//        return FriendshipResponse.builder()
//                .senderUsername(sender.getUsername())
//                .recipientUsername(recipient.getUsername())
//                .status(status)
//                .build();
//    }
//}
