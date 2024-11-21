package com.LinkVerse.post.repository;

import com.LinkVerse.post.entity.Keyword;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface KeywordRepository extends MongoRepository<Keyword, String> {
    List<Keyword> findByPhraseIn(List<String> phrases);
}
