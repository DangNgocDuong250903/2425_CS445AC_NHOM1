package com.LinkVerse.MessageRealtime.controller;

import com.LinkVerse.MessageRealtime.dto.response.ChatMessage;
import com.LinkVerse.MessageRealtime.entity.Message;
import com.LinkVerse.MessageRealtime.entity.User;
import com.LinkVerse.MessageRealtime.repository.MessageRepository;
import com.LinkVerse.MessageRealtime.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;

@Controller
public class ChatController {

    @Autowired
    private KafkaTemplate<String, ChatMessage> kafkaTemplate;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    @MessageMapping("/chat.sendMessage")
//    @SendTo("/topic/public")
    @SendTo("/queue/private")
    public ChatMessage sendMessage(@Payload ChatMessage chatMessage) {
        User sender = userRepository.findById(chatMessage.getSender())
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        User recipient = chatMessage.getRecipientId() != null
                ? userRepository.findById(chatMessage.getRecipientId()).orElse(null)
                : null;

        Message message = Message.builder()
                .sender(sender)
                .recipient(recipient)
                .groupId(chatMessage.getGroupId())
                .content(chatMessage.getContent())
                .status(chatMessage.getStatus())
                .timestamp(LocalDateTime.now())
                .messageType(chatMessage.getType())
                .build();

        messageRepository.save(message);

        kafkaTemplate.send("chat_topic", chatMessage); // gửi message tới Kafka

        return chatMessage;
    }
}