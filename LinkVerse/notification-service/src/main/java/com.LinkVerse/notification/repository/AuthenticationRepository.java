package com.LinkVerse.notification.repository;

import com.LinkVerse.notification.entity.User; // Thay thế import của User cho đúng
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AuthenticationRepository {
      Optional<User> findUserByEmail(String email);
    String generatePasswordResetToken(User user);
}
