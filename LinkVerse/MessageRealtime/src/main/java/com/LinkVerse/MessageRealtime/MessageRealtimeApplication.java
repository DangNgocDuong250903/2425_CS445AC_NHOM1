package com.LinkVerse.MessageRealtime;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class MessageRealtimeApplication {

    public static void main(String[] args) {
        SpringApplication.run(MessageRealtimeApplication.class, args);
    }

}
