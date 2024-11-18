package com.LinkVerse.MessageRealtime.controller;

import com.LinkVerse.MessageRealtime.dto.response.ChatMessage;
import com.LinkVerse.MessageRealtime.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ChatController {

    private final MessageService messageService;
    private final SimpMessageSendingOperations messageTemplate;

    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload ChatMessage message) {
        // Gửi tin nhắn thông qua MessageService
        messageService.saveMessage(message);
        messageTemplate.convertAndSend("/topic/public", message);
    }

    @MessageMapping("/chat.addUser")
    public void addUser(@Payload ChatMessage chatMessage) {
        // Gửi thông báo khi người dùng tham gia
        chatMessage.setContent(chatMessage.getSender() + " đã tham gia!");
        messageTemplate.convertAndSend("/topic/public", chatMessage);
    }

    @MessageMapping("/chat.privateMessage")
    public void sendPrivateMessage(@Payload ChatMessage chatMessage) {
        // Gửi tin nhắn riêng tư
        messageService.saveMessage(chatMessage);
        messageTemplate.convertAndSendToUser(chatMessage.getRecipient(), "/queue/private", chatMessage);
    }

}
