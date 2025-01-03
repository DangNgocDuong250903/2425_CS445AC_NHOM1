package com.LinkVerse.profile.repository;

import com.LinkVerse.profile.entity.Friendship;
import com.LinkVerse.profile.entity.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface FriendshipRepository extends JpaRepository<Friendship, String> {

    @Query("SELECT f FROM Friendship f " +
            "WHERE (f.sender = :user1 AND f.recipient = :user2) " +
            "OR (f.sender = :user2 AND f.recipient = :user1)")
    Optional<Friendship> findByUserProfiles(@Param("user1") UserProfile user1, @Param("user2") UserProfile user2);

    @Query("SELECT f.recipient FROM Friendship f " +
            "WHERE f.sender = :user AND f.status = 'ACCEPTED' " +
            "UNION " +
            "SELECT f.sender FROM Friendship f " +
            "WHERE f.recipient = :user AND f.status = 'ACCEPTED'")
    Set<UserProfile> findFriendsByUserAndStatusAccepted(@Param("user") UserProfile user);

    @Query("SELECT f FROM Friendship f " +
            "WHERE f.sender = :user AND f.status = 'BLOCKED'")
    List<Friendship> findUsersBlocked(@Param("user") UserProfile user);

    @Query("SELECT f.sender FROM Friendship f " +
            "WHERE f.recipient = :user AND f.status = 'PENDING'")
    Set<UserProfile> findFriendRequestsByUserAndStatusPending(@Param("user") UserProfile user);

    @Query("SELECT f.recipient FROM Friendship f " +
            "WHERE f.sender = :user AND f.status = 'PENDING'")
    Set<UserProfile> findSentFriendRequestsByUser(@Param("user") UserProfile user);

    @Modifying
    @Query("DELETE FROM Friendship f WHERE f.sender = :userProfile OR f.recipient = :userProfile")
    void deleteByUserProfile(@Param("userProfile") UserProfile userProfile);
}