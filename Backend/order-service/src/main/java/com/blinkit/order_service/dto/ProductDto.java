package com.blinkit.order_service.dto;

import lombok.Data;

@Data
public class ProductDto {
    public Long productId;
    public String productName;
    public Double price;
    public Boolean available;
    public Long quantity;
    public String categoryName;
}
