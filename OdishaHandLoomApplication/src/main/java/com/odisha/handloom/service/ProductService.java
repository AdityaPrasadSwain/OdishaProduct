package com.odisha.handloom.service;

import com.odisha.handloom.entity.Product;
import com.odisha.handloom.repository.ProductRepository;
import com.odisha.handloom.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    public Product getProductDetails(UUID id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Calculate ratings on the fly for detail view to ensure accuracy
        Double avgRating = reviewRepository.getAverageRatingByProductId(id);
        Long count = reviewRepository.getReviewCountByProductId(id);

        product.setAverageRating(avgRating != null ? avgRating : 0.0);
        product.setTotalReviews(count != null ? count.intValue() : 0);

        return product;
    }
}
