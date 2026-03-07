package com.blinkit.product_service.controller;

import com.blinkit.product_service.dto.ProductRequest;
import com.blinkit.product_service.dto.ProductResponse;
import com.blinkit.product_service.service.ProductService;
import org.springframework.data.domain.Page;
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

    @GetMapping("/{productId}")
    public ProductResponse getProduct(@PathVariable Long productId){
        return productService.getProductById(productId);
    }

    @PostMapping("/createProduct")
    public ProductResponse createProduct(@RequestBody ProductRequest productRequest){
        return productService.createProduct(productRequest);
    }

    @GetMapping("/category/{categoryId}")
    public List<ProductResponse> getByCategory(@PathVariable Long categoryId){
        return productService.getProductsByCategory(categoryId);
    }

    //Pagination and search implementation start
    @GetMapping("/paged")
    public Page<ProductResponse> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size){
        return productService.getAllProducts(page,size);
    }

    @GetMapping("/search")
    public Page<ProductResponse> searchProducts(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ){
        return productService.searchProducts(keyword,page,size);
    }

    @GetMapping("/category/{categoryId}/paged")
    public Page<ProductResponse> getProductsByCategory(
            @PathVariable Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ){
        return productService.getProductsByCategory(categoryId,page,size);
    }

    @PutMapping("/reduce-stock/{productId}")
    public void reduceStock(@PathVariable Long productId,@RequestParam int quantity){
        productService.reduceStock(productId,quantity);
    }
}
