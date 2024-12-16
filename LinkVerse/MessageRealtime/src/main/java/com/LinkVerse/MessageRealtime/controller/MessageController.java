package com.LinkVerse.MessageRealtime.controller;

import com.LinkVerse.MessageRealtime.entity.Message;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class MessageController {

    private final SimpMessagingTemplate messagingTemplate;

    public MessageController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    // Broadcast đến tất cả mọi người qua /topic/messages
    @MessageMapping("/send")  // Client gửi tin nhắn tới /app/send
    @SendTo("/topic/messages") // Broadcast đến mọi người qua /topic/messages
    public Message broadcastMessage(Message message) {
        return message; // Trả tin nhắn cho tất cả các clients
    }

    // Gửi tin nhắn đến một user cụ thể
    @MessageMapping("/private")
    public void sendDirectMessage(Message message) {
        String recipientId = message.getRecipient().getId();
        messagingTemplate.convertAndSendToUser(recipientId, "/queue/messages", message);
    }
}