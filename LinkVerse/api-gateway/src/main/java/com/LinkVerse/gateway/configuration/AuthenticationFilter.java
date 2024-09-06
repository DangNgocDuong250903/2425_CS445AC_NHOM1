package com.LinkVerse.gateway.configuration;

import com.LinkVerse.gateway.service.IdentityService;
import io.netty.handler.codec.http.HttpResponseStatus;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;
import reactor.netty.http.server.HttpServerResponse;

import java.util.List;

@Component
@Slf4j
public class AuthenticationFilter  implements GlobalFilter, Ordered {
    private final IdentityService identityService;

    public AuthenticationFilter(IdentityService identityService) {
        this.identityService = identityService;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        log.info("AuthenticationFilter executed..............!!!!!!!!");
        //Get token form request header
        List<String> authHeader = exchange.getRequest().getHeaders().get(HttpHeaders.AUTHORIZATION);
        if(CollectionUtils.isEmpty(authHeader)) //Chua token -> false
            return unauthenticated(exchange.getResponse()); //401

        String token = authHeader.getFirst().replace("Bearer", "");
        log.info("Token: {}", token);

        identityService.introspect(token);
        //verify token
        //identity service call to validate token

        return chain.filter(exchange);
    }

    @Override
    public int getOrder() {
        return -1;
    }
    Mono<Void> unauthenticated(ServerHttpResponse response) {
        String body ="unauthenticated";
        response.setStatusCode(HttpStatus.UNAUTHORIZED);
        return response.writeWith(Mono.just(response.bufferFactory().wrap(body.getBytes())));
    }
}
