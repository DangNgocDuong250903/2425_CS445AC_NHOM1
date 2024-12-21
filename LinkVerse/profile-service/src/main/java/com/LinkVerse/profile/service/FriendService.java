package com.LinkVerse.profile.service;

import com.LinkVerse.profile.dto.response.FriendshipResponse;
import com.LinkVerse.profile.dto.response.UserProfileResponse;
import com.LinkVerse.profile.entity.Friendship;
import com.LinkVerse.profile.entity.FriendshipStatus;
import com.LinkVerse.profile.entity.UserProfile;
import com.LinkVerse.profile.exception.FriendRequestNotFoundException;
import com.LinkVerse.profile.mapper.UserProfileMapper;
import com.LinkVerse.profile.repository.FriendshipRepository;
import com.LinkVerse.profile.repository.UserProfileRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class FriendService {
    FriendshipRepository friendshipRepository;
    UserProfileRepository userRepository;
    KafkaTemplate<String, String> kafkaTemplate;
    UserProfileMapper userProfileMapper;

    public FriendshipResponse sendFriendRequest(String recipientUserId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String senderUserId = authentication.getName();
        log.info("Sending friend request from " + senderUserId + " to " + recipientUserId);

        UserProfile userProfile1 = userRepository.findByUserId(senderUserId)
                .orElseThrow(() -> new RuntimeException("Sender user not found"));
        UserProfile userProfile2 = userRepository.findByUserId(recipientUserId)
                .orElseThrow(() -> new RuntimeException("Recipient user not found" + recipientUserId));

        if (isBlocked(userProfile1.getUserId(), userProfile2.getUserId())) {
            throw new RuntimeException("Cannot send friend request to a blocked user");
        }

        Optional<Friendship> existingFriendship = friendshipRepository.findByUserProfile1AndUserProfile2(userProfile1, userProfile2);
        if (existingFriendship.isPresent()) {
            throw new RuntimeException("Friend request already exists or friendship relationship already exists.");
        }

        Friendship friendship = Friendship.builder()
                .userProfile1(userProfile1)
                .userProfile2(userProfile2)
                .status(FriendshipStatus.PENDING)
                .build();
        friendshipRepository.save(friendship);
        kafkaTemplate.send("friendship-requests", "Friend request sent from " + userProfile1.getUsername() + " to " + userProfile2.getUsername());

        return FriendshipResponse.builder()
                .senderUsername(userProfile1.getUsername())
                .recipientUsername(userProfile2.getUsername())
                .status(FriendshipStatus.PENDING)
                .build();
    }

    public FriendshipResponse acceptFriendRequest(String senderUserId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String recipientUserId = authentication.getName();
        log.info("Accepting friend request from " + senderUserId + " to " + recipientUserId);

        UserProfile user1 = userRepository.findByUserId(senderUserId)
                .orElseThrow(() -> new RuntimeException("Sender user not found" + senderUserId));
        UserProfile user2 = userRepository.findByUserId(recipientUserId)
                .orElseThrow(() -> new RuntimeException("Recipient user not found" + recipientUserId));

        Optional<Friendship> friendship = friendshipRepository.findByUserProfile1AndUserProfile2(user1, user2);
        if (friendship.isEmpty()) {
            throw new FriendRequestNotFoundException("Friend request not found");
        }

        Friendship existingFriendship = friendship.get();
        existingFriendship.setStatus(FriendshipStatus.ACCEPTED);
        friendshipRepository.save(existingFriendship);
        kafkaTemplate.send("friendship-requests", "Friend request accepted by " + user2.getUsername() + " from " + user1.getUsername());

        return FriendshipResponse.builder()
                .senderUsername(user1.getUsername())
                .recipientUsername(user2.getUsername())
                .status(FriendshipStatus.ACCEPTED)
                .build();
    }


    public FriendshipResponse rejectFriendRequest(String senderUserId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String recipientUserId = authentication.getName();

        UserProfile userSend = userRepository.findByUserId(senderUserId)
                .orElseThrow(() -> new RuntimeException("Sender user with ID " + senderUserId + " not found"));
        UserProfile userReceive = userRepository.findByUserId(recipientUserId)
                .orElseThrow(() -> new RuntimeException("Recipient user with ID " + recipientUserId + " not found"));

        Optional<Friendship> friendshipOpt = friendshipRepository.findByUserProfile1AndUserProfile2(userSend, userReceive);
        if (friendshipOpt.isEmpty() || friendshipOpt.get().getStatus() != FriendshipStatus.PENDING) {
            throw new FriendRequestNotFoundException("Pending friend request from " + senderUserId + " to " + recipientUserId + " not found");
        }

        friendshipRepository.delete(friendshipOpt.get());

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

        UserProfile currentUser = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Current user with ID " + userId + " not found"));
        UserProfile friendUser = userRepository.findByUserId(friendId)
                .orElseThrow(() -> new RuntimeException("Friend user with ID " + friendId + " not found"));

        Optional<Friendship> friendshipOpt = friendshipRepository.findByUserProfile1AndUserProfile2(currentUser, friendUser);

        if (friendshipOpt.isEmpty()) {
            throw new RuntimeException("Friendship not found between user " + userId + " and " + friendId);
        }

        Friendship friendship = friendshipOpt.get();
        friendshipRepository.delete(friendship);

        kafkaTemplate.send("friendship-requests",
                "User " + currentUser.getUsername() + " unfriended " + friendUser.getUsername());

        return FriendshipResponse.builder()
                .senderUsername(currentUser.getUsername())
                .recipientUsername(friendUser.getUsername())
                .status(FriendshipStatus.NONE)
                .build();
    }

    public Set<UserProfileResponse> getAllFriends(String userId) {
        UserProfile user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Friendship> friendships = friendshipRepository.findByUserProfile1OrUserProfile2AndStatus(user, user, FriendshipStatus.ACCEPTED);
        return friendships.stream()
                .map(friendship -> friendship.getUserProfile1().equals(user) ? friendship.getUserProfile2() : friendship.getUserProfile1())
                .map(userProfileMapper::toUserProfileReponse)
                .collect(Collectors.toSet());
    }

    public Set<UserProfileResponse> getAllFriendsOfCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserId = authentication.getName();

        UserProfile user = userRepository.findByUserId(currentUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Friendship> friendships = friendshipRepository.findByUserProfile1OrUserProfile2AndStatus(user, user, FriendshipStatus.ACCEPTED);
        return friendships.stream()
                .map(friendship -> friendship.getUserProfile1().equals(user) ? friendship.getUserProfile2() : friendship.getUserProfile1())
                .map(userProfileMapper::toUserProfileReponse)
                .collect(Collectors.toSet());
    }

    public Set<UserProfileResponse> getAllFriendsRequest() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserId = authentication.getName();

        UserProfile currentUser = userRepository.findByUserId(currentUserId)
                .orElseThrow(() -> new RuntimeException("Current user not found"));

        List<Friendship> pendingFriendships = friendshipRepository.findByUserProfile2AndStatus(currentUser, FriendshipStatus.PENDING);
        return pendingFriendships.stream()
                .map(Friendship::getUserProfile1)
                .map(userProfileMapper::toUserProfileReponse)
                .collect(Collectors.toSet());
    }

    public boolean areFriends(String userId1, String userId2) {
        UserProfile user1 = userRepository.findByUserId(userId1).orElseThrow(() -> new RuntimeException("User not found"));
        UserProfile user2 = userRepository.findByUserId(userId2).orElseThrow(() -> new RuntimeException("User not found"));
        Optional<Friendship> friendship = friendshipRepository.findByUserProfile1AndUserProfile2AndStatus(user1, user2, FriendshipStatus.ACCEPTED);
        return friendship.isPresent();
    }

    public boolean isBlocked(String userId1, String userId2) {
        UserProfile user1 = userRepository.findByUserId(userId1).orElseThrow(() -> new RuntimeException("User not found"));
        UserProfile user2 = userRepository.findByUserId(userId2).orElseThrow(() -> new RuntimeException("User not found"));
        Optional<Friendship> friendship = friendshipRepository.findByUserProfile1AndUserProfile2(user1, user2);
        return friendship.isPresent() && friendship.get().getStatus() == FriendshipStatus.BLOCKED;
    }
}
