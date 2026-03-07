package com.blinkit.cart_service.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

import java.util.Map;

@Repository
@RequiredArgsConstructor
public class CartRepository {
    private final RedisTemplate<String,Object> redisTemplate;

    private String key(String userId){
        return "cart:user:"+userId;
    }
    public Map<Object,Object> getCart(String userId){
        return redisTemplate.opsForHash().entries(key(userId));
    }

    public void addOrUpdate(String userId,Long productId,Integer quantity){
        redisTemplate.opsForHash().put(key(userId),productId.toString(),quantity);
    }

    public void removeItem(String userId,Long productId){
        redisTemplate.opsForHash().delete(key(userId),productId.toString());
    }

    public void clearCart(String userId){
        redisTemplate.delete(key(userId));
    }
}
