package com.blinkit.product_service.service;

import com.blinkit.product_service.dto.CartItemResponse;
import com.blinkit.product_service.dto.CartResponse;
import com.blinkit.product_service.dto.ProductResponse;
import com.blinkit.product_service.repository.CartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CartService implements ICartService{

    private final ProductService productService;
    private final CartRepository cartRepository;

    @Override
    public void addItem(String userId, Long productId, Integer quantity, String token) {
        productService.getProductById(productId);
        cartRepository.addOrUpdate(userId, productId, quantity);
    }

    @Override
    public void updateItem(String userId, Long productId, Integer quantity) {
        cartRepository.addOrUpdate(userId, productId, quantity);
    }

    @Override
    public void removeItem(String userId, Long productId) {
        cartRepository.removeItem(userId, productId);
    }

    @Override
    public CartResponse getCart(String userId, String token) {
        Map<Object,Object> cart = cartRepository.getCart(userId);

        List<CartItemResponse> items = cart.entrySet()
                .stream()
                .map(entry->{
                    Long productId = Long.valueOf(entry.getKey().toString());
                    Integer quantity = Integer.valueOf(entry.getValue().toString());
                    ProductResponse productResponse = productService.getProductById(productId);

                    BigDecimal totalPrice = productResponse.getPrice().multiply(BigDecimal.valueOf(quantity));

                    return CartItemResponse.builder().productId(productId).productName(productResponse.getProductName()).imageUrl(productResponse.getImageUrl()).quantity(quantity).price(productResponse.getPrice()).totalPrice(totalPrice).build();
                }).toList();
        BigDecimal cartTotal = items.stream().map(CartItemResponse::getTotalPrice).reduce(BigDecimal.ZERO,BigDecimal::add);
        return CartResponse.builder().userId(userId).items(items).cartTotal(cartTotal).build();
    }

    @Override
    public void clearCart(String userId){
        cartRepository.clearCart(userId);
    }
}