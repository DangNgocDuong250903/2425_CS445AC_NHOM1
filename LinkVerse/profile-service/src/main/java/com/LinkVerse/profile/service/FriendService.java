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

import java.util.HashSet;
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

        UserProfile senderProfile = userRepository.findByUserId(senderUserId)
                .orElseThrow(() -> new RuntimeException("Sender user not found"));
        UserProfile recipientProfile = userRepository.findByUserId(recipientUserId)
                .orElseThrow(() -> new RuntimeException("Recipient user not found"));

        if (isBlocked(senderProfile.getUserId(), recipientProfile.getUserId())) {
            throw new RuntimeException("Cannot send a friend request to a blocked user");
        }

        Optional<Friendship> existingFriendship = friendshipRepository.findByUserProfiles(senderProfile, recipientProfile);
        if (existingFriendship.isPresent()) {
            throw new RuntimeException("Friend request already exists or friendship relationship already exists.");
        }

        Friendship friendship = Friendship.builder()
                .sender(senderProfile)
                .recipient(recipientProfile)
                .status(FriendshipStatus.PENDING)
                .build();

        friendshipRepository.save(friendship);

        kafkaTemplate.send("friendship-requests",
                "Friend request sent from " + senderProfile.getUsername() + " to " + recipientProfile.getUsername());

        return FriendshipResponse.builder()
                .senderUsername(senderProfile.getUsername())
                .recipientUsername(recipientProfile.getUsername())
                .status(FriendshipStatus.PENDING)
                .build();
    }

    public FriendshipResponse acceptFriendRequest(String senderUserId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String recipientUserId = authentication.getName();

        UserProfile senderProfile = userRepository.findByUserId(senderUserId)
                .orElseThrow(() -> new RuntimeException("Sender user not found: " + senderUserId));
        UserProfile recipientProfile = userRepository.findByUserId(recipientUserId)
                .orElseThrow(() -> new RuntimeException("Recipient user not found: " + recipientUserId));

        Optional<Friendship> friendshipOptional = friendshipRepository.findByUserProfiles(senderProfile, recipientProfile);
        if (friendshipOptional.isEmpty()) {
            throw new FriendRequestNotFoundException("Friend request not found between " + senderUserId + " and " + recipientUserId);
        }
        Friendship friendship = friendshipOptional.get();

        if (friendship.getStatus() != FriendshipStatus.PENDING) {
            throw new RuntimeException("Friend request is not in a pending state.");
        }

        friendship.setStatus(FriendshipStatus.ACCEPTED);
        friendshipRepository.save(friendship);

        kafkaTemplate.send("friendship-requests", "Friend request accepted by " + recipientProfile.getUsername() + " from " + senderProfile.getUsername());

        return FriendshipResponse.builder()
                .senderUsername(senderProfile.getUsername())
                .recipientUsername(recipientProfile.getUsername())
                .status(FriendshipStatus.ACCEPTED)
                .build();
    }

    public FriendshipResponse rejectFriendRequest(String senderUserId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String recipientUserId = authentication.getName();

        UserProfile senderProfile = userRepository.findByUserId(senderUserId)
                .orElseThrow(() -> new RuntimeException("Sender user with ID " + senderUserId + " not found"));
        UserProfile recipientProfile = userRepository.findByUserId(recipientUserId)
                .orElseThrow(() -> new RuntimeException("Recipient user with ID " + recipientUserId + " not found"));

        Optional<Friendship> friendshipOptional = friendshipRepository.findByUserProfiles(senderProfile, recipientProfile);
        if (friendshipOptional.isEmpty() || friendshipOptional.get().getStatus() != FriendshipStatus.PENDING) {
            throw new FriendRequestNotFoundException(
                    "Pending friend request from " + senderUserId + " to " + recipientUserId + " not found");
        }

        friendshipRepository.delete(friendshipOptional.get());

        kafkaTemplate.send("friendship-requests",
                "Friend request rejected by " + recipientProfile.getUsername() + " from " + senderProfile.getUsername());

        return FriendshipResponse.builder()
                .senderUsername(senderProfile.getUsername())
                .recipientUsername(recipientProfile.getUsername())
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

        Optional<Friendship> friendshipOpt = friendshipRepository.findByUserProfiles(currentUser, friendUser);

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

        Set<UserProfile> friendsAsSender = friendshipRepository.findFriendsByUserAndStatusAccepted(user);
        Set<UserProfile> friendsAsRecipient = friendshipRepository.findFriendsByUserAndStatusAccepted(user);
        Set<UserProfile> allFriends = new HashSet<>(friendsAsSender);
        allFriends.addAll(friendsAsRecipient);

        return allFriends.stream()
                .filter(friend -> !friend.getId().equals(user.getId())) // lọc user hiện tại ra
                .map(userProfileMapper::toUserProfileReponse)
                .collect(Collectors.toSet());
    }

    public Set<UserProfileResponse> getAllFriendsOfCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserId = authentication.getName();

        UserProfile user = userRepository.findByUserId(currentUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Set<UserProfile> friendsAsSender = friendshipRepository.findFriendsByUserAndStatusAccepted(user);
        Set<UserProfile> friendsAsRecipient = friendshipRepository.findFriendsByUserAndStatusAccepted(user);
        Set<UserProfile> allFriends = new HashSet<>(friendsAsSender);
        allFriends.addAll(friendsAsRecipient);

        return allFriends.stream()
                .filter(friend -> !friend.getId().equals(user.getId()))
                .map(userProfileMapper::toUserProfileReponse)
                .collect(Collectors.toSet());
    }

    public Set<UserProfileResponse> getAllFriendsRequest() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserId = authentication.getName();

        UserProfile currentUser = userRepository.findByUserId(currentUserId)
                .orElseThrow(() -> new RuntimeException("Current user not found"));

        Set<UserProfile> friendRequests = friendshipRepository.findFriendRequestsByUserAndStatusPending(currentUser);

        return friendRequests.stream()
                .filter(friend -> !friend.getId().equals(currentUser.getId()))
                .map(userProfileMapper::toUserProfileReponse)
                .collect(Collectors.toSet());
    }

    public Set<UserProfileResponse> getSentFriendRequests() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserId = authentication.getName();

        UserProfile currentUser = userRepository.findByUserId(currentUserId)
                .orElseThrow(() -> new RuntimeException("Current user not found"));

        Set<UserProfile> sentRequests = friendshipRepository.findSentFriendRequestsByUser(currentUser);

        return sentRequests.stream()
                .filter(friend -> !friend.getId().equals(currentUser.getId()))
                .map(userProfileMapper::toUserProfileReponse)
                .collect(Collectors.toSet());
    }

    public boolean isBlocked(String userId1, String userId2) {
        UserProfile user1 = userRepository.findByUserId(userId1).orElseThrow(() -> new RuntimeException("User not found"));
        UserProfile user2 = userRepository.findByUserId(userId2).orElseThrow(() -> new RuntimeException("User not found"));
        Optional<Friendship> friendship = friendshipRepository.findByUserProfiles(user1, user2);
        return friendship.isPresent() && friendship.get().getStatus() == FriendshipStatus.BLOCKED;
    }
}