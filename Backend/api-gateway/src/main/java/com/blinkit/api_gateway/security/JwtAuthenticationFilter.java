package com.blinkit.api_gateway.security;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class JwtAuthenticationFilter implements GlobalFilter {
    private final JwtUtil jwtUtil;

    public JwtAuthenticationFilter(JwtUtil jwtUtil){
        this.jwtUtil = jwtUtil;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange serverWebExchange, GatewayFilterChain gatewayFilterChain){
        String path = serverWebExchange.getRequest().getURI().getPath();

        if(path.startsWith("/auth")){
            return gatewayFilterChain.filter(serverWebExchange);
        }

        String authHeader = serverWebExchange.getRequest()
                .getHeaders()
                .getFirst(HttpHeaders.AUTHORIZATION);

        if(authHeader==null || !authHeader.startsWith("Bearer ")){
            serverWebExchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return serverWebExchange.getResponse().setComplete();
        }

        String token = authHeader.substring(7);

        try{
            jwtUtil.validateToken(token);
            Long userId = jwtUtil.extractUserId(token);

            ServerWebExchange modifiedExchange = serverWebExchange.mutate()
                    .request(builder -> builder.header("X-User-Id",String.valueOf(userId))).build();
            return gatewayFilterChain.filter(modifiedExchange);
        }catch(Exception e){
            serverWebExchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return serverWebExchange.getResponse().setComplete();
        }
    }
}
