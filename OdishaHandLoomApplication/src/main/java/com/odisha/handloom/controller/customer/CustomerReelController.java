package com.odisha.handloom.controller.customer;

import com.odisha.handloom.dto.ReelDto;
import com.odisha.handloom.entity.Product;
import com.odisha.handloom.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/customer/reels")
@RequiredArgsConstructor
public class CustomerReelController {

    private final ProductRepository productRepository;
    private final com.odisha.handloom.repository.ReelLikeRepository reelLikeRepository;
    private final com.odisha.handloom.repository.ReelCommentRepository reelCommentRepository;

    @GetMapping
    public ResponseEntity<List<ReelDto>> getReels(@RequestParam(required = false) UUID productId) {
        if (productId != null) {
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            if (product.getReelUrl() == null || product.getReelUrl().isEmpty()) {
                return ResponseEntity.ok(Collections.emptyList());
            }

            ReelDto reel = mapToReelDto(product);
            return ResponseEntity.ok(Collections.singletonList(reel));
        } else {
            // Fetch all products with reels
            List<Product> allProducts = productRepository.findAll();
            List<ReelDto> reels = allProducts.stream()
                    .filter(p -> p.getReelUrl() != null && !p.getReelUrl().isEmpty())
                    .map(this::mapToReelDto)
                    .collect(java.util.stream.Collectors.toList());
            Collections.shuffle(reels); // Randomize feed
            return ResponseEntity.ok(reels);
        }
    }

    private ReelDto mapToReelDto(Product product) {
        String videoUrl = product.getReelUrl();
        String thumbnailUrl = videoUrl;
        if (videoUrl != null && videoUrl.contains("/upload/")) {
            thumbnailUrl = videoUrl.replace("/upload/", "/upload/so_auto,w_450,q_auto,f_jpg/");
            if (thumbnailUrl.endsWith(".mp4")) {
                thumbnailUrl = thumbnailUrl.substring(0, thumbnailUrl.lastIndexOf(".")) + ".jpg";
            }
        }

        return ReelDto.builder()
                .id(UUID.randomUUID().toString())
                .videoUrl(videoUrl)
                .thumbnailUrl(thumbnailUrl)
                .productId(product.getId())
                .productName(product.getName())
                .price(product.getPrice())
                .caption(product.getReelCaption())
                .sellerId(product.getSeller().getId())
                .sellerName(product.getSeller().getShopName() != null ? product.getSeller().getShopName()
                        : product.getSeller().getFullName())
                .likes(reelLikeRepository.countByReel(product))
                .comments(reelCommentRepository.countByReel(product))
                .build();
    }
}
