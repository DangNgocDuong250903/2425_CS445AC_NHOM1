package com.LinkVerse.MessageRealtime.service;

import com.LinkVerse.MessageRealtime.entity.Message;
import com.LinkVerse.MessageRealtime.entity.User;
import com.LinkVerse.MessageRealtime.websocket.WebSocketChatEndpoint;
import jakarta.websocket.Session;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;

@RequiredArgsConstructor
@Service
public class WebSocketService {

    private final MessageService messageService;

    public void processMessage(String content, User sender, User recipient) throws IOException {
        // Lưu tin nhắn vào database
        Message message = messageService.sendMessage(sender, recipient, content);

        // Gửi real-time cho người nhận (nếu họ đang kết nối)
        Session recipientSession = WebSocketChatEndpoint.getSessionByUserId(recipient.getId());
        if (recipientSession != null && recipientSession.isOpen()) {
            recipientSession.getBasicRemote().sendText("New message from " + sender.getUsername() + ": " + content);
        }
    }
}