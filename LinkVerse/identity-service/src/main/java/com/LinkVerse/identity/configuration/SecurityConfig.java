package com.LinkVerse.identity.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    // List of public endpoints
    private static final String[] PUBLIC_ENDPOINTS = {
            "/users/registration", "/auth/token", "/auth/introspect", "/auth/logout", "/auth/refresh",
            "/internal/users", "/internal/users/**", "/profile/users"
    };

    private final CustomJwtDecoder customJwtDecoder;

    // Constructor-based dependency injection
    public SecurityConfig(CustomJwtDecoder customJwtDecoder) {
        this.customJwtDecoder = customJwtDecoder;
    }

    // Security filter chain
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
                .csrf(AbstractHttpConfigurer::disable) // CSRF disabled for API-based stateless communication
                .cors(cors -> cors.configurationSource(corsConfigurationSource())); // Enable and configure CORS

        return httpSecurity.build();
    }

    // CORS configuration
    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.setAllowedOrigins(List.of("http://localhost:5173", "http://localhost:8888", "http://localhost8080")); // Allow specific origins
        corsConfiguration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")); // Allowed methods
        corsConfiguration.setAllowedHeaders(List.of("*")); // Allow all headers
        corsConfiguration.setAllowCredentials(true); // Allow credentials such as cookies or Authorization header
        corsConfiguration.setMaxAge(3600L); // Cache preflight response for 1 hour

        // Register configuration for all paths
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfiguration);
        return source;
    }

    // JWT authentication converter to map custom claims
    @Bean
    JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter jwtGrantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        jwtGrantedAuthoritiesConverter.setAuthorityPrefix(""); // Remove 'ROLE_' prefix from authorities

        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(jwtGrantedAuthoritiesConverter);
        jwtAuthenticationConverter.setPrincipalClaimName("userId"); // Map "userId" as the principal claim
        return jwtAuthenticationConverter;
    }

    // Password encoder for secure password storage
    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10); // Use bcrypt with strength 10
    }
}