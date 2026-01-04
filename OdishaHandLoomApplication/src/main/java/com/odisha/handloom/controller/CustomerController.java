package com.odisha.handloom.controller;

import com.odisha.handloom.entity.*;
import com.odisha.handloom.payload.request.OrderRequest;
import com.odisha.handloom.payload.response.MessageResponse;
import com.odisha.handloom.payload.response.SellerProfileResponse;
import com.odisha.handloom.repository.OrderRepository;
import com.odisha.handloom.repository.ProductRepository;
import com.odisha.handloom.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

// IDE Refresh Trigger

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/customer")
public class CustomerController {

    @Autowired
    ProductRepository productRepository;

    @Autowired
    OrderRepository orderRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    com.odisha.handloom.service.OrderService orderService;

    @Autowired
    com.odisha.handloom.service.ProductService productService;

    @GetMapping("/products")
    public List<Product> getAllProducts(@RequestParam(required = false) String search) {
        System.out.println("[CustomerController] Request to fetch all public products");
        if (search != null && !search.isEmpty()) {
            System.out.println("[CustomerController] Searching for: " + search);
            return productRepository.findByNameContainingIgnoreCase(search);
        }
        // List<Product> products = productRepository.findByIsApprovedTrue();
        List<Product> products = productRepository.findAll();
        System.out.println("[CustomerController] Found " + products.size() + " products (ALL - Debug Mode)");
        return products;
    }

    @GetMapping("/products/category/{categoryId}")
    public List<Product> getProductsByCategory(@PathVariable UUID categoryId) {
        return productRepository.findByCategory_Id(categoryId);
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<?> getProductById(@PathVariable UUID id) {
        Product product = productService.getProductDetails(id);
        return ResponseEntity.ok(product);
    }

    @PostMapping("/orders")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest orderRequest) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User customer = userRepository.findByEmail(auth.getName()).orElseThrow();

        try {
            orderService.createOrder(customer, orderRequest.getItems(), orderRequest.getShippingAddress(),
                    orderRequest.getPaymentMethod(), orderRequest.getPaymentId(), orderRequest.getAddressId());
            return ResponseEntity.ok(new MessageResponse("Orders placed successfully!"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @Autowired
    com.odisha.handloom.repository.SellerFollowerRepository sellerFollowerRepository;

    @GetMapping("/sellers/{id}/profile")
    public ResponseEntity<?> getSellerProfile(@PathVariable UUID id) {
        User seller = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Seller not found"));

        if (seller.getRole() != Role.SELLER) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("User is not a seller. Actual Role: " + seller.getRole()));
        }

        // 1. Fetch Reels
        List<Product> reels = productRepository.findBySellerId(id).stream()
                .filter(p -> p.getReelUrl() != null && !p.getReelUrl().isEmpty())
                .collect(Collectors.toList());

        // 2. Counts
        long followersCount = sellerFollowerRepository.countBySeller(seller);
        long followingCount = 0;
        // Sellers don't usually follow others in this model, or we query SellerFollower
        // by User
        // For now, let's assume 'following' means who the seller follows (as a user)
        // followingCount = sellerFollowerRepository.countByUser(seller);

        long postsCount = reels.size();

        // 3. Auth Context (Is Current User Following?)
        boolean isFollowing = false;
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && !auth.getPrincipal().equals("anonymousUser")) {
                User currentUser = userRepository.findByEmail(auth.getName()).orElse(null);
                if (currentUser != null) {
                    isFollowing = sellerFollowerRepository.existsBySellerAndUser(seller, currentUser);
                }
            }
        } catch (Exception e) {
            // Ignore
        }

        // 4. Transform Reels to DTO
        List<SellerProfileResponse.ReelDTO> reelDTOs = reels.stream()
                .map(r -> {
                    SellerProfileResponse.ReelDTO dto = new SellerProfileResponse.ReelDTO();
                    dto.setProductId(r.getId());
                    dto.setVideoUrl(r.getReelUrl());
                    dto.setThumbnailUrl(r.getImages().isEmpty() ? null : r.getImages().get(0).getImageUrl());
                    dto.setTitle(r.getName());
                    return dto;
                })
                .collect(Collectors.toList());

        SellerProfileResponse response = new SellerProfileResponse();
        response.setSellerId(seller.getId());
        response.setShopName(seller.getShopName());
        response.setProfileImageUrl(seller.getProfilePictureUrl());
        response.setBio(seller.getBio());
        response.setPostsCount(postsCount);
        response.setFollowersCount(followersCount);
        response.setFollowingCount(followingCount);
        response.setFollowing(isFollowing);
        response.setReels(reelDTOs);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/orders")
    @PreAuthorize("hasRole('CUSTOMER')")
    public List<Order> getMyOrders() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User customer = userRepository.findByEmail(auth.getName()).orElseThrow();
        return orderRepository.findByUserId(customer.getId());
    }
}
