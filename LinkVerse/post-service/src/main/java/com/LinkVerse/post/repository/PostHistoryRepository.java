package com.LinkVerse.post.repository;

import com.LinkVerse.post.entity.PostHistory;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PostHistoryRepository extends MongoRepository<PostHistory, String> {
}