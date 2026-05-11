package com.blinkit.product_service.repository;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

import java.util.Map;

@Repository
public class CartRepository {

    private final RedisTemplate<String, Object> redisTemplate;
    private static final String CART_KEY_PREFIX = "cart:user:";

    public CartRepository(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public void addOrUpdate(String userId, Long productId, Integer quantity) {
        redisTemplate.opsForHash().put(CART_KEY_PREFIX + userId, productId.toString(), quantity);
    }

    public void removeItem(String userId, Long productId) {
        redisTemplate.opsForHash().delete(CART_KEY_PREFIX + userId, productId.toString());
    }

    public Map<Object, Object> getCart(String userId) {
        return redisTemplate.opsForHash().entries(CART_KEY_PREFIX + userId);
    }

    public void clearCart(String userId) {
        redisTemplate.delete(CART_KEY_PREFIX + userId);
    }
}