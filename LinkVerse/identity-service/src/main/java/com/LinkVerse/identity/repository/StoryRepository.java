package com.LinkVerse.identity.repository;

import com.LinkVerse.identity.entity.Story;
import com.LinkVerse.identity.entity.StoryVisibility;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface StoryRepository extends JpaRepository<Story, String> {
    List<Story> findAllByUserIdAndExpiryTimeAfter(String userId, LocalDateTime currentTime);

    void deleteByExpiryTimeBefore(LocalDateTime currentTime);

    void deleteByPostedAtBefore(LocalDateTime time);

    List<Story> findAllByExpiryTimeAfterAndVisibilityOrUserIdAndExpiryTimeAfter(
            LocalDateTime expiryTime, StoryVisibility visibility, String userId, LocalDateTime expiryTimeAgain);
}