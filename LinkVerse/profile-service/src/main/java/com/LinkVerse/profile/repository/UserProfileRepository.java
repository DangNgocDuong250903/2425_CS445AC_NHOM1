package com.LinkVerse.profile.repository;

import com.LinkVerse.profile.entity.UserProfile;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserProfileRepository extends Neo4jRepository<UserProfile, String> {
        Optional<UserProfile> findByUserID(String userID);
        Optional<UserProfile> findByUsername(String username);

}
