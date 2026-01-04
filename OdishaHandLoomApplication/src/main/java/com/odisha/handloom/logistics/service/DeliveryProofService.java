package com.odisha.handloom.logistics.service;

import com.odisha.handloom.entity.Shipment;
import com.odisha.handloom.logistics.entity.DeliveryProof;
import com.odisha.handloom.logistics.repository.DeliveryProofRepository;
import com.odisha.handloom.repository.ShipmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class DeliveryProofService {

    @Autowired
    private DeliveryProofRepository proofRepository;

    @Autowired
    private ShipmentRepository shipmentRepository;

    private final Path fileStorageLocation;

    public DeliveryProofService() {
        this.fileStorageLocation = Paths.get("uploads").toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    public DeliveryProof uploadProof(UUID orderId, UUID agentId, MultipartFile file) {
        // Validation
        if (file.isEmpty()) {
            throw new RuntimeException("Failed to upload empty file");
        }
        if (file.getSize() > 10 * 1024 * 1024) {
            throw new RuntimeException("File size exceeds 10MB limit");
        }
        if (!file.getContentType().startsWith("image/")) {
            throw new RuntimeException("Only image files are allowed");
        }

        try {
            // Normalize file name
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path targetLocation = this.fileStorageLocation.resolve(fileName);

            // Save file
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // Generate URL
            String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/uploads/")
                    .path(fileName)
                    .toUriString();

            // Find Shipment to ensure consistency
            Shipment shipment = shipmentRepository.findByOrder_Id(orderId)
                    .orElseThrow(() -> new RuntimeException("Shipment not found for order ID: " + orderId));

            // Save to DB
            DeliveryProof proof = proofRepository.findByShipmentId(shipment.getId())
                    .orElse(new DeliveryProof());

            proof.setOrderId(orderId);
            proof.setAgentId(agentId);
            proof.setShipmentId(shipment.getId());
            proof.setImageUrl(fileDownloadUri);
            proof.setVerified(false);

            return proofRepository.save(proof);

        } catch (IOException ex) {
            throw new RuntimeException("Could not store file. Please try again!", ex);
        }
    }
}
