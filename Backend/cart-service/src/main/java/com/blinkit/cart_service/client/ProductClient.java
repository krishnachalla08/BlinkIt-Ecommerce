package com.blinkit.cart_service.client;

import com.blinkit.cart_service.dto.ProductResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

@Component
public class ProductClient {

    private final WebClient webClient;

    public ProductClient(){
        this.webClient = WebClient.builder().baseUrl("http://localhost:9000").build();
    }

    public ProductResponse getProduct(Long productId, String token){

        return webClient
                .get()
                .uri( "/products/" + productId)
                .header("Authorization", token)
                .retrieve()
                .bodyToMono(ProductResponse.class)
                .block();

    }

}
