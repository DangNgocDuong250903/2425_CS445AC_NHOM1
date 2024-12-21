package com.LinkVerse.Friend.service;

import com.LinkVerse.Friend.dto.FriendshipResponse;
import com.LinkVerse.Friend.entity.Friendship;
import com.LinkVerse.Friend.entity.FriendshipStatus;
import com.LinkVerse.Friend.entity.User;
import com.LinkVerse.Friend.exception.FriendRequestNotFoundException;
import com.LinkVerse.Friend.repository.FriendshipRepository;
import com.LinkVerse.Friend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FriendService {
    private final FriendshipRepository friendshipRepository;
    private final UserRepository userRepository;
    private final KafkaTemplate<String, String> kafkaTemplate;

    public FriendshipResponse sendFriendRequest(String recipientUserId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String senderUserId = (String) authentication.getPrincipal(); // Assuming userId is stored in principal

        User user1 =
                userRepository.findById(senderUserId).orElseThrow(() -> new RuntimeException("Sender user not found"));
        User user2 = userRepository
                .findById(recipientUserId)
                .orElseThrow(() -> new RuntimeException("Recipient user not found"));

        if (isBlocked(user1.getId(), user2.getId())) {
            throw new RuntimeException("Cannot send friend request to a blocked user");
        }

        Optional<Friendship> existingFriendship = friendshipRepository.findByUser1AndUser2(user1, user2);
        if (existingFriendship.isEmpty()) {
            Friendship friendship = Friendship.builder()
                    .user1(user1)
                    .user2(user2)
                    .status(FriendshipStatus.PENDING)
                    .build();
            friendshipRepository.save(friendship);
            kafkaTemplate.send(
                    "friendship-requests",
                    "Friend request sent from " + user1.getUsername() + " to " + user2.getUsername());
        }

        return FriendshipResponse.builder()
                .senderUsername(user1.getUsername())
                .recipientUsername(user2.getUsername())
                .status(FriendshipStatus.PENDING)
                .build();
    }

    public FriendshipResponse acceptFriendRequest(String senderUserId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String recipientUserId = authentication.getName();

        User user1 =
                userRepository.findById(senderUserId).orElseThrow(() -> new RuntimeException("Sender user not found"));
        User user2 = userRepository
                .findById(recipientUserId)
                .orElseThrow(() -> new RuntimeException("Recipient user not found"));

        Optional<Friendship> friendship = friendshipRepository.findByUser1AndUser2(user1, user2);
        if (friendship.isEmpty()) {
            throw new FriendRequestNotFoundException("Friend request not found");
        }

        friendship.ifPresent(f -> {
            f.setStatus(FriendshipStatus.ACCEPTED);
            friendshipRepository.save(f);
            kafkaTemplate.send(
                    "friendship-requests",
                    "Friend request accepted by " + user2.getUsername() + " from " + user1.getUsername());
        });

        return FriendshipResponse.builder()
                .senderUsername(user1.getUsername())
                .recipientUsername(user2.getUsername())
                .status(FriendshipStatus.ACCEPTED)
                .build();
    }

    public boolean isBlocked(String userId1, String userId2) {
        User user1 = userRepository.findById(userId1).orElseThrow(() -> new RuntimeException("User not found"));
        User user2 = userRepository.findById(userId2).orElseThrow(() -> new RuntimeException("User not found"));
        Optional<Friendship> friendship = friendshipRepository.findByUser1AndUser2(user1, user2);
        return friendship.isPresent() && friendship.get().getStatus() == FriendshipStatus.BLOCKED;
    }
}
