package com.LinkVerse.post.repository.httpclient;

import com.LinkVerse.identity.entity.Group;
import com.LinkVerse.post.configuration.AuthenticationRequestInterceptor;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

// Connection to identity-service
@FeignClient(name = "identity-service", url = "http://localhost:8080/identity", configuration = {AuthenticationRequestInterceptor.class})
public interface GroupClient {

    @GetMapping("/groups/{groupId}")
    Group getGroup(@PathVariable("groupId") String groupId);
}
