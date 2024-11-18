package com.LinkVerse.MessageRealtime;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;

@SpringBootApplication
@EnableFeignClients
@EnableWebSocketMessageBroker
public class MessageRealtimeApplication {

    public static void main(String[] args) {
        SpringApplication.run(MessageRealtimeApplication.class, args);
    }

}
