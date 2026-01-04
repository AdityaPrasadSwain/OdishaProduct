package com.odisha.handloom.logistics.service;

import com.odisha.handloom.entity.Shipment;
// import com.odisha.handloom.enums.ShipmentStatus;
// import com.odisha.handloom.logistics.entity.AgentEarning;
import com.odisha.handloom.logistics.entity.DeliveryOtp;
import com.odisha.handloom.logistics.repository.DeliveryOtpRepository;
import com.odisha.handloom.repository.ShipmentRepository; // Main repo
import com.odisha.handloom.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder; // Assuming available
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

// import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;

@Service
public class DeliveryAgentService {

    @Autowired
    private ShipmentRepository shipmentRepository;

    @Autowired
    private DeliveryOtpRepository deliveryOtpRepository;

    // @Autowired
    // private AgentEarningRepository agentEarningRepository;

    @Autowired
    private EmailService emailService;

    // Use a local encoder if bean not readily available to avoid circular
    // dependencies in large projects
    // or inject if you are sure. For safety in this context I'll inject.
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Autowired
    private com.odisha.handloom.repository.ShipmentBarcodeRepository shipmentBarcodeRepository; // Autowired new repo

    @Transactional
    public Shipment verifyBarcode(UUID shipmentId, String scannedBarcode, UUID agentId) {
        System.out.println("Verifying barcode for Shipment: " + shipmentId);

        // 1. Validate Inputs
        if (shipmentId == null || scannedBarcode == null) {
            throw new IllegalArgumentException("Input validation failed: ShipmentId or ScannedCode is null");
        }

        Shipment shipment = shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new RuntimeException("Shipment not found"));

        if (!shipment.getAgent().getId().equals(agentId)) {
            throw new RuntimeException("Unauthorized: Agent not assigned to this shipment");
        }

        // 2. Fetch Barcode Record
        com.odisha.handloom.entity.ShipmentBarcode record = shipmentBarcodeRepository.findByShipmentId(shipmentId)
                .orElseThrow(() -> new RuntimeException("Shipment barcode not found. Please regenerate label."));

        // 3. Compare (Robust Check)
        String cleanScanned = scannedBarcode.trim();
        boolean matchFull = record.getBarcodeValue().equalsIgnoreCase(cleanScanned);
        boolean matchTrack = record.getTrackingId().equalsIgnoreCase(cleanScanned);

        if (!matchFull && !matchTrack) {
            System.out.println("❌ Mismatch! Expected: " + record.getBarcodeValue() + " or " + record.getTrackingId()
                    + ", Got: " + cleanScanned);
            throw new RuntimeException("Invalid barcode — scan again.");
        }

        // 4. Success Update
        shipment.setBarcodeVerified(true);
        if (shipment.getStatus() == com.odisha.handloom.enums.ShipmentStatus.DISPATCHED ||
                shipment.getStatus() == com.odisha.handloom.enums.ShipmentStatus.ASSIGNED) {
            shipment.setStatus(com.odisha.handloom.enums.ShipmentStatus.OUT_FOR_DELIVERY);
        }
        return shipmentRepository.save(shipment);
    }

    @Transactional
    public void sendDeliveryOtp(UUID shipmentId, UUID agentId) {
        Shipment shipment = shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new RuntimeException("Shipment not found"));

        if (!shipment.getAgent().getId().equals(agentId)) {
            throw new RuntimeException("Unauthorized agent");
        }

        if (!shipment.isBarcodeVerified()) {
            throw new RuntimeException("Barcode validation required before delivery");
        }

        // Generate OTP
        String otp = String.format("%06d", new Random().nextInt(999999));
        System.out.println("DEBUG OTP for Shipment " + shipmentId + ": " + otp);

        // Save
        DeliveryOtp deliveryOtp = new DeliveryOtp();
        deliveryOtp.setOrderId(shipment.getOrder().getId().toString()); // Storing Order ID string
        deliveryOtp.setCustomerEmail(shipment.getOrder().getUser().getEmail()); // Assuming traverse
        deliveryOtp.setOtpCode(passwordEncoder.encode(otp));
        deliveryOtp.setExpiryTime(LocalDateTime.now().plusMinutes(10));
        deliveryOtp.setVerified(false);
        deliveryOtpRepository.save(deliveryOtp);

        // Send Email
        emailService.sendOtpEmail(deliveryOtp.getCustomerEmail(), otp);
    }

    @Transactional
    public void verifyDeliveryOtp(UUID shipmentId, String otpInput, UUID agentId) {
        Shipment shipment = shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new RuntimeException("Shipment not found"));

        if (!shipment.getAgent().getId().equals(agentId)) {
            throw new RuntimeException("Unauthorized agent");
        }

        DeliveryOtp deliveryOtp = deliveryOtpRepository.findByOrderId(shipment.getOrder().getId().toString())
                .orElseThrow(() -> new RuntimeException("No OTP requested for this order"));

        if (deliveryOtp.isVerified()) {
            throw new RuntimeException("OTP already verified");
        }

        if (LocalDateTime.now().isAfter(deliveryOtp.getExpiryTime())) {
            throw new RuntimeException("OTP Expired");
        }

        if (!passwordEncoder.matches(otpInput, deliveryOtp.getOtpCode())) {
            throw new RuntimeException("Invalid OTP");
        }

        // Success
        deliveryOtp.setVerified(true);
        deliveryOtpRepository.save(deliveryOtp);

        // DO NOT mark as DELIVERED yet. Wait for Proof Upload.
        // shipment.setStatus(ShipmentStatus.DELIVERED);
        // shipmentRepository.save(shipment);

        // Calculate Earnings -> Moved to uploadProof
        // calculateAndCreditEarnings(shipment, agentId);
    }

    // Earnings logic moved to LogisticsServiceImpl.uploadProof
    // Private helper methods removed.
}
