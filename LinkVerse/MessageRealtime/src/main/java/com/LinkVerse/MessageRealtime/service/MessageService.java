package com.LinkVerse.MessageRealtime.service;

import com.LinkVerse.MessageRealtime.dto.response.ChatMessage;
import com.LinkVerse.MessageRealtime.dto.response.UserResponse;
import com.LinkVerse.MessageRealtime.entity.Message;
import com.LinkVerse.MessageRealtime.entity.MessageStatus;
import com.LinkVerse.MessageRealtime.repository.MessageRepository;
import com.LinkVerse.MessageRealtime.repository.UserRepository;
import com.LinkVerse.MessageRealtime.repository.httpclient.IdentityServiceClient;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final KafkaProducer kafkaProducer;
    private final IdentityServiceClient identityServiceClient;


    public ChatMessage saveMessage(ChatMessage chatMessage) {
        try {
            // Lấy tên người gửi từ SecurityContext
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String senderUsername = authentication.getName();

            // Kiểm tra người gửi và người nhận có tồn tại không
            var sender = userRepository.findByUsername(senderUsername).orElseThrow();
            var recipient = userRepository.findByUsername(chatMessage.getRecipientId()).orElseThrow();

            // Lưu tin nhắn vào DB
            Message message = Message.builder()
                    .sender(sender)
                    .recipient(recipient)
                    .content(chatMessage.getContent())
                    .timestamp(LocalDateTime.now())
                    .status(MessageStatus.SENT)
                    .messageType(chatMessage.getType())
                    .build();

            messageRepository.save(message);

            // Gửi tin nhắn qua Kafka
            kafkaProducer.sendMessage(senderUsername, chatMessage.getRecipientId(), chatMessage);

            chatMessage.setStatus(MessageStatus.SENT);
            return chatMessage;
        } catch (Exception e) {
            throw new RuntimeException("Error saving message", e);
        }
    }

    public Mono<UserResponse> getUserById(String userId) {
        return identityServiceClient.getUserById(userId);
    }
}