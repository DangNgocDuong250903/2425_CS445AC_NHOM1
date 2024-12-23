package com.LinkVerse.identity.repository.httpclient;

import com.LinkVerse.identity.configuration.AuthenticationRequestInterceptor;
import com.LinkVerse.identity.dto.request.ApiResponse;
import com.LinkVerse.identity.dto.request.ProfileCreationRequest;
import com.LinkVerse.identity.dto.response.UserProfileResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

// Connection to profile-service
@FeignClient(
        name = "profile-service",
        url = "${app.services.profile}",
        configuration = {AuthenticationRequestInterceptor.class})
public interface ProfileClient {
    @PostMapping(value = "/internal/users", produces = MediaType.APPLICATION_JSON_VALUE)
    ApiResponse<UserProfileResponse> createProfile(@RequestBody ProfileCreationRequest request);

    @DeleteMapping("/{userId}")
    ApiResponse<Void> deleteUserProfile(@PathVariable String userId);

    @DeleteMapping("/profile")
    ApiResponse<Void> deleteUserProfileByToken(@RequestHeader("Authorization") String token);

}