package com.LinkVerse.notification.service;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class ChatGptService {

    private static final String OPENAI_API_KEY = "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";
    private static final String OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

    //Key het han
    //stop
    public String getChatGptResponse(String prompt) {
        // Lấy thông tin người dùng hiện tại từ SecurityContext
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Kiểm tra xem người dùng có xác thực hay không (đã đăng nhập chưa)
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User is not authenticated. Please login to use ChatGPT.");
        }

        // Cấu hình RestTemplate
        RestTemplate restTemplate = new RestTemplate();

        // Cấu trúc body yêu cầu
        String body = "{\n" +
                "  \"model\": \"gpt-3.5-turbo\", \n" +  // Thay "gpt-4" thành "gpt-3.5-turbo"
                "  \"prompt\": \"" + prompt + "\",\n" +
                "  \"max_tokens\": 150,\n" +
                "  \"temperature\": 0.7\n" +
                "}";

        // Tạo header với API Key
        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");
        headers.set("Authorization", "Bearer " + OPENAI_API_KEY);

        // Tạo entity với body và headers
        HttpEntity<String> entity = new HttpEntity<>(body, headers);

        // Gửi yêu cầu POST đến OpenAI API
        ResponseEntity<String> response = restTemplate.exchange(
                OPENAI_API_URL, HttpMethod.POST, entity, String.class);

        // Trả về kết quả từ OpenAI API
        return response.getBody();
    }
}
