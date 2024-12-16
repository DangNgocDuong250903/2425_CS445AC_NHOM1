package com.LinkVerse.MessageRealtime.security;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

@Component
public class WebSocketInterceptor implements ChannelInterceptor {

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        Authentication authentication = (Authentication) message.getHeaders().get("simpUser");
        if (authentication != null) {
            Jwt jwt = (Jwt) authentication.getPrincipal();
            // Thêm logic xác thực token hoặc kiểm tra userId, v.v.
        }
        return message;
    }
}