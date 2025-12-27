package com.odisha.handloom.service;

import com.odisha.handloom.entity.Category;
import com.odisha.handloom.entity.Product;
import com.odisha.handloom.repository.CategoryRepository;
import com.odisha.handloom.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public List<Category> getActiveCategories() {
        return categoryRepository.findByActiveTrue();
    }

    @Transactional
    public Category addCategory(String name, String description, MultipartFile image, boolean active)
            throws IOException {
        if (categoryRepository.findAll().stream().anyMatch(c -> c.getName().equalsIgnoreCase(name))) {
            throw new IllegalArgumentException("Category with name " + name + " already exists");
        }

        String imageUrl = cloudinaryService.uploadImage(image, "categories");

        Category category = new Category();
        category.setName(name);
        category.setDescription(description);
        category.setImageUrl(imageUrl);
        category.setActive(active);

        return categoryRepository.save(category);
    }

    @Transactional
    public void deleteCategory(UUID id) {
        List<Product> products = productRepository.findByCategory_Id(id);
        if (!products.isEmpty()) {
            throw new IllegalStateException("Cannot delete category. It contains " + products.size() + " products.");
        }
        categoryRepository.deleteById(id);
    }
}
