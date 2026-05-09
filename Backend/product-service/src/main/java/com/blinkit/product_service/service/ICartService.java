package com.blinkit.product_service.service;

import com.blinkit.product_service.dto.CartResponse;

public interface ICartService {

    void addItem(String userId, Long productId,Integer quantity,String token);

    void updateItem(String userId,Long productId,Integer quantity);

    void removeItem(String userId,Long productId);

    CartResponse getCart(String userId,String token);

    void clearCart(String userId);
}