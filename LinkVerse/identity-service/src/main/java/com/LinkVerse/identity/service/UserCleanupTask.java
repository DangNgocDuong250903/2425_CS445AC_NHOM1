package com.LinkVerse.identity.service;

import com.LinkVerse.identity.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class UserCleanupTask {
    private final UserRepository userRepository;

    @Scheduled(cron = "0 0 0 * * ?")
    public void deleteMarkedUsers() {
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        userRepository.deleteAllByDeletedAtBefore(thirtyDaysAgo);
        log.info("Deleted users marked for deletion before {}", thirtyDaysAgo);
    }
}