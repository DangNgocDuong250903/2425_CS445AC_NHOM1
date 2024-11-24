package com.LinkVerse.Friend.repository;

import com.LinkVerse.Friend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    boolean existsByUsername(String username);

    Optional<User> findByUsername(String username);

    Optional<User> findById(String requesterId);

    List<User> findByUsernameContaining(String username);

}
