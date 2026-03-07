package com.blinkit.order_service.client;

import com.blinkit.order_service.dto.CartDto;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

@Component
public class CartClient {
    private final WebClient webClient;

    public CartClient(){
        this.webClient = WebClient.builder()
                .baseUrl("http://localhost:9000").build();
    }

    public CartDto getCart(Long userId,String token){

        return webClient.get()
                .uri("/cart")
                .header("X-User-Id",userId.toString())
                .header("Authorization", token)
                .retrieve().bodyToMono(CartDto.class)
                .block();
    }

    public void clearCart(Long userId,String token){
        webClient.delete()
                .uri("/cart/clear")
                .header("X-User-Id",userId.toString())
                .header("Authorization", token)
                .retrieve().bodyToMono(Void.class)
                .block();
    }
}
