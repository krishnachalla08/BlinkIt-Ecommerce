package com.blinkit.order_service.controller;

import com.blinkit.order_service.dto.OrderResponse;
import com.blinkit.order_service.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @PostMapping("/checkout")
    public ResponseEntity<OrderResponse> checkout(@RequestHeader("X-User-Id") Long userId,@RequestHeader("Authorization") String token){
        return ResponseEntity.ok(orderService.checkout(userId,token));
    }
}
