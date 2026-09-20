package com.odisha.handloom.service;

import com.odisha.handloom.entity.Category;
import com.odisha.handloom.entity.Product;
import com.odisha.handloom.repository.CategoryRepository;
import com.odisha.handloom.repository.ProductRepository;
import com.odisha.handloom.exception.ResourceInUseException;
import com.odisha.handloom.exception.ResourceNotFoundException;
import com.odisha.handloom.exception.DuplicateResourceException;
import com.odisha.handloom.payload.request.CategoryOrderDTO;
import com.odisha.handloom.payload.request.CategoryRequestDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.text.Normalizer;
import java.util.List;
import java.util.UUID;
import java.util.regex.Pattern;

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
        return categoryRepository.findByActiveTrueOrderByDisplayOrderAsc();
    }

    public Category getCategoryById(UUID id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "ID", id));
    }

    private String generateSlug(String name) {
        String slug = Normalizer.normalize(name.toLowerCase(), Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        slug = pattern.matcher(slug).replaceAll("");
        slug = slug.replaceAll("[^a-z0-9\\-]", "-");
        slug = slug.replaceAll("-+", "-");
        slug = slug.replaceAll("^-|-$", "");

        // Make slug unique if exists
        String originalSlug = slug;
        int counter = 1;
        while (categoryRepository.findBySlug(slug).isPresent()) {
            slug = originalSlug + "-" + counter;
            counter++;
        }
        return slug;
    }

    @Transactional
    public Category createCategory(CategoryRequestDTO request) {
        if (categoryRepository.existsByNameIgnoreCase(request.getName())) {
            throw new DuplicateResourceException("Category", "name", request.getName());
        }

        Category category = new Category();
        category.setName(request.getName());
        category.setSlug(generateSlug(request.getName()));
        category.setIconName(request.getIconName());
        category.setDescription(request.getDescription());
        category.setDisplayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0);
        category.setActive(request.getActive() != null ? request.getActive() : true);

        if (request.getParentCategoryId() != null) {
            Category parent = getCategoryById(request.getParentCategoryId());
            category.setParentCategory(parent);
        }

        return categoryRepository.save(category);
    }

    @Transactional
    public Category updateCategory(UUID id, CategoryRequestDTO request) {
        Category category = getCategoryById(id);

        if (!category.getName().equalsIgnoreCase(request.getName())) {
            if (categoryRepository.existsByNameIgnoreCase(request.getName())) {
                throw new DuplicateResourceException("Category", "name", request.getName());
            }
            category.setName(request.getName());
            category.setSlug(generateSlug(request.getName())); // Re-generate slug on name change
        }

        category.setIconName(request.getIconName());
        category.setDescription(request.getDescription());
        category.setDisplayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0);
        category.setActive(request.getActive() != null ? request.getActive() : true);

        if (request.getParentCategoryId() != null) {
            if (request.getParentCategoryId().equals(id)) {
                throw new IllegalArgumentException("Category cannot be its own parent");
            }
            Category parent = getCategoryById(request.getParentCategoryId());
            category.setParentCategory(parent);
        } else {
            category.setParentCategory(null);
        }

        return categoryRepository.save(category);
    }

    // Keep old method for backward compatibility with existing ApiHealthTest
    @Transactional
    public Category addCategory(String name, String description, MultipartFile image, boolean active)
            throws IOException {
        if (categoryRepository.existsByNameIgnoreCase(name)) {
            throw new IllegalArgumentException("Category with name " + name + " already exists");
        }

        String imageUrl = image != null && !image.isEmpty() ? cloudinaryService.uploadImage(image, "categories") : null;

        Category category = new Category();
        category.setName(name);
        category.setSlug(generateSlug(name));
        category.setDescription(description);
        category.setImageUrl(imageUrl);
        category.setActive(active);

        return categoryRepository.save(category);
    }

    @Transactional
    public void deleteCategory(UUID id) {
        Category category = getCategoryById(id);

        List<Product> products = productRepository.findByCategory_Id(id);
        long activeProducts = products.stream().filter(p -> p.getStatus().name().equals("ACTIVE")).count();

        if (activeProducts > 0) {
            throw new ResourceInUseException("Category", "It contains " + activeProducts + " active products.");
        }

        List<Category> subCategories = categoryRepository.findByParentCategory_Id(id);
        long activeSubCategories = subCategories.stream().filter(Category::isActive).count();

        if (activeSubCategories > 0) {
            throw new ResourceInUseException("Category", "It contains " + activeSubCategories + " active subcategories.");
        }

        // Soft delete
        category.setActive(false);
        categoryRepository.save(category);
    }

    @Transactional
    public void reorderCategories(List<CategoryOrderDTO> reorderRequests) {
        for (CategoryOrderDTO orderReq : reorderRequests) {
            Category cat = categoryRepository.findById(orderReq.getId()).orElse(null);
            if (cat != null) {
                cat.setDisplayOrder(orderReq.getDisplayOrder());
                categoryRepository.save(cat);
            }
        }
    }
}
