package com.LinkVerse.notification.controller;

import com.LinkVerse.notification.dto.response.ChatMessage;
import com.LinkVerse.notification.service.ChatGptService;
import org.springframework.beans.factory.annotation.Autowired;  // Thêm import
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ChatController {

    // Sử dụng @Autowired để Spring tự động inject ChatGptService
    @Autowired
    private ChatGptService chatGptService;

    @PostMapping("/ask")
    public String askChatGpt(@RequestBody ChatMessage chatMessage) {
        String prompt = chatMessage.getMessage();
        return chatGptService.getChatGptResponse(prompt);
    }
}
