package com.LinkVerse.post.repository.client;

import com.LinkVerse.post.configuration.AuthenticationRequestInterceptor;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

@FeignClient(name = "profile-service", url = "http://localhost:8081", configuration = {AuthenticationRequestInterceptor.class})
public interface ProfileServiceClient {

    @PutMapping("/profile/{profileId}/image")
    void updateImage(@PathVariable("profileId") String profileId, @RequestParam("imageFile") MultipartFile imageFile);
}