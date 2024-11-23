package com.LinkVerse.post.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.comprehend.ComprehendClient;

@Configuration
public class AwsComprehendConfig {

    @Bean
    public ComprehendClient amazonComprehend() {
        AwsBasicCredentials awsCredentials = AwsBasicCredentials.create("AKIAS6J7QIGOAHPPSVWK", "VRO/h3k2lr0A9ywnc59GmAZO2H9KN+SgGfNmxhQb");
        return ComprehendClient.builder()
                .region(Region.US_EAST_2) // specify the region
                .credentialsProvider(StaticCredentialsProvider.create(awsCredentials))
                .build();
    }
}
