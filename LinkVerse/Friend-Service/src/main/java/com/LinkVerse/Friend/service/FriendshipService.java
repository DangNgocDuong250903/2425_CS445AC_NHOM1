package com.LinkVerse.Friend.service;

import com.LinkVerse.Friend.dto.FriendshipResponse;
import com.LinkVerse.Friend.entity.Friendship;
import com.LinkVerse.Friend.entity.FriendshipStatus;
import com.LinkVerse.Friend.entity.User;
import com.LinkVerse.Friend.repository.FriendshipRepository;
import com.LinkVerse.Friend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FriendshipService {
    private final FriendshipRepository friendshipRepository;
    private final UserRepository userRepository;
    private final KafkaTemplate<String, String> kafkaTemplate;

    public FriendshipResponse sendFriendRequest(String recipientUserId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String senderUserId = authentication.getName();

        User user1 = userRepository.findById(senderUserId).orElseThrow(() -> new RuntimeException("Sender user not found"));
        User user2 = userRepository.findById(recipientUserId).orElseThrow(() -> new RuntimeException("Recipient user not found"));

        Optional<Friendship> existingFriendship = friendshipRepository.findByUser1AndUser2(user1, user2);
        if (existingFriendship.isEmpty()) {
            Friendship friendship = Friendship.builder()
                    .user1(user1)
                    .user2(user2)
                    .status(FriendshipStatus.PENDING)
                    .build();
            friendshipRepository.save(friendship);
            kafkaTemplate.send("friendship-requests", "Friend request sent from " + user1.getUsername() + " to " + user2.getUsername());
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

        User user1 = userRepository.findById(senderUserId).orElseThrow(() -> new RuntimeException("Sender user not found"));
        User user2 = userRepository.findById(recipientUserId).orElseThrow(() -> new RuntimeException("Recipient user not found"));

        Optional<Friendship> friendship = friendshipRepository.findByUser1AndUser2(user1, user2);
        friendship.ifPresent(f -> {
            f.setStatus(FriendshipStatus.ACCEPTED);
            friendshipRepository.save(f);
        });

        return FriendshipResponse.builder()
                .senderUsername(user1.getUsername())
                .recipientUsername(user2.getUsername())
                .status(FriendshipStatus.ACCEPTED)
                .build();
    }

    public FriendshipResponse blockUser(String targetUserId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserId = authentication.getName();

        User user1 = userRepository.findById(currentUserId).orElseThrow(() -> new RuntimeException("Current user not found"));
        User user2 = userRepository.findById(targetUserId).orElseThrow(() -> new RuntimeException("Target user not found"));

        Optional<Friendship> friendship = friendshipRepository.findByUser1AndUser2(user1, user2);
        if (friendship.isPresent()) {
            Friendship existingFriendship = friendship.get();
            existingFriendship.setStatus(FriendshipStatus.BLOCKED);
            friendshipRepository.save(existingFriendship);
        } else {
            Friendship newFriendship = Friendship.builder()
                    .user1(user1)
                    .user2(user2)
                    .status(FriendshipStatus.BLOCKED)
                    .build();
            friendshipRepository.save(newFriendship);
        }

        return FriendshipResponse.builder()
                .senderUsername(user1.getUsername())
                .recipientUsername(user2.getUsername())
                .status(FriendshipStatus.BLOCKED)
                .build();
    }

    public List<Friendship> getAcceptedFriends() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getName();

        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return friendshipRepository.findByUser1AndStatus(user, FriendshipStatus.ACCEPTED);
    }
}