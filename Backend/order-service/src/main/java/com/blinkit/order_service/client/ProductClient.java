package com.blinkit.order_service.client;

import com.blinkit.order_service.dto.ProductDto;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

@Component
public class ProductClient {
    private final WebClient webClient;

    public ProductClient(){
        this.webClient = WebClient.builder()
                .baseUrl("http://localhost:9000").build();
    }

    public ProductDto getProduct(Long id,String token){
        return webClient.get()
                .uri("/products/"+id)
                .header("Authorization", token)
                .retrieve().bodyToMono(ProductDto.class).block();

    }

    public void reduceStock(Long productId,Integer quantity,String token){
        webClient.put()
                .uri("/products/reduce-stock/"+productId+"?quantity="+quantity)
                .header("Authorization", token)
                .retrieve().bodyToMono(Void.class)
                .block();
    }
}
