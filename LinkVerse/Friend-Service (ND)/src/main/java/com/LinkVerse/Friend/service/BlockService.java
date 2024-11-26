package com.LinkVerse.Friend.service;

import com.LinkVerse.Friend.dto.FriendshipResponse;
import com.LinkVerse.Friend.entity.Friendship;
import com.LinkVerse.Friend.entity.FriendshipStatus;
import com.LinkVerse.Friend.repository.FriendshipRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BlockService {
    private final FriendshipRepository friendshipRepository;
    private final UserRepository userRepository;

    public FriendshipResponse blockUser(String targetUserId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserId = authentication.getName();

        User user1 = userRepository.findById(currentUserId).orElseThrow(() -> new RuntimeException("Current user not found"));
        User user2 = userRepository.findById(targetUserId).orElseThrow(() -> new RuntimeException("Target user not found"));

        if (isBlocked(user2.getId(), user1.getId())) {
            throw new RuntimeException("Cannot block a user who has already blocked you");
        }

        Optional<Friendship> friendship = friendshipRepository.findByUser1AndUser2(user1, user2);
        if (friendship.isPresent()) {
            Friendship existingFriendship = friendship.get();
            existingFriendship.setStatus(FriendshipStatus.BLOCKED);
            existingFriendship.setBlockedAt(LocalDateTime.now());
            friendshipRepository.save(existingFriendship);
        } else {
            Friendship newFriendship = Friendship.builder()
                    .user1(user1)
                    .user2(user2)
                    .status(FriendshipStatus.BLOCKED)
                    .blockedAt(LocalDateTime.now())
                    .build();
            friendshipRepository.save(newFriendship);
        }

        // Update follow lists
        user1.getFollowings().remove(targetUserId);
        user2.getFollowers().remove(currentUserId);
        userRepository.save(user1);
        userRepository.save(user2);

        return FriendshipResponse.builder()
                .senderUsername(user1.getUsername())
                .recipientUsername(user2.getUsername())
                .status(FriendshipStatus.BLOCKED)
                .build();
    }

    public FriendshipResponse unblockUser(String targetUserId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserId = authentication.getName();

        User user1 = userRepository.findById(currentUserId).orElseThrow(() -> new RuntimeException("Current user not found"));
        User user2 = userRepository.findById(targetUserId).orElseThrow(() -> new RuntimeException("Target user not found"));

        Optional<Friendship> friendship = friendshipRepository.findByUser1AndUser2(user1, user2);
        if (friendship.isPresent()) {
            Friendship existingFriendship = friendship.get();
            if (existingFriendship.getStatus() == FriendshipStatus.BLOCKED) {
                existingFriendship.setStatus(FriendshipStatus.NONE);
                existingFriendship.setBlockedAt(null);
                friendshipRepository.save(existingFriendship);
            } else {
                throw new RuntimeException("No existing block to unblock");
            }
        } else {
            throw new RuntimeException("No existing friendship to unblock");
        }

        return FriendshipResponse.builder()
                .senderUsername(user1.getUsername())
                .recipientUsername(user2.getUsername())
                .status(FriendshipStatus.NONE)
                .build();
    }

    public boolean isBlocked(String userId1, String userId2) {
        User user1 = userRepository.findById(userId1).orElseThrow(() -> new RuntimeException("User not found"));
        User user2 = userRepository.findById(userId2).orElseThrow(() -> new RuntimeException("User not found"));
        Optional<Friendship> friendship = friendshipRepository.findByUser1AndUser2(user1, user2);
        return friendship.isPresent() && friendship.get().getStatus() == FriendshipStatus.BLOCKED;
    }
}