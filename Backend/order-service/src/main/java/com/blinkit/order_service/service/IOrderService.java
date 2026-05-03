package com.blinkit.order_service.service;

import com.blinkit.order_service.dto.OrderResponse;

import java.util.List;

public interface IOrderService {
    OrderResponse checkout(Long userId,String token);

    List<OrderResponse> getAllOrders(Long userId);
}
