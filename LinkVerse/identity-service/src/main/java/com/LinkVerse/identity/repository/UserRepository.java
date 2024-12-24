package com.LinkVerse.identity.repository;

import com.LinkVerse.identity.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    Optional<User> findByUsername(String username);

    Optional<User> findById(String requesterId);

    User findUserById(String id);

    Optional<User> findByEmail(String email);

    List<User> findUserByDeletedAtBefore(LocalDateTime dateTime);

    void deleteAllByDeletedAtBefore(LocalDateTime dateTime);


    User findByUserId(String requesterId);

}
