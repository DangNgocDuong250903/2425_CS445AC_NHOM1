package com.LinkVerse.identity.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.LinkVerse.identity.entity.Group;

public interface GroupRepository extends JpaRepository<Group, String> {
    Optional<Group> findByName(String name); // Sửa thành Optional<Group>
}
