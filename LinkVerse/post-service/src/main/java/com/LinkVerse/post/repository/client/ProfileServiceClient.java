package com.LinkVerse.post.repository.client;


import com.LinkVerse.post.configuration.AuthenticationRequestInterceptor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.cloud.openfeign.FeignClient;

@FeignClient(name = "profile-service", url = "http://localhost:8081", configuration = {AuthenticationRequestInterceptor.class})
public interface ProfileServiceClient {

    @PutMapping("/profile/{profileId}/image")
    void updateImage(@PathVariable("profileId") String profileId, @RequestBody String image);
}



