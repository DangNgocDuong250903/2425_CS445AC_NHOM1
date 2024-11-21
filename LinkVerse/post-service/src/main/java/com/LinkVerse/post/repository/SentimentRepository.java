package com.LinkVerse.post.repository;

import com.LinkVerse.post.entity.Sentiment;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface SentimentRepository extends MongoRepository<Sentiment, String> {
}