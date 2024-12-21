package com.LinkVerse.identity.repository.httpclient;

import com.LinkVerse.identity.configuration.AuthenticationRequestInterceptor;
import com.LinkVerse.identity.dto.request.GroupRequest;
import com.LinkVerse.identity.dto.response.GroupResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "post-service", url = "${app.services.identity}", configuration = {AuthenticationRequestInterceptor.class})
public interface GroupClient {
    @PostMapping("/groups")
    GroupResponse createGroup(@RequestBody GroupRequest request);
}