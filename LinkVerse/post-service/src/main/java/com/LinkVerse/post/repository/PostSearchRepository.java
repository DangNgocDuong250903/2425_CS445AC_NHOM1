package com.LinkVerse.post.repository;

import com.LinkVerse.post.entity.PostDocument;
import com.LinkVerse.post.entity.PostVisibility;
import org.springframework.data.elasticsearch.annotations.Query;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import java.io.Serializable;
import java.util.List;

@Repository
public interface PostSearchRepository extends ElasticsearchRepository<PostDocument, String> {
    List<PostDocument> findByContentContaining(String content);
    List<PostDocument> findByComments_ContentContaining(String commentText);
    List<PostDocument> findByVisibility(PostVisibility visibility);
}