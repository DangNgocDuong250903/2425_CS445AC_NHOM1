package com.LinkVerse.profile.configuration;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.rekognition.AmazonRekognition;
import com.amazonaws.services.rekognition.AmazonRekognitionClientBuilder;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.translate.TranslateClient;

@Configuration
public class AwsConfig {
    private static final Logger logger = LoggerFactory.getLogger(AwsConfig.class);
    private static final String AWS_ACCESS_KEY = "AKIAS6J7QIGOAHPPSVWK";
    private static final String AWS_SECRET_KEY = "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";
    private static final String REGION = "us-east-1";

    @Bean
    public AmazonS3 amazonS3() {
        try {
            BasicAWSCredentials awsCredentials = new BasicAWSCredentials(AWS_ACCESS_KEY, AWS_SECRET_KEY);
            return AmazonS3ClientBuilder.standard()
                    .withCredentials(new AWSStaticCredentialsProvider(awsCredentials))
                    .withRegion(REGION)
                    .build();
        } catch (Exception e) {
            logger.error("Error creating Amazon S3 client", e);
            throw new RuntimeException("Error creating Amazon S3 client", e);
        }
    }

    @Bean
    public TranslateClient translateClient() {
        try {
            AwsBasicCredentials awsCredentials = AwsBasicCredentials.create(AWS_ACCESS_KEY, AWS_SECRET_KEY);
            return TranslateClient.builder()
                    .credentialsProvider(StaticCredentialsProvider.create(awsCredentials))
                    .region(Region.of(REGION))
                    .build();
        } catch (Exception e) {
            logger.error("Error creating Translate client", e);
            throw new RuntimeException("Error creating Translate client", e);
        }
    }

    @Bean
    public AmazonRekognition amazonRekognition() {
        try {
            BasicAWSCredentials awsCredentials = new BasicAWSCredentials(AWS_ACCESS_KEY, AWS_SECRET_KEY);
            return AmazonRekognitionClientBuilder.standard()
                    .withRegion(REGION)
                    .withCredentials(new AWSStaticCredentialsProvider(awsCredentials))
                    .build();
        } catch (Exception e) {
            logger.error("Error creating Amazon Rekognition client", e);
            throw new RuntimeException("Error creating Amazon Rekognition client", e);
        }
    }

}