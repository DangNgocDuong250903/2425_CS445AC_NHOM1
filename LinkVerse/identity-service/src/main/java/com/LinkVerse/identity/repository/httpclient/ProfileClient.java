package com.LinkVerse.identity.repository.httpclient;

import com.LinkVerse.identity.dto.request.ProfileCreationRequest;
import com.LinkVerse.identity.dto.response.UserProfileResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

//Connetion to profile-service
@FeignClient(name = "profile-service", url = "${app.services.profile}")
public interface ProfileClient {
    @PostMapping(value = "/internal/users", produces = MediaType.APPLICATION_JSON_VALUE)
    UserProfileResponse createProfile(
//            @RequestHeader("Authorization") String token,  //fix 401 ch nhan dc token
            @RequestBody ProfileCreationRequest request);

}
