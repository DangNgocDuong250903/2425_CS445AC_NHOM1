package com.LinkVerse.identity.repository;

import com.LinkVerse.identity.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    Optional<User> findByUsername(String username);

    Optional<User> findById(String requesterId);

    Optional<User> findByEmail(String email);


    User findByUserId(String requesterId);

}
