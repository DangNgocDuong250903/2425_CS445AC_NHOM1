package com.LinkVerse.Friend.repository;

import com.LinkVerse.Friend.entity.Friendship;
import com.LinkVerse.Friend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FriendshipRepository extends JpaRepository<Friendship, Long> {
    Optional<Friendship> findByUser1AndUser2(User user1, User user2);
}