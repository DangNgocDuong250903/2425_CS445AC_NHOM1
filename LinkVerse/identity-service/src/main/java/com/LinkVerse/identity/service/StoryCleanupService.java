package com.LinkVerse.identity.service;

import com.LinkVerse.identity.repository.StoryRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class StoryCleanupService {
    private final StoryRepository storyRepository;

    @Transactional
    public void deleteExpiredStories() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime thresholdTime = now.minusHours(24);
        storyRepository.deleteByPostedAtBefore(thresholdTime);
        log.info("Stories older than 24 hours deleted successfully at {}", now);
    }
}
