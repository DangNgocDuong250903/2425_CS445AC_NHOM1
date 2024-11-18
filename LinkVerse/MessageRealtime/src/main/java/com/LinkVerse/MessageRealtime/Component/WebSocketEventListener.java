package com.LinkVerse.MessageRealtime.Component;

import com.LinkVerse.MessageRealtime.dto.response.ChatMessage;
import com.LinkVerse.MessageRealtime.entity.MessageStatus;
import com.LinkVerse.MessageRealtime.entity.MessageType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketEventListener {
    private final SimpMessageSendingOperations messageTemplate;

    @EventListener
    public void handleWebSocketConnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headersAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String username = (String) headersAccessor.getSessionAttributes().get("username");
        if (username != null) {
            log.info("User Disconnected : " + username);
            var chatMessage = ChatMessage.builder()
                    .type(MessageType.LEAVE)
                    .status(MessageStatus.DELIVERED)
                    .sender(username)
                    .build();
            messageTemplate.convertAndSend("/topic/public", chatMessage);
        }
    }

}