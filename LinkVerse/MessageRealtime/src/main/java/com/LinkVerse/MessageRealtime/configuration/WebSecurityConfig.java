package com.LinkVerse.MessageRealtime.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class WebSecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf((csrf) -> csrf.disable()) // Tắt CSRF qua cấu hình mới; không dùng csrf().disable() trực tiếp
                .authorizeHttpRequests((auth) -> auth
                        .requestMatchers("/ws/chat/**").permitAll() // Cho phép tất cả kết nối WebSocket
                        .anyRequest().authenticated() // Xác thực tất cả các request REST khác
                );
        return http.build();
    }
}