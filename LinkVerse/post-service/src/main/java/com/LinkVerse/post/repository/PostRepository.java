package com.LinkVerse.post.repository;

import com.LinkVerse.post.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

import java.util.List;

@EnableMongoRepositories
public interface PostRepository extends MongoRepository<Post, String> {
    Page<Post> findAllByUserId(String userId, Pageable pageable);

    Page<Post> findPostByUserId(String userId, Pageable pageable);


    Page<Post> findAllByContent(String content, Pageable pageable);


    Page<Post> findAllByLanguage(String language, Pageable pageable);

    Page<Post> findAll(Pageable pageable);


    List<Post> findByKeywordsIn(List<String> keywordIds); // Use 'keywords' instead of 'keywordIds'


    Page<Post> findAllByPrimarySentiment(String primarySentiment, Pageable pageable);

    Page<Post> findAllByHashtagsContaining(String hashtag, Pageable pageable);

    Page<Post> findAllByHashtags_Name(String hashtag, Pageable pageable);

    Page<Post> findAllBySavedBy(String currentUserId, Pageable pageable);
}