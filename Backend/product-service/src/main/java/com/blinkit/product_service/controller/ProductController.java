package com.blinkit.product_service.controller;

import com.blinkit.product_service.Enums.ContentType;
import com.blinkit.product_service.S3Client.S3ImageService;
import com.blinkit.product_service.dto.ProductRequest;
import com.blinkit.product_service.dto.ProductResponse;
import com.blinkit.product_service.dto.S3UrlRequest;
import com.blinkit.product_service.exception.ErrorResponse;
import com.blinkit.product_service.service.ProductService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/products")
public class ProductController {
    private final ProductService productService;
    private final S3ImageService s3ImageService;

    public ProductController(ProductService productService, S3ImageService s3ImageService){
        this.productService = productService;
        this.s3ImageService = s3ImageService;
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


    @PostMapping("/s3/signed-url")
    private Object s3Url(@RequestBody S3UrlRequest s3UrlRequest, HttpServletResponse response) {
        try {
            if (s3UrlRequest.getContentType().equals(ContentType.IMAGE.toString())) {
                response.setStatus(200);
                return s3ImageService.getSignedS3Url(s3UrlRequest.getFileName());
            } else {
                response.setStatus(400);
                return new ErrorResponse(HttpStatus.BAD_REQUEST.value(), "Invalid Content Type", LocalDateTime.now());

            }
        }catch(Exception e){
            response.setStatus(500);
            return new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), HttpStatus.INTERNAL_SERVER_ERROR.toString(), LocalDateTime.now());
        }
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
