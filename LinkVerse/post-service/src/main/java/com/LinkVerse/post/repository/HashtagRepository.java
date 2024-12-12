package com.LinkVerse.post.repository;

import com.LinkVerse.post.entity.Hashtag;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface HashtagRepository extends MongoRepository<Hashtag, String> {
    List<Hashtag> findByPhraseIn(List<String> phrases);
}