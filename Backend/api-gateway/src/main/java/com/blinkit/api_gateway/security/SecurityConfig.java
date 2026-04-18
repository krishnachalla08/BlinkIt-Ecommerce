package com.blinkit.api_gateway.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        return http
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .authorizeExchange(exchange -> exchange

                        // ✅ Public APIs
                        .pathMatchers("/auth/**").permitAll()
                        .pathMatchers("/products/**").permitAll()
                        .pathMatchers("/categories/**").permitAll()

                        // 🔒 Protected APIs
                        .pathMatchers("/cart/**").authenticated()
                        .pathMatchers("/orders/**").authenticated()

                        // 🔐 Everything else
                        .anyExchange().authenticated()
                )
                .build();
    }
}