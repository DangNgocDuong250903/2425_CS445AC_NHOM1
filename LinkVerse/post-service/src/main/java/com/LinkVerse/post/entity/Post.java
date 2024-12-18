package com.LinkVerse.post.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(value = "post")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Post {
    @MongoId
    String id;
    String userId;
    String content;

    @ElementCollection
    List<String> imageUrl;

    @Enumerated(EnumType.STRING)
    private PostVisibility visibility;

    Instant createdDate;
    Instant modifiedDate;
    int like;
    int unlike;
    int commentCount;
    List<Comment> comments = new ArrayList<Comment>();
    List<String> likedEmojis;
    @ManyToOne
    @JoinColumn(name = "shared_post_id")
    Post sharedPost;
    boolean deleted = false;
    String language;
    @ElementCollection
    List<String> keywords = new ArrayList<>(); // Ensure this property is named 'keywords'
    String mostActiveUserId;

    @DBRef
    List<Hashtag> hashtags = new ArrayList<>();
    //Phantich cam xuc
    String primarySentiment;
    double positiveScore;
    double negativeScore;
    double neutralScore;
    double mixedScore;

    boolean hasViolation = false;
    boolean violationResolved = false;
}