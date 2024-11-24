package com.LinkVerse.post.service;

import com.LinkVerse.post.entity.Post;
import com.LinkVerse.post.entity.Sentiment;
import com.LinkVerse.post.repository.PostRepository;
import com.LinkVerse.post.repository.SentimentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.comprehend.ComprehendClient;
import software.amazon.awssdk.services.comprehend.model.DetectDominantLanguageRequest;
import software.amazon.awssdk.services.comprehend.model.DetectDominantLanguageResponse;
import software.amazon.awssdk.services.comprehend.model.DetectSentimentRequest;
import software.amazon.awssdk.services.comprehend.model.DetectSentimentResponse;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class SentimentAnalysisService {

    private final PostRepository postRepository;
    private final SentimentRepository sentimentRepository;
    private final ComprehendClient comprehendClient;

    private static final Set<String> SUPPORTED_LANGUAGES = new HashSet<>(List.of(
            "en", "es", "fr", "de", "it", "pt", "ar", "hi", "ja", "ko", "zh", "zh-TW"
    ));

    public void analyzeAndSaveSentiment(Post post) {
        try {
            // 1. Phát hiện ngôn ngữ của bài viết
            String languageCode = detectLanguage(post.getContent());
            log.info("Detected language for post ID {}: {}", post.getId(), languageCode);

            // 2. Kiểm tra nếu ngôn ngữ không được hỗ trợ
            if (!SUPPORTED_LANGUAGES.contains(languageCode)) {
                log.warn("Language '{}' is not supported for sentiment analysis. Skipping post ID {}.",
                        languageCode, post.getId());
                return;
            }

            // 3. Phân tích cảm xúc nếu ngôn ngữ được hỗ trợ
            DetectSentimentRequest detectSentimentRequest = DetectSentimentRequest.builder()
                    .text(post.getContent())
                    .languageCode(languageCode)
                    .build();

            DetectSentimentResponse detectSentimentResponse = comprehendClient.detectSentiment(detectSentimentRequest);

            // 4. Cập nhật bài viết với dữ liệu phân tích
            post.setPrimarySentiment(detectSentimentResponse.sentimentAsString());
            post.setPositiveScore(detectSentimentResponse.sentimentScore().positive());
            post.setNegativeScore(detectSentimentResponse.sentimentScore().negative());
            post.setNeutralScore(detectSentimentResponse.sentimentScore().neutral());
            post.setMixedScore(detectSentimentResponse.sentimentScore().mixed());

            postRepository.save(post);

            // 5. Lưu vào bảng Sentiment
            Sentiment sentiment = Sentiment.builder()
                    .postId(post.getId())
                    .primarySentiment(detectSentimentResponse.sentimentAsString())
                    .positiveScore(detectSentimentResponse.sentimentScore().positive())
                    .negativeScore(detectSentimentResponse.sentimentScore().negative())
                    .neutralScore(detectSentimentResponse.sentimentScore().neutral())
                    .mixedScore(detectSentimentResponse.sentimentScore().mixed())
                    .build();

            sentimentRepository.save(sentiment);
            log.info("Sentiment analysis completed for post ID {}.", post.getId());
        } catch (Exception e) {
            log.error("Error while analyzing sentiment for post ID {}: ", post.getId(), e);
        }
    }

    // Hàm phát hiện ngôn ngữ
    private String detectLanguage(String content) {
        try {
            DetectDominantLanguageRequest request = DetectDominantLanguageRequest.builder()
                    .text(content)
                    .build();

            DetectDominantLanguageResponse response = comprehendClient.detectDominantLanguage(request);

            if (response.languages().isEmpty()) {
                log.warn("No dominant language detected for content: {}", content);
                return "en"; // Mặc định là "en" nếu không phát hiện được
            }

            return response.languages().get(0).languageCode();
        } catch (Exception e) {
            log.error("Error detecting dominant language for content: ", e);
            return "en"; // Trả về "en" khi gặp lỗi
        }
    }
}
