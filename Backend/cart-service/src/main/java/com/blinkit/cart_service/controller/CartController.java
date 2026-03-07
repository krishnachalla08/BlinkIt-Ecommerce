package com.blinkit.cart_service.controller;

import com.blinkit.cart_service.dto.AddToCartRequest;
import com.blinkit.cart_service.dto.CartResponse;
import com.blinkit.cart_service.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @PostMapping("/add")
    public void add(@RequestHeader("X-User-Id") String userId,@RequestHeader("Authorization") String token, @Valid @RequestBody AddToCartRequest request){
         cartService.addItem(userId, request.getProductId(), request.getQuantity(), token);
    }

    @PutMapping("/update")
    public void update(@RequestHeader("X-User-Id") String userId,@RequestBody AddToCartRequest request){
        cartService.updateItem(userId, request.getProductId(), request.getQuantity());
    }

    @DeleteMapping("/{productId}")
    public void remove(@RequestHeader("X-User-Id") String userId, @PathVariable Long productId){
        cartService.removeItem(userId,productId);
    }
    @GetMapping
    public CartResponse get(@RequestHeader("X-User-Id") String userId,@RequestHeader("Authorization") String token){

        return cartService.getCart(userId, token);
    }


    @DeleteMapping("/clear")
    public void clear(@RequestHeader("X-User-Id") String userid){
        cartService.clearCart(userid);
    }
}
