package com.blinkit.product_service.dto;

import java.math.BigDecimal;

public class ProductRequest {
    public String productName;
    public String description;
    public BigDecimal price;
    public Integer quantity;
    public Long categoryId;
}
