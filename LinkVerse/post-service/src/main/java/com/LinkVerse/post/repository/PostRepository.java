package com.LinkVerse.post.repository;

import com.LinkVerse.post.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface PostRepository extends MongoRepository<Post, String> {
    Page<Post> findAllByUserId(String userId, Pageable pageable);

    Page<Post> findAllByContent(String content, Pageable pageable);

    Page<Post> findAllByUserIdAndLanguage(String userId, String language, Pageable pageable);

    Page<Post> findAllByLanguage(String language, Pageable pageable);

    List<Post> findByKeywordsIn(List<String> keywordIds); // Use 'keywords' instead of 'keywordIds'

    List<Post> findAllByKeywordsContains(String keywordId); // Use 'keywords' instead of 'keywordIds'
}