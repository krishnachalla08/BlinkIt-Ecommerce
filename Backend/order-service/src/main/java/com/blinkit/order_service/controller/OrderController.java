package com.blinkit.order_service.controller;

import com.blinkit.order_service.dto.OrderResponse;
import com.blinkit.order_service.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @PostMapping("/checkout")
    public ResponseEntity<OrderResponse> checkout(@RequestHeader("X-User-Id") Long userId,@RequestHeader("Authorization") String token){
        return ResponseEntity.ok(orderService.checkout(userId,token));
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getAllOrders(@RequestHeader("X-User-Id") Long userId){
        return ResponseEntity.ok(orderService.getAllOrders(userId));
    }
}
