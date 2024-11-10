package com.LinkVerse.post.configuration;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AwsConfig {

    @Bean
    public AmazonS3 amazonS3() {
        
        BasicAWSCredentials awsCredentials = new BasicAWSCredentials("AKIATCKANL35JUXP2NFF", "N0AJWmp04imldBWYPbOCQie09C4lt7VFDgznd/G2");
        //Key het han
        return AmazonS3ClientBuilder.standard()
                .withCredentials(new AWSStaticCredentialsProvider(awsCredentials))
                .withRegion("ap-southeast-2")
                .build();
    }
}