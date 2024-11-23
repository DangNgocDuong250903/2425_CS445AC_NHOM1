package com.LinkVerse.Friend.config;

import org.apache.kafka.clients.admin.AdminClient;
import org.apache.kafka.clients.admin.AdminClientConfig;
import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Collections;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@Configuration
public class KafkaConfig {

    @Bean
    public AdminClient adminClient() {
        Map<String, Object> configs = Collections.singletonMap(AdminClientConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9094");
        return AdminClient.create(configs);
    }

    @Bean
    public NewTopic createTopic() {
        NewTopic topic = new NewTopic("friendship-requests", 1, (short) 1);
        try (AdminClient adminClient = adminClient()) {
            adminClient.createTopics(Collections.singletonList(topic)).all().get();
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
        }
        return topic;
    }
}