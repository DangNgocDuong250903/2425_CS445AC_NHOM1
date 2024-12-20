package com.LinkVerse.identity.repository;

import com.LinkVerse.identity.entity.Group;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GroupRepository extends JpaRepository<Group, String> {
    Optional<Group> findByName(String name); // Sửa thành Optional<Group>
}
