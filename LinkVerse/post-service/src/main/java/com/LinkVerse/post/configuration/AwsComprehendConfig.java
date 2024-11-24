package com.LinkVerse.post.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.comprehend.ComprehendClient;

@Configuration
public class AwsComprehendConfig {
    private static final String AWS_ACCESS_KEY = "AKIAS6J7QIGOAHPPSVWK";
    private static final String AWS_SECRET_KEY = "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";
    private static final String REGION = "us-east-1";

    @Bean
    public ComprehendClient amazonComprehend() {
        AwsBasicCredentials awsCredentials = AwsBasicCredentials.create(AWS_ACCESS_KEY, AWS_SECRET_KEY);
        return ComprehendClient.builder()
                .region(Region.US_EAST_1) // specify the region
                .credentialsProvider(StaticCredentialsProvider.create(awsCredentials))
                .build();
    }
}
