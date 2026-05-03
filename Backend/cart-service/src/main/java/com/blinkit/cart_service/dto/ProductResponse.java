package com.blinkit.cart_service.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class ProductResponse {
    private Long productId;
    private String productName;
    private String imageUrl;
    private BigDecimal price;
}
