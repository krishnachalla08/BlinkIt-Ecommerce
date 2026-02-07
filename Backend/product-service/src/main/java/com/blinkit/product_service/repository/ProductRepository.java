package com.blinkit.product_service.repository;

import com.blinkit.product_service.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product,Long> {
    List<Product> findByAvailableTrue();
    List<Product> findByCategory_CategoryId(Long categoryId);
    //Pagination and search implementation start

    Page<Product> findByProductNameContainingIgnoreCase(String keyword,Pageable pageable);
    Page<Product> findByCategory_CategoryId(Long categoryId,Pageable pageable);
}
