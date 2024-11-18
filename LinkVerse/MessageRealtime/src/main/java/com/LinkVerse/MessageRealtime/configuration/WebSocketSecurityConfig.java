package com.LinkVerse.MessageRealtime.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
@EnableWebSecurity
public class WebSocketSecurityConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Register the /ws endpoint with SockJS for fallback options
        registry.addEndpoint("/ws")
                .setAllowedOrigins("http://localhost:8888") // Allow connections from specific origin
                .withSockJS(); // Enable SockJS as a fallback mechanism
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // Enable a simple broker with topic and queue prefixes
        registry.enableSimpleBroker("/topic", "/queue");
        // Set the application destination prefix for handling messages
        registry.setApplicationDestinationPrefixes("/app");
    }

    // Configure HTTP security for WebSocket (if you need authentication)
    public void configure(HttpSecurity http) throws Exception {
        // Disable CSRF for WebSocket connections (Spring 6.x method)
        http.csrf(csrf -> csrf.ignoringRequestMatchers("/ws/**")); // Disable CSRF for WebSocket endpoint

        // Configure URL-based security
        http.authorizeRequests()
                .requestMatchers("/ws/**").permitAll()  // Allow WebSocket connections without authentication
                .anyRequest().authenticated(); // Secure other endpoints, if any
    }
}