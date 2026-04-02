package com.blinkit.product_service.service;

import com.blinkit.product_service.dto.CategoryRequest;
import com.blinkit.product_service.dto.CategoryResponse;
import com.blinkit.product_service.exception.DuplicateResourceException;
import com.blinkit.product_service.exception.ResourceNotFoundException;
import com.blinkit.product_service.model.Category;
import com.blinkit.product_service.repository.CategoryRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    @Autowired
    private final CategoryRepository categoryRepository;
    public CategoryResponse createCategory(CategoryRequest categoryRequest){
        if(categoryRepository.existsByCategoryName(categoryRequest.getCategoryName())){
            throw new DuplicateResourceException("Category already exists");
        }

        Category category = new Category();
        category.setCategoryName(categoryRequest.getCategoryName());

        Category savedCategory = categoryRepository.save(category);

        return new CategoryResponse(savedCategory.getCategoryId(), savedCategory.getCategoryName());
    }

    public List<CategoryResponse> getAllCategories(){
        return categoryRepository.findAll()
                .stream()
                .map(category ->
                        new CategoryResponse(category.getCategoryId(), category.getCategoryName())).toList();
    }

    public CategoryResponse getCategoryById(Long categoryId){
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(()->new ResourceNotFoundException("category not Found"));

        return new CategoryResponse(category.getCategoryId(),category.getCategoryName());
    }

    @Transactional
    public void deleteCategory(Long categoryId){
        if(categoryRepository.existsById(categoryId)){
            categoryRepository.deleteById(categoryId);
        }else{
            throw new RuntimeException("category with Id "+categoryId+"is not available!");
        }

    }
}
