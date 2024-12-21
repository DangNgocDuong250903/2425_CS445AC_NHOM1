package com.LinkVerse.post.repository;

import com.LinkVerse.post.entity.Group;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface GroupRepository extends MongoRepository<Group, String> {
    Optional<Group> findByName(String name);
}