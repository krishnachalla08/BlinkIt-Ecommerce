package com.blinkit.product_service.controller;

import com.blinkit.product_service.dto.ProductRequest;
import com.blinkit.product_service.dto.ProductResponse;
import com.blinkit.product_service.service.ProductService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
public class ProductController {
    private final ProductService productService;

    public ProductController(ProductService productService){
        this.productService = productService;
    }

    @GetMapping
    public List<ProductResponse> getAllProduct(){
        return productService.getAllProducts();
    }

    @GetMapping("/{id}")
    public ProductResponse getProduct(@PathVariable Long productId){
        return productService.getProductById(productId);
    }

    @PostMapping
    public ProductResponse createProduct(@RequestBody ProductRequest productRequest){
        return productService.createProduct(productRequest);
    }

    @GetMapping("/category/{categoryId}")
    public List<ProductResponse> getByCategory(@PathVariable Long categoryId){
        return productService.getProductsByCategory(categoryId);
    }
}
