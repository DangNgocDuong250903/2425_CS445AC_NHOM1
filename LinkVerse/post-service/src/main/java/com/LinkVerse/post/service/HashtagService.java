package com.LinkVerse.post.service;

import com.LinkVerse.post.configuration.TagProcessor;
import com.LinkVerse.post.entity.Hashtag;
import com.LinkVerse.post.repository.HashtagRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class HashtagService {
    private final HashtagRepository hashtagRepository;
    private final TagProcessor tagProcessor;

    public List<Hashtag> extractAndSaveHashtags(String content, String contentId) {
        try {
            // Extract hashtags
            Set<String> hashtags = tagProcessor.extractHashtags(content);

            // Process hashtags
            List<Hashtag> hashtagEntities = hashtags.stream()
                    .map(tag -> hashtagRepository.findByPhraseIn(List.of(tag)).stream().findFirst()
                            .orElseGet(() -> Hashtag.builder()
                                    .phrase(tag)
                                    .usageCount(0)
                                    .linkedContentIds(new ArrayList<>())
                                    .build()))
                    .peek(hashtag -> {
                        hashtag.setUsageCount(hashtag.getUsageCount() + 1);
                        hashtag.getLinkedContentIds().add(contentId);
                    })
                    .map(hashtagRepository::save)
                    .collect(Collectors.toList());

            return hashtagEntities;
        } catch (Exception e) {
            log.error("Error extracting hashtags: ", e);
            return List.of();
        }
    }
}