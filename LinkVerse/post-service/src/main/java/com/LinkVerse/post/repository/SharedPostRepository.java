package com.LinkVerse.post.repository;

import com.LinkVerse.post.entity.SharedPost;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SharedPostRepository extends MongoRepository<SharedPost, String> {
}
