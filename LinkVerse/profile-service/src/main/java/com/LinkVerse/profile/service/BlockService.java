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
//
//import java.time.LocalDateTime;
//import java.util.Optional;
//
//@Service
//@RequiredArgsConstructor
//@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
//@Slf4j
//public class BlockService {
//    FriendshipRepository friendshipRepository;
//    UserProfileRepository userRepository;
//
//    public FriendshipResponse blockUser(String targetUserId) {
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        String currentUserId = authentication.getName();
//
//        UserProfile currentUser = userRepository.findById(currentUserId)
//                .orElseThrow(() -> new RuntimeException("Current user not found"));
//        UserProfile targetUser = userRepository.findById(targetUserId)
//                .orElseThrow(() -> new RuntimeException("Target user not found"));
//
//        if (isBlocked(targetUser.getId(), currentUser.getId())) {
//            throw new RuntimeException("Cannot block a user who has already blocked you");
//        }
//
//        Optional<Friendship> friendshipOpt = friendshipRepository.findByUser1AndUser2(currentUser, targetUser);
//        if (friendshipOpt.isPresent()) {
//            Friendship friendship = friendshipOpt.get();
//            friendship.setStatus(FriendshipStatus.BLOCKED);
//            friendshipRepository.save(friendship);
//        } else {
//            Friendship newFriendship = Friendship.builder()
//                    .user1(currentUser)
//                    .user2(targetUser)
//                    .status(FriendshipStatus.BLOCKED)
//                    .build();
//            friendshipRepository.save(newFriendship);
//        }
//
//        // Update pending requests lists
//        currentUser.getPendingRequests().removeIf(request -> request.getUser2().equals(targetUser));
//        currentUser.getBlockRequests().add(Friendship.builder()
//                .user1(currentUser)
//                .user2(targetUser)
//                .status(FriendshipStatus.BLOCKED)
//                .blockedAt(LocalDateTime.now())
//                .build());
//
//        targetUser.getPendingRequests().removeIf(request -> request.getUser1().equals(currentUser));
//        userRepository.save(currentUser);
//        userRepository.save(targetUser);
//
//        return FriendshipResponse.builder()
//                .senderUsername(currentUser.getUsername())
//                .recipientUsername(targetUser.getUsername())
//                .status(FriendshipStatus.BLOCKED)
//                .build();
//    }
//
//
//    public FriendshipResponse unblockUser(String targetUserId) {
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        String currentUserId = authentication.getName();
//
//        UserProfile useSend = userRepository.findById(currentUserId).orElseThrow(() -> new RuntimeException("Current user not found"));
//        UserProfile userReceive = userRepository.findById(targetUserId).orElseThrow(() -> new RuntimeException("Target user not found"));
//
//        Optional<Friendship> friendshipOpt = friendshipRepository.findByUser1AndUser2(useSend, userReceive);
//        if (friendshipOpt.isPresent()) {
//            Friendship friendship = friendshipOpt.get();
//            if (friendship.getStatus() == FriendshipStatus.BLOCKED) {
//                friendship.setStatus(FriendshipStatus.NONE);
//                friendship.setBlockedAt(null);
//                friendshipRepository.save(friendship);
//            } else {
//                throw new RuntimeException("No existing block to unblock");
//            }
//        } else {
//            throw new RuntimeException("No existing friendship to unblock");
//        }
//
//        return FriendshipResponse.builder()
//                .senderUsername(useSend.getUsername())
//                .recipientUsername(userReceive.getUsername())
//                .status(FriendshipStatus.NONE)
//                .build();
//    }
//
//
//    public boolean isBlocked(String userIdSend, String userIdReceive) {
//        UserProfile user1 = userRepository.findById(userIdSend).orElseThrow(() -> new RuntimeException("User not found"));
//        UserProfile user2 = userRepository.findById(userIdReceive).orElseThrow(() -> new RuntimeException("User not found"));
//        Optional<Friendship> friendship = friendshipRepository.findByUser1AndUser2(user1, user2);
//        return friendship.isPresent() && friendship.get().getStatus() == FriendshipStatus.BLOCKED;
//    }
//}