package com.blinkit.product_service.service;

import com.blinkit.product_service.dto.ProductRequest;
import com.blinkit.product_service.dto.ProductResponse;
import com.blinkit.product_service.exception.ResourceNotFoundException;
import com.blinkit.product_service.model.Category;
import com.blinkit.product_service.model.Product;
import com.blinkit.product_service.repository.CategoryRepository;
import com.blinkit.product_service.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductService(ProductRepository productRepository,CategoryRepository categoryRepository){
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<ProductResponse> getAllProducts(){
        return productRepository.findByAvailableTrue()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    //method to map the data -> response
    private ProductResponse mapToResponse(Product product) {
        ProductResponse productResponse = new ProductResponse();
        productResponse.productId = product.getProductId();
        productResponse.productName = product.getProductName();
        productResponse.price = product.getPrice();
        productResponse.available = product.getAvailable();
        productResponse.categoryName = product.getCategory().getCategoryName();
        return productResponse;
    }

    public ProductResponse getProductById(Long productId){
        Product product = productRepository.findById(productId)
                .orElseThrow(()->new ResourceNotFoundException("Product not found"));
        return mapToResponse(product);
    }

    public ProductResponse createProduct(ProductRequest productRequest){
        Category category = categoryRepository.findById(productRequest.categoryId)
                .orElseThrow(()->new ResourceNotFoundException("Category not found"));

        Product product = new Product();
        product.setProductName(productRequest.productName);
        product.setDescription(productRequest.description);
        product.setPrice(productRequest.price);
        product.setQuantity(productRequest.quantity);
        product.setAvailable(productRequest.quantity>0);
        product.setCategory(category);

        return mapToResponse(productRepository.save(product));
    }

    public List<ProductResponse> getProductsByCategory(Long categoryId){
        return productRepository.findByCategory_CategoryId(categoryId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }
}
