package com.LinkVerse.MessageRealtime.service;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;

@Service
public class KafkaConsumer {

    private final SimpMessageSendingOperations messagingTemplate;

    public KafkaConsumer(SimpMessageSendingOperations messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @KafkaListener(topics = "chat-topic", groupId = "message-group")
    public void listen(String message, String recipient) {
        // Gửi tin nhắn tới client qua WebSocket /queue/private
        messagingTemplate.convertAndSendToUser(recipient, "/queue/private", message);
    }
}
