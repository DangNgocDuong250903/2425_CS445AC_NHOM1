package com.LinkVerse.post.service;

import com.LinkVerse.post.configuration.TagProcessor;
import com.LinkVerse.post.entity.Keyword;
import com.LinkVerse.post.repository.KeywordRepository;
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
    private final KeywordRepository keywordRepository;
    private final TagProcessor tagProcessor;

    public List<Keyword> extractAndSaveHashtags(String content, String contentId) {
        try {
            // Extract hashtags
            Set<String> hashtags = tagProcessor.extractHashtags(content);

            // Process hashtags
            List<Keyword> hashtagKeywords = hashtags.stream()
                    .map(tag -> keywordRepository.findByPhraseIn(List.of(tag)).stream().findFirst()
                            .orElseGet(() -> Keyword.builder()
                                    .phrase(tag)
                                    .usageCount(0)
                                    .type("HASHTAG") // Assign type HASHTAG
                                    .linkedContentIds(new ArrayList<>())
                                    .build()))
                    .peek(keyword -> {
                        keyword.setUsageCount(keyword.getUsageCount() + 1);
                        keyword.getLinkedContentIds().add(contentId);
                    })
                    .map(keywordRepository::save)
                    .collect(Collectors.toList());

            return hashtagKeywords;
        } catch (Exception e) {
            log.error("Error extracting hashtags: ", e);
            return List.of();
        }
    }
}