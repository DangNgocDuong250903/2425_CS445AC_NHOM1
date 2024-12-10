package com.LinkVerse.profile.service;

import com.LinkVerse.profile.dto.response.FriendshipResponse;
import com.LinkVerse.profile.entity.Friendship;
import com.LinkVerse.profile.entity.FriendshipStatus;
import com.LinkVerse.profile.entity.UserProfile;
import com.LinkVerse.profile.exception.FriendRequestNotFoundException;
import com.LinkVerse.profile.repository.FriendshipRepository;
import com.LinkVerse.profile.repository.UserProfileRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FriendService {
    UserProfileRepository userRepository;
    FriendshipRepository friendshipRepository;
    KafkaTemplate<String, String> kafkaTemplate;

    public FriendshipResponse sendFriendRequest(String friendId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String senderUserId = authentication.getName();

        UserProfile userSend = userRepository.findByUserId(senderUserId)
                .orElseThrow(() -> new RuntimeException("Sender user not found"));
        UserProfile userReceive = userRepository.findByUserId(friendId)
                .orElseThrow(() -> new RuntimeException("Recipient user not found"));

        if (isBlocked(userSend.getId(), userReceive.getId())) {
            throw new RuntimeException("Cannot send friend request to a blocked user");
        }

        Optional<Friendship> existingFriendship = friendshipRepository.findByUser1AndUser2(userSend, userReceive);
        if (existingFriendship.isPresent()) {
            throw new RuntimeException("Friend request already exists or friendship relationship already exists.");
        }

        Friendship friendship = Friendship.builder()
                .user1(userSend)
                .user2(userReceive)
                .status(FriendshipStatus.PENDING)
                .build();
        friendshipRepository.save(friendship);

        // Add to the sending requests list of userSend
        userSend.getSendingRequests().add(friendship);
        userRepository.save(userSend);
        // Add to the pending requests list of userReceive
        userReceive.getPendingRequests().add(friendship);
        userRepository.save(userReceive);

        kafkaTemplate.send("friendship-requests", "Friend request sent from " + userSend.getUsername() + " to " + userReceive.getUsername());


        return FriendshipResponse.builder()
                .senderUsername(userSend.getUsername())
                .recipientUsername(userReceive.getUsername())
                .status(FriendshipStatus.PENDING)
                .build();
    }

    public FriendshipResponse acceptFriendRequest(String senderUserId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String recipientUserId = authentication.getName();

        UserProfile userSend = userRepository.findById(senderUserId)
                .orElseThrow(() -> new RuntimeException("Sender user with ID " + senderUserId + " not found"));
        UserProfile userReceive = userRepository.findById(recipientUserId)
                .orElseThrow(() -> new RuntimeException("Recipient user with ID " + recipientUserId + " not found"));

        Optional<Friendship> friendshipOpt = friendshipRepository.findByUser1AndUser2(userSend, userReceive);
        if (friendshipOpt.isEmpty()) {
            throw new FriendRequestNotFoundException("Friend request from " + senderUserId + " to " + recipientUserId + " not found");
        }

        Friendship friendship = friendshipOpt.get();
        friendship.setStatus(FriendshipStatus.ACCEPTED);
        friendshipRepository.save(friendship);

        userSend.getFriends().add(friendship);
        userSend.getSendingRequests().remove(friendship); // xoá khỏi sending khi đã kb
        userReceive.getFriends().add(friendship);
        userReceive.getPendingRequests().remove(friendship); // xoá khỏi pending khi đã kb


        userRepository.save(userSend);
        userRepository.save(userReceive);

        kafkaTemplate.send("friendship-requests",
                "Friend request accepted by " + userReceive.getUsername() + " from " + userSend.getUsername());

        return FriendshipResponse.builder()
                .senderUsername(userSend.getUsername())
                .recipientUsername(userReceive.getUsername())
                .status(FriendshipStatus.ACCEPTED)
                .build();
    }

    public FriendshipResponse rejectFriendRequest(String senderUserId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String recipientUserId = authentication.getName();

        UserProfile userSend = userRepository.findById(senderUserId)
                .orElseThrow(() -> new RuntimeException("Sender user with ID " + senderUserId + " not found"));
        UserProfile userReceive = userRepository.findById(recipientUserId)
                .orElseThrow(() -> new RuntimeException("Recipient user with ID " + recipientUserId + " not found"));

        Optional<Friendship> friendshipOpt = friendshipRepository.findByUser1AndUser2(userSend, userReceive);
        if (friendshipOpt.isEmpty()) {
            throw new FriendRequestNotFoundException("Friend request from " + senderUserId + " to " + recipientUserId + " not found");
        }

        Friendship friendship = friendshipOpt.get();
        friendship.setStatus(FriendshipStatus.REJECTED);
        friendshipRepository.save(friendship); // Lưu trạng thái REJECTED

        userSend.getSendingRequests().remove(friendship);
        userRepository.save(userSend);

        userReceive.getPendingRequests().remove(friendship);
        friendshipRepository.delete(friendship);

        userRepository.save(userReceive);

        kafkaTemplate.send("friendship-requests",
                "Friend request rejected by " + userReceive.getUsername() + " from " + userSend.getUsername());

        return FriendshipResponse.builder()
                .senderUsername(userSend.getUsername())
                .recipientUsername(userReceive.getUsername())
                .status(FriendshipStatus.REJECTED)
                .build();
    }


    public FriendshipResponse unfriend(String friendId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getName();

        UserProfile currentUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Current user with ID " + userId + " not found"));
        UserProfile friendUser = userRepository.findById(friendId)
                .orElseThrow(() -> new RuntimeException("Friend user with ID " + friendId + " not found"));

        Optional<Friendship> friendshipOpt = friendshipRepository.findByUser1AndUser2(currentUser, friendUser);

        if (friendshipOpt.isEmpty()) {
            throw new RuntimeException("Friendship not found between user " + userId + " and " + friendId);
        }

        Friendship friendship = friendshipOpt.get();
        friendshipRepository.delete(friendship);

        currentUser.getFriends().remove(friendship);
        friendUser.getFriends().remove(friendship);
        userRepository.save(currentUser);
        userRepository.save(friendUser);

        kafkaTemplate.send("friendship-requests",
                "User " + currentUser.getUsername() + " unfriended " + friendUser.getUsername());

        return FriendshipResponse.builder()
                .senderUsername(currentUser.getUsername())
                .recipientUsername(friendUser.getUsername())
                .status(FriendshipStatus.NONE)
                .build();
    }


    public boolean isBlocked(String userId1, String userId2) {
        UserProfile useSend = userRepository.findById(userId1).orElseThrow(() -> new RuntimeException("User not found"));
        UserProfile userReceive = userRepository.findById(userId2).orElseThrow(() -> new RuntimeException("User not found"));
        Optional<Friendship> friendship = friendshipRepository.findByUser1AndUser2(useSend, userReceive);
        return friendship.isPresent() && friendship.get().getStatus() == FriendshipStatus.BLOCKED;
    }
}
