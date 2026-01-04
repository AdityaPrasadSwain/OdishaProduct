package com.odisha.handloom.service;

import com.odisha.handloom.entity.Order;
import com.odisha.handloom.entity.PackingVideo;
import com.odisha.handloom.entity.User;
import com.odisha.handloom.repository.OrderRepository;
import com.odisha.handloom.repository.PackingVideoRepository;
import com.odisha.handloom.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
public class VideoService {

    @Autowired
    private CloudinaryService cloudinaryService;

    @Autowired
    private PackingVideoRepository packingVideoRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public String uploadPackingVideo(UUID orderId, MultipartFile file, String sellerEmail) throws IOException {
        // 1. Fetch Order
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderId));

        // 2. Validate Seller Ownership
        User seller = userRepository.findByEmail(sellerEmail)
                .orElseThrow(() -> new RuntimeException("Seller not found"));

        if (!order.getSeller().getId().equals(seller.getId())) {
            throw new RuntimeException("Unauthorized: You are not the seller of this order.");
        }

        // 3. Check if video already exists
        if (packingVideoRepository.findByOrderId(orderId).isPresent()) {
            throw new RuntimeException("A packing video already exists for this order.");
        }

        // 4. Upload to Cloudinary
        String videoUrl = cloudinaryService.uploadVideo(file);

        // 5. Save Metadata
        PackingVideo packingVideo = PackingVideo.builder()
                .orderId(orderId)
                .sellerId(seller.getId())
                .videoUrl(videoUrl)
                .build();

        packingVideoRepository.save(packingVideo);

        return videoUrl;
    }

    public String getPackingVideoUrlForCustomer(UUID orderId, String customerEmail) {
        // 1. Fetch Order
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderId));

        // 2. Validate Customer Ownership
        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        if (!order.getUser().getId().equals(customer.getId())) {
            throw new RuntimeException("Unauthorized: You did not place this order.");
        }

        // 3. Fetch Video
        PackingVideo video = packingVideoRepository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("No packing video uploaded for this order yet."));

        return video.getVideoUrl();
    }
}
