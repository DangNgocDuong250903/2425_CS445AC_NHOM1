package com.LinkVerse.MessageRealtime.repository;

import com.LinkVerse.MessageRealtime.entity.User;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AuthenticationRepository {
    Optional<User> findUserByEmail(String email);

    String generatePasswordResetToken(User user);
}
