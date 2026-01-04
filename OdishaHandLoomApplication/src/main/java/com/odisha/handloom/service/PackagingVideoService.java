package com.odisha.handloom.service;

import com.odisha.handloom.entity.Order;
import com.odisha.handloom.entity.OrderStatus;
import com.odisha.handloom.entity.PackagingVideo;
import com.odisha.handloom.repository.OrderRepository;
import com.odisha.handloom.repository.PackagingVideoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class PackagingVideoService {

    @Autowired
    private PackagingVideoRepository videoRepository;

    @Autowired
    private OrderRepository orderRepository;

    private final Path videoStorageLocation;

    public PackagingVideoService() {
        this.videoStorageLocation = Paths.get("videos").toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.videoStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded videos will be stored.", ex);
        }
    }

    @Transactional
    public PackagingVideo uploadVideo(UUID orderId, UUID sellerId, MultipartFile file) {
        // Validation
        if (file.isEmpty()) {
            throw new RuntimeException("Failed to upload empty file");
        }
        if (file.getSize() > 200 * 1024 * 1024) { // 200MB limit explicitly checked here too
            throw new RuntimeException("File size exceeds 200MB limit");
        }
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("video/")) {
            throw new RuntimeException("Only video files are allowed");
        }

        // Validate Order ownership
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getSeller().getId().equals(sellerId)) {
            throw new RuntimeException("Unauthorized: Seller does not own this order");
        }

        try {
            // Normalize file name
            String fileName = UUID.randomUUID().toString() + "_"
                    + file.getOriginalFilename().replaceAll("[^a-zA-Z0-9.-]", "_");
            Path targetLocation = this.videoStorageLocation.resolve(fileName);

            // Save file
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // Generate URL
            String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/videos/")
                    .path(fileName)
                    .toUriString();

            // Save to DB
            PackagingVideo video = videoRepository.findByOrderId(orderId)
                    .orElse(new PackagingVideo());

            video.setOrderId(orderId);
            video.setSellerId(sellerId);
            video.setVideoUrl(fileDownloadUri);

            // Check visibility logic: If order is ALREADY confirmed or beyond, make visible
            // immediately
            boolean isConfirmed = isOrderConfirmedOrLater(order.getStatus());
            video.setVisibleToCustomer(isConfirmed);

            return videoRepository.save(video);

        } catch (IOException ex) {
            throw new RuntimeException("Could not store video file. Please try again!", ex);
        }
    }

    @Transactional
    public void markVisible(UUID orderId) {
        videoRepository.findByOrderId(orderId).ifPresent(video -> {
            video.setVisibleToCustomer(true);
            videoRepository.save(video);
        });
    }

    public PackagingVideo getVideoForCustomer(UUID orderId, UUID customerId) {
        PackagingVideo video = videoRepository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("No packaging video found for this order"));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getUser().getId().equals(customerId)) {
            throw new RuntimeException("Unauthorized: You do not own this order");
        }

        if (!Boolean.TRUE.equals(video.getVisibleToCustomer())) {
            // Second check: maybe status updated but event missed?
            if (isOrderConfirmedOrLater(order.getStatus())) {
                video.setVisibleToCustomer(true);
                videoRepository.save(video);
                return video;
            }
            throw new RuntimeException("Video is not yet visible. Wait for order confirmation.");
        }

        return video;
    }

    private boolean isOrderConfirmedOrLater(OrderStatus status) {
        return status == OrderStatus.CONFIRMED ||
                status == OrderStatus.SELLER_CONFIRMED ||
                status == OrderStatus.PACKED ||
                status == OrderStatus.SHIPPED ||
                status == OrderStatus.DISPATCHED ||
                status == OrderStatus.OUT_FOR_DELIVERY ||
                status == OrderStatus.DELIVERED ||
                status == OrderStatus.INVOICE_SENT;
    }
}
