package com.LinkVerse.profile.configuration;

import org.apache.kafka.clients.admin.AdminClient;
import org.apache.kafka.clients.admin.NewTopic;
import org.apache.kafka.common.errors.TopicExistsException;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.core.KafkaAdmin;

import java.util.List;
import java.util.concurrent.ExecutionException;

@Configuration
public class KafkaTopicConfig {

    private final KafkaAdmin kafkaAdmin;

    public KafkaTopicConfig(KafkaAdmin kafkaAdmin) {
        this.kafkaAdmin = kafkaAdmin;
    }

    @Bean
    public NewTopic createTopic() {
        String topicName = "friendship-requests";
        int partitions = 1;
        short replicationFactor = 1;

        try (AdminClient adminClient = AdminClient.create(kafkaAdmin.getConfigurationProperties())) {
            if (adminClient.listTopics().names().get().contains(topicName)) {
                // Topic đã tồn tại, không cần tạo
                return null;
            }
            // Tạo topic nếu chưa tồn tại
            adminClient.createTopics(
                    List.of(new NewTopic(topicName, partitions, replicationFactor))
            ).all().get();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt(); // Đặt lại trạng thái bị ngắt
            throw new RuntimeException("Thread was interrupted while creating Kafka topic", e);
        } catch (ExecutionException e) {
            if (e.getCause() instanceof TopicExistsException) {
                // Topic đã tồn tại
                return null;
            }
            throw new RuntimeException("Error while checking/creating Kafka topic", e);
        }
        return new NewTopic(topicName, partitions, replicationFactor);
    }

}