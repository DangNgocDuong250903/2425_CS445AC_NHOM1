package com.LinkVerse.MessageRealtime.service;

import com.LinkVerse.MessageRealtime.dto.response.ChatMessage;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class KafkaProducer {

    private final KafkaTemplate<String, ChatMessage> kafkaTemplate;

    public KafkaProducer(KafkaTemplate<String, ChatMessage> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendMessage(String userFrom, String userTo, ChatMessage message) {
        kafkaTemplate.send("chat-topic", userTo, message);
    }
}