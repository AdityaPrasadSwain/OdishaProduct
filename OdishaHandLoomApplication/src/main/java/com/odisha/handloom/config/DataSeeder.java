package com.odisha.handloom.config;

import com.odisha.handloom.entity.Category;
import com.odisha.handloom.repository.CategoryRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;

    public DataSeeder(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (categoryRepository.count() == 0) {
            List<String> defaultCategories = Arrays.asList(
                    "Sarees",
                    "Fabrics",
                    "Handicrafts",
                    "Home Decor",
                    "Apparel");

            for (String catName : defaultCategories) {
                Category category = new Category();
                category.setName(catName);
                category.setDescription("Authentic Odisha " + catName);
                categoryRepository.save(category);
            }
            System.out.println("✅ Default categories seeded successfully!");
        }
    }
}
