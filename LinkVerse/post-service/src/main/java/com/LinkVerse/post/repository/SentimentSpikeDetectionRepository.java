package com.LinkVerse.post.repository;

import com.LinkVerse.post.entity.Post;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

import java.time.Instant;

@EnableMongoRepositories
public interface SentimentSpikeDetectionRepository extends MongoRepository<Post, String> {

    @Query("{ 'createdDate': { $gte: ?0, $lte: ?1 }, 'primarySentiment': 'NEGATIVE' }")
    long countNegativePostsInTimeRange(Instant start, Instant end);

    @Query("{ 'createdDate': { $gte: ?0, $lte: ?1 } }")
    long countTotalPostsInTimeRange(Instant start, Instant end);
}