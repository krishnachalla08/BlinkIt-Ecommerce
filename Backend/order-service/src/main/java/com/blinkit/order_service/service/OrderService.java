package com.blinkit.order_service.service;

import com.blinkit.order_service.client.CartClient;
import com.blinkit.order_service.client.ProductClient;
import com.blinkit.order_service.dto.*;
import com.blinkit.order_service.entity.Order;
import com.blinkit.order_service.entity.OrderItem;
import com.blinkit.order_service.repository.OrderRepository;
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
    private final CartClient cartClient;
    private final ProductClient productClient;

    @Override
    @Transactional
    public OrderResponse checkout(Long userId,String token) {

        CartDto cart = cartClient.getCart(userId,token);
        if(cart==null || cart.getItems().isEmpty()){
            throw new RuntimeException("Cart is Empty");
        }

        double total = 0;
        List<OrderItem> orderItems = new ArrayList<>();

        for(CartItemDto item : cart.getItems()){
            ProductDto product = productClient.getProduct(item.getProductId(),token);

            System.out.println(product);
            if(product.getQuantity()<item.getQuantity()){
                throw new RuntimeException("Product out of stock");
            }

            total = total + (item.getQuantity() * product.getPrice());

            OrderItem orderItem = OrderItem.builder()
                    .productId(product.getProductId())
                    .productName(product.getProductName())
                    .quantity(item.getQuantity())
                    .price(product.getPrice()).build();
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

        for(CartItemDto item:  cart.getItems()){
            productClient.reduceStock(item.getProductId(),item.getQuantity(),token);
        }

        cartClient.clearCart(userId,token);
        return mapToOrderResponse(saved);
    }

    @Override
    public List<OrderResponse> getAllOrders(Long userId) {
        List<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(userId);

        return orders.stream().map(this::mapToOrderResponse).toList();
    }

    private OrderResponse mapToOrderResponse(Order order) {
        return OrderResponse.builder()
                .orderId(order.getId())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .createdAt(order.getCreatedAt())
                .orderItemList(order.getItems().stream().map(item ->
                        OrderItemResponse.builder()
                                .id(item.getId())
                                .productId(item.getProductId())
                                .productName(item.getProductName())
                                .quantity(item.getQuantity())
                                .price(item.getPrice())
                                .build()
                ).toList())
                .build();
    }
}
