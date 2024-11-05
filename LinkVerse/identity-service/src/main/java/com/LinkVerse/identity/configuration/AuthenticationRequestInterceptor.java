package com.LinkVerse.identity.configuration;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import lombok.extern.slf4j.Slf4j;
import org.springframework.util.StringUtils;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Slf4j
public class AuthenticationRequestinterceptor implements RequestInterceptor {
    @Override
    public void apply(RequestTemplate Template) {
        ServletRequestAttributes servletRequestAttributes  = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();

        var authHeader =  servletRequestAttributes.getRequest().getHeader("Authorization");
        log.info("Header: {} ", authHeader);

        if(StringUtils.hasText(authHeader)) {
                Template.header("Authorization", authHeader);
        }
    }
}
