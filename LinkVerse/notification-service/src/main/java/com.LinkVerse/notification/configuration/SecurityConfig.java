package com.LinkVerse.notification.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private static final String[] PUBLIC_ENDPOINTS = {
            "/email/send",
            "/email/send-forget-pass",
            "/email/reset-password",
            "/api/v1/notification/**",
            "/v3/.*"
    };

    private final CustomJwtDecoder customJwtDecoder;

    public SecurityConfig(CustomJwtDecoder customJwtDecoder) {
        this.customJwtDecoder = customJwtDecoder;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
                // Authorize requests
                .authorizeHttpRequests(requests -> requests
                        .requestMatchers(HttpMethod.POST, PUBLIC_ENDPOINTS).permitAll() // Public POST endpoints
                        .anyRequest().authenticated() // All other endpoints need authentication
                )
                // JWT resource server settings
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwtConfigurer -> jwtConfigurer
                                .decoder(customJwtDecoder)
                                .jwtAuthenticationConverter(jwtAuthenticationConverter())) // Map JWT claims
                        .authenticationEntryPoint(new JwtAuthenticationEntryPoint()) // Custom auth entry point
                )
                .csrf(AbstractHttpConfigurer::disable); // CSRF disabled for API-based stateless communication
        //.cors(cors -> cors.configurationSource(corsConfigurationSource())); // Disable CORS

        return httpSecurity.build();
    }

    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return webSecurity -> webSecurity
                .ignoring()
                .requestMatchers("/actuator/**", "/v3/**", "/swagger-ui*/**", "/webjars/**", "/swagger-ui*/*swagger-initializer.js", "/swagger-ui*/**");
    }

    @Bean
    JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter jwtGrantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        jwtGrantedAuthoritiesConverter.setAuthorityPrefix("");

        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(jwtGrantedAuthoritiesConverter);

        return jwtAuthenticationConverter;
    }
}