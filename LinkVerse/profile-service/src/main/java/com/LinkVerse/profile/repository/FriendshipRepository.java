package com.LinkVerse.profile.repository;

import com.LinkVerse.profile.entity.Friendship;
import com.LinkVerse.profile.entity.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface FriendshipRepository extends JpaRepository<Friendship, Long> {

    @Query("SELECT f FROM Friendship f JOIN f.userProfiles u1 JOIN f.userProfiles u2 " +
            "WHERE u1 = :user1 AND u2 = :user2")
    Optional<Friendship> findByUserProfiles(@Param("user1") UserProfile user1, @Param("user2") UserProfile user2);

    @Query("SELECT u FROM Friendship f JOIN f.userProfiles u " +
            "WHERE :user MEMBER OF f.userProfiles " +
            "AND f.status = 'ACCEPTED'")
    Set<UserProfile> findFriendsByUserAndStatusAccepted(@Param("user") UserProfile user);

    @Query("SELECT u FROM Friendship f JOIN f.userProfiles u " +
            "WHERE :user MEMBER OF f.userProfiles " +
            "AND f.status = 'PENDING'")
    Set<UserProfile> findFriendRequestsByUserAndStatusPending(@Param("user") UserProfile user);

    @Query("SELECT f FROM Friendship f " +
            "JOIN f.userProfiles u " +
            "WHERE u = :user " +
            "AND f.status = 'BLOCKED'")
    List<Friendship> findUsersBlocked(@Param("user") UserProfile user);

    @Query("SELECT u2 FROM Friendship f JOIN f.userProfiles u1 JOIN f.userProfiles u2 " +
            "WHERE u1 = :user AND f.status = 'PENDING'")
    Set<UserProfile> findSentFriendRequestsByUser(@Param("user") UserProfile user);


    void deleteByUserProfilesContaining(UserProfile userProfile);
}