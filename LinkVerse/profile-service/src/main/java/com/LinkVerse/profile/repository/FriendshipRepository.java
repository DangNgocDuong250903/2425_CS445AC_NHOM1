package com.LinkVerse.profile.repository;

import com.LinkVerse.profile.entity.Friendship;
import com.LinkVerse.profile.entity.FriendshipStatus;
import com.LinkVerse.profile.entity.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FriendshipRepository extends JpaRepository<Friendship, Long> {
    Optional<Friendship> findByUserProfile1AndUserProfile2(UserProfile user1, UserProfile user2);
    List<Friendship> findByUserProfile1AndStatus(UserProfile user1, FriendshipStatus status);
    List<Friendship> findByUserProfile1OrUserProfile2AndStatus(UserProfile user1, UserProfile user2, FriendshipStatus status);
    List<Friendship> findByUserProfile2AndStatus(UserProfile user2, FriendshipStatus status);
    Optional<Friendship> findByUserProfile1AndUserProfile2AndStatus(UserProfile user1, UserProfile user2, FriendshipStatus status);
}