package com.LinkVerse.profile.repository;

import com.LinkVerse.profile.entity.Friendship;
import com.LinkVerse.profile.entity.UserProfile;
import org.springframework.data.neo4j.repository.Neo4jRepository;


import java.util.Optional;

public interface FriendshipRepository extends Neo4jRepository<Friendship, String> {
    Optional<Friendship> findByUserProfile1AndUserProfile2(UserProfile user1, UserProfile user2);
}