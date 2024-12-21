package com.LinkVerse.Friend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.LinkVerse.Friend.entity.Friendship;
import com.LinkVerse.Friend.entity.FriendshipStatus;
import com.LinkVerse.Friend.entity.User;

public interface FriendshipRepository extends JpaRepository<Friendship, String> {
    Optional<Friendship> findByUser1AndUser2(User user1, User user2);

    List<Friendship> findByUser1AndStatus(User user1, FriendshipStatus status);
}
