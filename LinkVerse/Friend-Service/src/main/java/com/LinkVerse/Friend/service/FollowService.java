package com.LinkVerse.Friend.service;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.LinkVerse.Friend.entity.User;
import com.LinkVerse.Friend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FollowService {
    private final UserRepository userRepository;
    private final FriendService friendService;
    private final KafkaTemplate<String, String> kafkaTemplate;

    public void followUser(String targetUserId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserId = authentication.getName();

        User user1 = userRepository
                .findById(currentUserId)
                .orElseThrow(() -> new RuntimeException("Current user not found"));
        User user2 =
                userRepository.findById(targetUserId).orElseThrow(() -> new RuntimeException("Target user not found"));

        if (friendService.isBlocked(user1.getId(), user2.getId())
                || friendService.isBlocked(user2.getId(), user1.getId())) {
            throw new RuntimeException("Cannot follow a blocked user");
        }

        if (!user1.getFollowings().contains(targetUserId)) {
            user1.getFollowings().add(targetUserId);
            user2.getFollowers().add(currentUserId);

            userRepository.save(user1);
            userRepository.save(user2);

            kafkaTemplate.send("user-follow", user1.getUsername() + " followed " + user2.getUsername());
        }
    }

    public void unfollowUser(String targetUserId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserId = authentication.getName();

        User user1 = userRepository
                .findById(currentUserId)
                .orElseThrow(() -> new RuntimeException("Current user not found"));
        User user2 =
                userRepository.findById(targetUserId).orElseThrow(() -> new RuntimeException("Target user not found"));

        if (user1.getFollowings().contains(targetUserId)) {
            user1.getFollowings().remove(targetUserId);
            user2.getFollowers().remove(currentUserId);

            userRepository.save(user1);
            userRepository.save(user2);

            kafkaTemplate.send("user-unfollow", user1.getUsername() + " unfollowed " + user2.getUsername());
        }
    }
}
