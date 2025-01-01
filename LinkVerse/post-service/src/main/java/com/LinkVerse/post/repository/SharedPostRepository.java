package com.LinkVerse.post.repository;

import com.LinkVerse.post.entity.Post;
import com.LinkVerse.post.entity.SharedPost;
import com.LinkVerse.post.entity.Story;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@EnableMongoRepositories
@Repository
public interface SharedPostRepository extends MongoRepository<SharedPost, String> {
    Page<SharedPost> findSharedPostByUserId(String userId, Pageable pageable);

}
