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
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class FriendService {
    UserProfileRepository userProfileRepository;
    FriendshipRepository friendshipRepository;
    KafkaTemplate<String, String> kafkaTemplate;

    public FriendshipResponse sendFriendRequest(String friendId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String senderUserId = authentication.getName();
        log.info("Sender user ID: " + senderUserId);

        UserProfile userSend = userProfileRepository.findByUserId(senderUserId)
                .orElseThrow(() -> new RuntimeException("Sender user not found" + senderUserId));
        log.info("Sender user: " + userSend.getUserId());
        UserProfile userReceive = userProfileRepository.findByUserId(friendId)
                .orElseThrow(() -> new RuntimeException("Recipient user not found"+ friendId));
        log.info("Recipient user: " + userReceive.getUserId());

        if (isBlocked(userSend.getId(), userReceive.getId())) {
            throw new RuntimeException("Cannot send friend request to a blocked user");
        }

        Optional<Friendship> existingFriendship = friendshipRepository.findByUserProfile1AndUserProfile2(userSend, userReceive);
        if (existingFriendship.isEmpty()) {
            // Tạo mối quan hệ mới
            Friendship friendship = Friendship.builder()
                    .userProfile1(userSend)
                    .userProfile2(userReceive)
                    .status(FriendshipStatus.PENDING)
                    .build();
            friendshipRepository.save(friendship);

            kafkaTemplate.send("friendship-requests",
                    "Friend request sent from " + userSend.getUsername() + " to " + userReceive.getUsername());
        }

        return FriendshipResponse.builder()
                .senderUsername(userSend.getUsername())
                .recipientUsername(userReceive.getUsername())
                .status(FriendshipStatus.PENDING)
                .build();
    }

    public FriendshipResponse acceptFriendRequest(String senderUserId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String recipientUserId = authentication.getName();

        UserProfile userSend = userProfileRepository.findByUserId(senderUserId)
                .orElseThrow(() -> new RuntimeException("Sender user with ID " + senderUserId + " not found"));
        UserProfile userReceive = userProfileRepository.findByUserId(recipientUserId)
                .orElseThrow(() -> new RuntimeException("Recipient user with ID " + recipientUserId + " not found"));


        Optional<Friendship> friendship = friendshipRepository.findByUserProfile1AndUserProfile2(userSend, userReceive)
                .or(() -> friendshipRepository.findByUserProfile1AndUserProfile2(userReceive, userSend));
        if (friendship.isEmpty()) {
            throw new FriendRequestNotFoundException("Friend request from " + senderUserId + " to " + recipientUserId + " not found");
        }

        friendship.ifPresent(f -> {
            f.setStatus(FriendshipStatus.ACCEPTED);
            friendshipRepository.save(f);
            kafkaTemplate.send("friendship-requests", "Friend request accepted by " + userReceive.getUsername() + " from " + userSend.getUsername());
        });

        return FriendshipResponse.builder()
                .senderUsername(userSend.getUsername())
                .recipientUsername(userReceive.getUsername())
                .status(FriendshipStatus.ACCEPTED)
                .build();
    }



//    public FriendshipResponse rejectFriendRequest(String senderUserId) {
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        String recipientUserId = authentication.getName();
//
//        UserProfile userSend = userRepository.findById(senderUserId)
//                .orElseThrow(() -> new RuntimeException("Sender user with ID " + senderUserId + " not found"));
//        UserProfile userReceive = userRepository.findById(recipientUserId)
//                .orElseThrow(() -> new RuntimeException("Recipient user with ID " + recipientUserId + " not found"));
//
//        Optional<Friendship> friendshipOpt = friendshipRepository.findByUser1AndUser2(userSend.getId(), userReceive.getId());
//        if (friendshipOpt.isEmpty()) {
//            throw new FriendRequestNotFoundException("Friend request from " + senderUserId + " to " + recipientUserId + " not found");
//        }
//
//        Friendship friendship = friendshipOpt.get();
//        friendship.setStatus(FriendshipStatus.REJECTED);
//        friendshipRepository.save(friendship);
//
//        userRepository.save(userSend);
//        userRepository.save(userReceive);
//
//        kafkaTemplate.send("friendship-requests",
//                "Friend request rejected by " + userReceive.getUsername() + " from " + userSend.getUsername());
//
//        return FriendshipResponse.builder()
//                .senderUsername(userSend.getUsername())
//                .recipientUsername(userReceive.getUsername())
//                .status(FriendshipStatus.REJECTED)
//                .build();
//    }



//    public FriendshipResponse unfriend(String friendId) {
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        String userId = authentication.getName();
//
//        UserProfile currentUser = userProfileRepository.findById(userId)
//                .orElseThrow(() -> new RuntimeException("Current user with ID " + userId + " not found"));
//        UserProfile friendUser = userProfileRepository.findById(friendId)
//                .orElseThrow(() -> new RuntimeException("Friend user with ID " + friendId + " not found"));
//
//        Optional<Friendship> friendshipOpt = friendshipRepository.findByUserProfile1AndUserProfile2(currentUser, friendUser);
//        if (friendshipOpt.isEmpty()) {
//            throw new RuntimeException("Friendship not found between user " + userId + " and " + friendId);
//        }
//
//        Friendship friendship = friendshipOpt.get();
//        friendshipRepository.delete(friendship);
//
//        currentUser.getFriends().remove(friendship);
//        friendUser.getFriends().remove(friendship);
//
//        userProfileRepository.save(currentUser);
//        userProfileRepository.save(friendUser);
//
//        kafkaTemplate.send("friendship-requests",
//                "User " + currentUser.getUsername() + " unfriended " + friendUser.getUsername());
//
//        return FriendshipResponse.builder()
//                .senderUsername(currentUser.getUsername())
//                .recipientUsername(friendUser.getUsername())
//                .status(FriendshipStatus.NONE)
//                .build();
//    }

    public boolean isBlocked(String userId1, String userId2) {
        UserProfile userProfile1 = userProfileRepository.findByUserId(userId1).orElseThrow(() -> new RuntimeException("User not found"));
        UserProfile userProfile2 = userProfileRepository.findByUserId(userId2).orElseThrow(() -> new RuntimeException("User not found"));
        Optional<Friendship> friendship = friendshipRepository.findByUserProfile1AndUserProfile2(userProfile1, userProfile2);
        return friendship.isPresent() && friendship.get().getStatus() == FriendshipStatus.BLOCKED;
    }

}
