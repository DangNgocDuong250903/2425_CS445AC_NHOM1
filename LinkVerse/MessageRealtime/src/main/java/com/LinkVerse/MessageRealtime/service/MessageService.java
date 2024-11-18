package com.LinkVerse.MessageRealtime.service;

import com.LinkVerse.MessageRealtime.dto.response.ChatMessage;
import com.LinkVerse.MessageRealtime.entity.Message;
import com.LinkVerse.MessageRealtime.entity.MessageStatus;
import com.LinkVerse.MessageRealtime.exception.AppException;
import com.LinkVerse.MessageRealtime.exception.ErrorCode;
import com.LinkVerse.MessageRealtime.repository.MessageRepository;
import com.LinkVerse.MessageRealtime.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final AuthenticationService authenticationService; // Inject AuthenticationService

    public ChatMessage saveMessage(ChatMessage chatMessage) {
        try {
            // Lấy tên người gửi từ SecurityContext (thông qua Authentication)
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String senderUsername = authentication.getName();

            // Kiểm tra xem người gửi có tồn tại trong hệ thống không
            var sender = userRepository.findByUsername(senderUsername)
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
            var recipient = userRepository.findByUsername(chatMessage.getRecipient())
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

            // Lưu tin nhắn vào cơ sở dữ liệu
            Message message = Message.builder()
                    .sender(sender)
                    .recipient(recipient)
                    .content(chatMessage.getContent())
                    .timestamp(LocalDateTime.now())
                    .status(MessageStatus.SENT)
                    .messageType(chatMessage.getType())
                    .build();

            messageRepository.save(message);

            chatMessage.setStatus(MessageStatus.SENT);
            return chatMessage;
        } catch (AppException e) {
            log.error("Error saving message: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error saving message", e);
            throw new AppException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }
}