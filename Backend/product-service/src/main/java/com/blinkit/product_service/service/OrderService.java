package com.blinkit.product_service.service;

import com.blinkit.product_service.dto.CartItemResponse;
import com.blinkit.product_service.dto.CartResponse;
import com.blinkit.product_service.dto.OrderItemResponse;
import com.blinkit.product_service.dto.OrderResponse;
import com.blinkit.product_service.dto.ProductResponse;
import com.blinkit.product_service.entity.Order;
import com.blinkit.product_service.entity.OrderItem;
import com.blinkit.product_service.repository.OrderRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService implements IOrderService{

    private final OrderRepository orderRepository;
    private final ICartService cartService;
    private final ProductService productService;

    @Override
    @Transactional
    public OrderResponse checkout(Long userId,String token) {

        CartResponse cart = cartService.getCart(String.valueOf(userId), token);
        if(cart==null || cart.getItems().isEmpty()){
            throw new IllegalArgumentException("Cart is empty");
        }

        double total = 0;
        List<OrderItem> orderItems = new ArrayList<>();

        for(CartItemResponse item : cart.getItems()){
            ProductResponse product = productService.getProductById(item.getProductId());

            if(product.getQuantity() < item.getQuantity()){
                throw new IllegalArgumentException("Product out of stock");
            }

            total = total + (item.getQuantity() * product.getPrice().doubleValue());

            OrderItem orderItem = OrderItem.builder()
                    .productId(product.getProductId())
                    .productName(product.getProductName())
                    .quantity(item.getQuantity())
                    .price(product.getPrice().doubleValue()).build();
            orderItems.add(orderItem);
        }
        LocalDateTime localDateTime = LocalDateTime.now();
        Order order = Order.builder()
                .userId(userId)
                .totalAmount(total)
                .status("CREATED")
                .createdAt(localDateTime)
                .build();

        orderItems.forEach(item->item.setOrder(order));
        order.setItems(orderItems);

        Order saved = orderRepository.save(order);

        for(CartItemResponse item:  cart.getItems()){
            productService.reduceStock(item.getProductId(),item.getQuantity());
        }

        cartService.clearCart(String.valueOf(userId));
        return mapToOrderResponse(saved);
    }

    @Override
    @Transactional
    public List<OrderResponse> getAllOrders(Long userId) {
        List<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(userId);

        return orders.stream().map(this::mapToOrderResponse).toList();
    }

    private OrderResponse mapToOrderResponse(Order order) {
        List<OrderItemResponse> itemResponses = new ArrayList<>();
        
        if (order.getItems() != null && !order.getItems().isEmpty()) {
            itemResponses = order.getItems().stream().map(item ->
                    OrderItemResponse.builder()
                            .id(item.getId())
                            .productId(item.getProductId())
                            .productName(item.getProductName())
                            .quantity(item.getQuantity())
                            .price(item.getPrice())
                            .build()
            ).toList();
        }

        return OrderResponse.builder()
                .orderId(order.getId())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .createdAt(order.getCreatedAt())
                .orderItemList(itemResponses)
                .build();
    }
}