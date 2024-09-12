package com.LinkVerse.identity.configuration;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import lombok.extern.slf4j.Slf4j;
import org.apache.catalina.util.StringUtil;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Slf4j
@Component
public class AuthenticationRequest implements RequestInterceptor {
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
