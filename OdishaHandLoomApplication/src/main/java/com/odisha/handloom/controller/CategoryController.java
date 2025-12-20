package com.odisha.handloom.controller;

import com.odisha.handloom.entity.Category;
import com.odisha.handloom.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private com.odisha.handloom.repository.ProductRepository productRepository;

    @GetMapping
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Category> addCategory(@RequestBody Category category) {
        return ResponseEntity.ok(categoryRepository.save(category));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteCategory(@PathVariable java.util.UUID id) {
        List<com.odisha.handloom.entity.Product> products = productRepository.findByCategory_Id(id);
        if (!products.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body("Cannot delete category. It contains " + products.size() + " products.");
        }
        categoryRepository.deleteById(id);
        return ResponseEntity.ok("Category deleted");
    }
}
