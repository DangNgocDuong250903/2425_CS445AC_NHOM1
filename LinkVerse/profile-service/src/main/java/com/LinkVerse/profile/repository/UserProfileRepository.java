package com.LinkVerse.profile.repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import com.LinkVerse.profile.entity.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.LinkVerse.profile.entity.UserProfile;

@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, String> {
    Optional<UserProfile> findByUserId(String userId);
    List<UserProfile> findAllByStatus(UserStatus status);

}