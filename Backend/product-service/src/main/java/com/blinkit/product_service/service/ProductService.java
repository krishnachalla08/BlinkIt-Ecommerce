package com.blinkit.product_service.service;

import com.blinkit.product_service.dto.ProductRequest;
import com.blinkit.product_service.dto.ProductResponse;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ProductService {
    List<ProductResponse> getAllProducts();

    ProductResponse getProductById(Long productId);

    ProductResponse createProduct(ProductRequest productRequest);

    List<ProductResponse> getProductsByCategory(Long categoryId);

    Page<ProductResponse> getAllProducts(int page,int size);

    Page<ProductResponse> searchProducts(String keyword,int page,int size);

    Page<ProductResponse> getProductsByCategory(Long categoryId,int page,int size);

    void reduceStock(Long productId, int quantity);
}
