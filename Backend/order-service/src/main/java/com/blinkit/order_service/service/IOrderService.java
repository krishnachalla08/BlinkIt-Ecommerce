package com.blinkit.order_service.service;

import com.blinkit.order_service.dto.OrderResponse;

public interface IOrderService {
    OrderResponse checkout(Long userId,String token);
}
