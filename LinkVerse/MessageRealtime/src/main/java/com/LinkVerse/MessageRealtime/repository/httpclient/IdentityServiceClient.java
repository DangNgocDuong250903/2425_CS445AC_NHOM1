package com.LinkVerse.MessageRealtime.repository.httpclient;

import com.LinkVerse.MessageRealtime.dto.response.UserResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class IdentityServiceClient {
    private final WebClient webClient;

    public IdentityServiceClient(@Value("${identity.service.url}") String identityServiceUrl) {
        this.webClient = WebClient.builder()
                .baseUrl(identityServiceUrl)
                .build();
    }

    public Mono<UserResponse> getUserById(String userId) {
        return webClient.get()
                .uri("/users/{userId}", userId)
                .retrieve()
                .bodyToMono(UserResponse.class);
    }
}