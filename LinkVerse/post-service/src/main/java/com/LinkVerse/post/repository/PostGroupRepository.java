package com.LinkVerse.post.repository;

import com.LinkVerse.post.entity.Post;
import com.LinkVerse.post.entity.PostGroup;
import com.LinkVerse.post.entity.PostVisibility;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

import java.util.List;

@EnableMongoRepositories
public interface PostGroupRepository extends MongoRepository<PostGroup, String> {


    Page<PostGroup> findAllByUserId(String userId, Pageable pageable);

    Page<PostGroup> findPostByUserId(String userId, Pageable pageable);

    Page<PostGroup> findAllByContent(String content, Pageable pageable);

    Page<PostGroup> findAllByLanguage(String language, Pageable pageable);

    Page<PostGroup> findAll(Pageable pageable);


    List<PostGroup> findByKeywordsIn(List<String> keywordIds); // Use 'keywords' instead of 'keywordIds'


    Page<PostGroup> findAllByPrimarySentiment(String primarySentiment, Pageable pageable);

    Page<PostGroup> findAllByHashtagsContaining(String hashtag, Pageable pageable);

    Page<PostGroup> findAllByHashtags_Name(String hashtag, Pageable pageable);

    Page<PostGroup> findAllBySavedBy(String currentUserId, Pageable pageable);
}