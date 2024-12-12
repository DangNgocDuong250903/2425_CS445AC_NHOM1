package com.LinkVerse.post.entity;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(value = "hashtag")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Hashtag {
    @MongoId
    String id;
    String phrase;
    int usageCount;
    List<String> linkedContentIds;
}