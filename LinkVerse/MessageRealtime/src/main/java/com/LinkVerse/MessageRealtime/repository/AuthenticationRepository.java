package com.LinkVerse.MessageRealtime.repository;

import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AuthenticationRepository {
    Optional<User> findUserByEmail(String email);

    String generatePasswordResetToken(User user);
}
