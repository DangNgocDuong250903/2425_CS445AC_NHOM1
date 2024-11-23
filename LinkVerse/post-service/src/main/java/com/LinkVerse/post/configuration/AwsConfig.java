package com.LinkVerse.post.configuration;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.translate.TranslateClient;
import software.amazon.awssdk.services.translate.model.TranslateTextRequest;
import software.amazon.awssdk.services.translate.model.TranslateTextResponse;

@Configuration
public class AwsConfig {

    @Bean
    public AmazonS3 amazonS3() {
        try {
            BasicAWSCredentials awsCredentials = new BasicAWSCredentials("AKIAS6J7QIGOAHPPSVWK", "VRO/h3k2lr0A9ywnc59GmAZO2H9KN+SgGfNmxhQb");
            return AmazonS3ClientBuilder.standard()
                    .withCredentials(new AWSStaticCredentialsProvider(awsCredentials))
                    .withRegion("us-east-2")
                    .build();
        } catch (Exception e) {
            throw new RuntimeException("Error creating Amazon S3 client", e);
        }
    }

    @Bean
    public TranslateClient translateClient() {
        AwsBasicCredentials awsCredentials = AwsBasicCredentials.create("AKIAS6J7QIGOAHPPSVWK", "VRO/h3k2lr0A9ywnc59GmAZO2H9KN+SgGfNmxhQb");
        return TranslateClient.builder()
                .credentialsProvider(StaticCredentialsProvider.create(awsCredentials))
                .region(Region.US_EAST_2)  // Ensure that this matches the region you intend to use
                .build();
    }

    // Example: Implement a method to use the TranslateClient to translate text
    public String translateText(String text, String sourceLanguage, String targetLanguage) {
        TranslateClient translateClient = translateClient();

        // Create a request to translate text
        TranslateTextRequest request = TranslateTextRequest.builder()
                .text(text)
                .sourceLanguageCode(sourceLanguage)
                .targetLanguageCode(targetLanguage)
                .build();

        TranslateTextResponse response = translateClient.translateText(request);
        return response.translatedText(); // Return translated text
    }

    @PostConstruct
    public void disableEc2Metadata() {
        System.setProperty("AWS_EC2_METADATA_DISABLED", "true");
    }
}