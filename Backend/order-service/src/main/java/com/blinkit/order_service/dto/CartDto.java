package com.blinkit.order_service.dto;

import lombok.Data;

import java.util.List;

@Data
public class CartDto {
    private Long userId;
    private List<CartItemDto> items;
}
