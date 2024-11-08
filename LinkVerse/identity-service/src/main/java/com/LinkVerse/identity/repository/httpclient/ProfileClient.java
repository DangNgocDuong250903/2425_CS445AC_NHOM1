package com.LinkVerse.identity.repository.httpclient;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.LinkVerse.identity.configuration.AuthenticationRequestInterceptor;
import com.LinkVerse.identity.dto.request.ApiResponse;
import com.LinkVerse.identity.dto.request.ProfileCreationRequest;
import com.LinkVerse.identity.dto.response.UserProfileResponse;

// Connection to profile-service
@FeignClient(
        name = "profile-service",
        url = "${app.services.profile}",
        configuration = {AuthenticationRequestInterceptor.class})
public interface ProfileClient {
    @PostMapping(value = "/internal/users", produces = MediaType.APPLICATION_JSON_VALUE)
    ApiResponse<UserProfileResponse> createProfile(@RequestBody ProfileCreationRequest request);
}
