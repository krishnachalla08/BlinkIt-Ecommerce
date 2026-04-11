package com.blinkit.product_service.service;

import com.blinkit.product_service.dto.ProductRequest;
import com.blinkit.product_service.dto.ProductResponse;
import com.blinkit.product_service.exception.ResourceNotFoundException;
import com.blinkit.product_service.model.Category;
import com.blinkit.product_service.model.Product;
import com.blinkit.product_service.repository.CategoryRepository;
import com.blinkit.product_service.repository.ProductRepository;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductServiceImpl implements ProductService{

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductServiceImpl(ProductRepository productRepository,CategoryRepository categoryRepository){
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    public List<ProductResponse> getAllProducts(){
        return productRepository.findByAvailableTrue()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public ProductResponse getProductById(Long productId){
        Product product = productRepository.findById(productId)
                .orElseThrow(()->new ResourceNotFoundException("Product not found"));
        return mapToResponse(product);
    }

    @Override
    public ProductResponse createProduct(ProductRequest productRequest){
        Category category = categoryRepository.findById(productRequest.categoryId)
                .orElseThrow(()->new ResourceNotFoundException("Category not found"));

        Product product = new Product();
        product.setProductName(productRequest.productName);
        product.setDescription(productRequest.description);
        product.setPrice(productRequest.price);
        product.setQuantity(productRequest.quantity);
        product.setAvailable(productRequest.quantity>0);
        product.setImageUrl(productRequest.imageUrl);
        product.setCategory(category);

        return mapToResponse(productRepository.save(product));
    }

    @Override
    public List<ProductResponse> getProductsByCategory(Long categoryId){
        return productRepository.findByCategory_CategoryId(categoryId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public Page<ProductResponse> getAllProducts(int page,int size){
        Pageable pageable = PageRequest.of(page,size);
        return productRepository.findAll(pageable).map(this::mapToResponse);
    }

    @Override
    public Page<ProductResponse> searchProducts(String keyword,int page,int size){
        Pageable pageable = PageRequest.of(page,size);
        return productRepository.findByProductNameContainingIgnoreCase(keyword,pageable).map(this::mapToResponse);
    }

    @Override
    public Page<ProductResponse> getProductsByCategory(Long categoryId,int page,int size){
        Pageable pageable = PageRequest.of(page,size);
        return productRepository.findByCategory_CategoryId(categoryId,pageable).map(this::mapToResponse);
    }

    @Transactional
    @Override
    public void reduceStock(Long productId, int quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(()-> new RuntimeException("Product not fount"));

        if(product.getQuantity()<quantity){
            throw new RuntimeException("Insufficient stock");
        }

        product.setQuantity(product.getQuantity()-quantity);
        productRepository.save(product);
    }


    //method to map the data -> response

    private ProductResponse mapToResponse(Product product) {
        ProductResponse productResponse = new ProductResponse();
        productResponse.productId = product.getProductId();
        productResponse.productName = product.getProductName();
        productResponse.price = product.getPrice();
        productResponse.available = product.getAvailable();
        productResponse.quantity = product.getQuantity();
        productResponse.imageUrl = product.getImageUrl();
        productResponse.categoryName = product.getCategory().getCategoryName();
        return productResponse;
    }
}
