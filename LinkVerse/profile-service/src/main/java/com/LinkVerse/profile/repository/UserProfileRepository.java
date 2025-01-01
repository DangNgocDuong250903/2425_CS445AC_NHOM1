package com.LinkVerse.profile.repository;

import com.LinkVerse.profile.entity.UserProfile;
import com.LinkVerse.profile.entity.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, String> {
    Optional<UserProfile> findByUserId(String id);

    UserProfile findUserProfileByUserId(String id);

    List<UserProfile> findAllByStatus(UserStatus status);

}