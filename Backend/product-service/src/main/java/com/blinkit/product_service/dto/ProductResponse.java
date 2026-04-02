package com.blinkit.product_service.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductResponse {
    public Long productId;
    public String productName;
    public BigDecimal price;
    public Boolean available;
    public Integer quantity;
    public String imageUrl;
    public String categoryName;

}
