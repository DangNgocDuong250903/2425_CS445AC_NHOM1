package com.LinkVerse.MessageRealtime.repository.httpclient;

import com.LinkVerse.MessageRealtime.configuration.AuthenticationRequestInterceptor;
import com.LinkVerse.MessageRealtime.dto.ApiResponse;
import com.LinkVerse.MessageRealtime.dto.response.UserResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(
        name = "identity-service",
        url = "${app.services.profile}",
        configuration = {AuthenticationRequestInterceptor.class})
public interface IdentityServiceClient {
    @GetMapping(value = "/users/{userId}", produces = MediaType.APPLICATION_JSON_VALUE)
    ApiResponse<UserResponse> getUser(@PathVariable("userId") String userId);
}