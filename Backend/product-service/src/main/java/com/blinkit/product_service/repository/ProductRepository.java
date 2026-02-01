package com.blinkit.product_service.repository;

import com.blinkit.product_service.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product,Long> {
    List<Product> findByAvailableTrue();
    List<Product> findByCategory_CategoryId(Long categoryId);
}
