package com.LinkVerse.profile.service;

import com.LinkVerse.profile.dto.response.FriendshipResponse;
import com.LinkVerse.profile.dto.response.UserProfileResponse;
import com.LinkVerse.profile.entity.Friendship;
import com.LinkVerse.profile.entity.FriendshipStatus;
import com.LinkVerse.profile.entity.UserProfile;
import com.LinkVerse.profile.mapper.UserProfileMapper;
import com.LinkVerse.profile.repository.FriendshipRepository;
import com.LinkVerse.profile.repository.UserProfileRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class BlockService {
    FriendshipRepository friendshipRepository;
    UserProfileRepository userRepository;
    UserProfileMapper userProfileMapper;

    public FriendshipResponse blockUser(String targetUserId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserId = authentication.getName();

        UserProfile currentUser = userRepository.findByUserId(currentUserId)
                .orElseThrow(() -> new RuntimeException("Current user not found"));
        UserProfile targetUser = userRepository.findByUserId(targetUserId)
                .orElseThrow(() -> new RuntimeException("Target user not found"));

        if (isBlocked(targetUser.getUserId(), currentUser.getUserId())) {
            throw new RuntimeException("Cannot block a user who has already blocked you");
        }

        Optional<Friendship> friendshipOpt = friendshipRepository.findByUserProfiles(currentUser, targetUser);

        if (friendshipOpt.isPresent()) {
            Friendship friendship = friendshipOpt.get();
            friendship.setStatus(FriendshipStatus.BLOCKED);
            friendship.setBlockedAt(LocalDateTime.now());
            friendshipRepository.save(friendship);
        } else {
            Friendship newFriendship = Friendship.builder()
                    .userProfiles(Set.of(currentUser, targetUser))
                    .status(FriendshipStatus.BLOCKED)
                    .blockedAt(LocalDateTime.now())
                    .build();
            friendshipRepository.save(newFriendship);
        }

        return FriendshipResponse.builder()
                .senderUsername(currentUser.getUsername())
                .recipientUsername(targetUser.getUsername())
                .status(FriendshipStatus.BLOCKED)
                .build();
    }

    public FriendshipResponse unblockUser(String targetUserId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserId = authentication.getName();

        UserProfile currentUser = userRepository.findByUserId(currentUserId)
                .orElseThrow(() -> new RuntimeException("Current user not found"));
        UserProfile targetUser = userRepository.findByUserId(targetUserId)
                .orElseThrow(() -> new RuntimeException("Target user not found"));

        Optional<Friendship> friendshipOpt = friendshipRepository.findByUserProfiles(currentUser, targetUser);

        if (friendshipOpt.isPresent()) {
            Friendship friendship = friendshipOpt.get();
            if (friendship.getStatus() == FriendshipStatus.BLOCKED) {
                friendshipRepository.delete(friendship);
            } else {
                throw new RuntimeException("No existing block to unblock");
            }
        } else {
            throw new RuntimeException("No existing friendship to unblock");
        }

        return FriendshipResponse.builder()
                .senderUsername(currentUser.getUsername())
                .recipientUsername(targetUser.getUsername())
                .status(FriendshipStatus.NONE)
                .build();
    }


    public Set<UserProfileResponse> getBlockedUsers() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserId = authentication.getName();

        UserProfile currentUser = userRepository.findByUserId(currentUserId)
                .orElseThrow(() -> new RuntimeException("Current user not found"));

        List<Friendship> blockedFriendships = friendshipRepository.findUsersBlocked(currentUser);

        Set<UserProfile> blockedUsers = blockedFriendships.stream()
                .flatMap(friendship -> friendship.getUserProfiles().stream()
                        .filter(user -> !user.equals(currentUser))
                )
                .collect(Collectors.toSet());
        return blockedUsers.stream()
                .map(userProfileMapper::toUserProfileReponse)
                .collect(Collectors.toSet());
    }

    private boolean isBlocked(String targetUserId, String currentUserId) {
        Optional<Friendship> friendshipOpt = friendshipRepository.findByUserProfiles(
                userRepository.findByUserId(targetUserId).orElseThrow(() -> new RuntimeException("Target user not found")),
                userRepository.findByUserId(currentUserId).orElseThrow(() -> new RuntimeException("Current user not found"))
        );
        return friendshipOpt.isPresent() && friendshipOpt.get().getStatus() == FriendshipStatus.BLOCKED;

    }
}