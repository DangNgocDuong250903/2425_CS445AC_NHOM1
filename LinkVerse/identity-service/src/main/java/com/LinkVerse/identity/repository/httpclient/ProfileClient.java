package com.LinkVerse.identity.repository.httpclient;

import com.LinkVerse.identity.dto.request.ProfileCreationRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

//Connetion to profile-service
@FeignClient(name = "profile-service", url = "http://localhost:8081/profile")
public interface ProfileClient {
    @PostMapping(value = "/users", produces = MediaType.APPLICATION_JSON_VALUE)
    Object createProfile(@RequestBody ProfileCreationRequest request);

}
