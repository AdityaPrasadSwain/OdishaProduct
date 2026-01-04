package com.odisha.handloom.logistics.service;

import com.odisha.handloom.entity.Shipment;
import com.odisha.handloom.enums.ShipmentStatus;
import com.odisha.handloom.logistics.entity.AgentEarning;
import com.odisha.handloom.logistics.entity.ShipmentFailure;
import com.odisha.handloom.logistics.entity.ShipmentPayment;
import com.odisha.handloom.logistics.repository.AgentEarningRepository;
import com.odisha.handloom.logistics.repository.ShipmentFailureRepository;
import com.odisha.handloom.logistics.repository.ShipmentPaymentRepository;
import com.odisha.handloom.repository.ShipmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import com.odisha.handloom.logistics.repository.DeliveryOtpRepository;
import com.odisha.handloom.logistics.repository.DeliveryProofRepository;
import com.odisha.handloom.service.CloudinaryService;
import com.odisha.handloom.finance.service.SettlementService;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
public class LogisticsServiceImpl implements LogisticsService {

    private final ShipmentRepository shipmentRepository;
    private final ShipmentPaymentRepository paymentRepository;
    private final AgentEarningRepository earningRepository;
    private final ShipmentFailureRepository failureRepository;
    private final com.odisha.handloom.repository.UserRepository userRepository;

    @Autowired
    private DeliveryOtpRepository deliveryOtpRepository;

    @Autowired
    private DeliveryProofRepository deliveryProofRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

    @Autowired
    private SettlementService settlementService;

    public LogisticsServiceImpl(ShipmentRepository shipmentRepository,
            ShipmentPaymentRepository paymentRepository,
            AgentEarningRepository earningRepository,
            ShipmentFailureRepository failureRepository,
            com.odisha.handloom.repository.UserRepository userRepository) {
        this.shipmentRepository = shipmentRepository;
        this.paymentRepository = paymentRepository;
        this.earningRepository = earningRepository;
        this.failureRepository = failureRepository;
        this.userRepository = userRepository;
    }

    @Override
    public String generatePaymentQr(UUID shipmentId, UUID agentId) {
        Shipment shipment = shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new RuntimeException("Shipment not found"));

        if (shipment.getAgent() == null || !shipment.getAgent().getId().equals(agentId)) {
            throw new RuntimeException("Unauthorized: Agent not assigned to this shipment");
        }

        // Mock UPI QR string - in production this would come from the seller's config
        // Using a generic placeholder for the seller VPA
        String amount = shipment.getOrder() != null ? String.valueOf(shipment.getOrder().getTotalAmount()) : "0";
        String sellerName = "OdishaHandloomSeller";
        String sellerVpa = "seller@upi";

        return String.format("upi://pay?pa=%s&pn=%s&am=%s&tn=Order-%s",
                sellerVpa, sellerName, amount, shipmentId);
    }

    @Override
    @Transactional
    public ShipmentPayment recordPaymentSuccess(UUID shipmentId, UUID agentId, String transactionRef) {
        Shipment shipment = shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new RuntimeException("Shipment not found"));

        ShipmentPayment payment = new ShipmentPayment();
        payment.setShipmentId(shipmentId);
        payment.setAgentId(agentId);
        payment.setAmount(shipment.getOrder().getTotalAmount());
        payment.setStatus(ShipmentPayment.PaymentStatus.SUCCESS);
        payment.setTransactionRef(transactionRef);

        return paymentRepository.save(payment);
    }

    @Override
    @Transactional
    public AgentEarning calculateAndRecordEarning(UUID shipmentId, UUID agentId, double distanceKm) {
        // Rate per km
        BigDecimal ratePerKm = BigDecimal.valueOf(20);
        BigDecimal amount = ratePerKm.multiply(BigDecimal.valueOf(distanceKm));

        AgentEarning earning = new AgentEarning();
        earning.setAgentId(agentId);
        earning.setShipmentId(shipmentId);
        earning.setDistanceKm(distanceKm);
        earning.setAmount(amount);
        earning.setStatus(AgentEarning.EarningStatus.PENDING);

        return earningRepository.save(earning);
    }

    @Override
    public List<AgentEarning> getAgentEarnings(UUID agentId) {
        return earningRepository.findByAgentId(agentId);
    }

    @Override
    @Transactional
    public void markDeliveryFailed(UUID shipmentId, UUID agentId, String reason) {
        Shipment shipment = shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new RuntimeException("Shipment not found"));

        if (shipment.getAgent() == null || !shipment.getAgent().getId().equals(agentId)) {
            throw new RuntimeException("Unauthorized");
        }

        // Log failure
        ShipmentFailure failure = new ShipmentFailure();
        failure.setShipmentId(shipmentId);
        failure.setAgentId(agentId);
        failure.setReason(reason);
        failureRepository.save(failure);

        // Update Shipment Status to DELIVERY_FAILED
        shipment.setStatus(ShipmentStatus.DELIVERY_FAILED);
        shipmentRepository.save(shipment);

        // Logic to initiate return could go here (e.g., set status to RTO_INITIATED
        // immediately or manual)
    }

    @Override
    @Transactional
    public Shipment getShipmentLocation(UUID shipmentId) {
        Shipment shipment = shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new RuntimeException("Shipment not found"));

        boolean updated = false;

        // Mock Geocoding if coordinates are missing
        if (shipment.getShippingLatitude() == null) {
            // Random simulation around Bhubaneswar (20.2961, 85.8245)
            // Deterministic offest based on ID to keep it consistent
            double offsetLat = (shipmentId.getLeastSignificantBits() % 100) / 10000.0;
            double offsetLng = (shipmentId.getMostSignificantBits() % 100) / 10000.0;

            shipment.setShippingLatitude(20.3261 + offsetLat);
            shipment.setShippingLongitude(85.8345 + offsetLng);
            updated = true;
        }

        if (shipment.getSellerLatitude() == null) {
            // Seller location (mocked slightly away)
            shipment.setSellerLatitude(20.2600);
            shipment.setSellerLongitude(85.8100);
            updated = true;
        }

        if (updated) {
            return shipmentRepository.save(shipment);
        }
        return shipment;
    }

    @Override
    @Transactional(readOnly = true)
    public List<com.odisha.handloom.logistics.dto.AgentOrderDTO> getAgentOrders(UUID agentId) {
        List<Shipment> shipments = shipmentRepository.findByAgentId(agentId);

        return shipments.stream().map(shipment -> {
            com.odisha.handloom.logistics.dto.AgentOrderDTO dto = new com.odisha.handloom.logistics.dto.AgentOrderDTO();
            dto.setShipmentId(shipment.getId());

            if (shipment.getOrder() != null) {
                dto.setOrderId(shipment.getOrder().getId());
                dto.setShippingAddress(shipment.getOrder().getShippingAddress());
                dto.setTotalAmount(shipment.getOrder().getTotalAmount());
                dto.setPaymentMode(shipment.getOrder().getPaymentMethod());
                dto.setCod("COD".equalsIgnoreCase(shipment.getOrder().getPaymentMethod()));

                if (shipment.getOrder().getUser() != null) {
                    dto.setCustomerName(shipment.getOrder().getUser().getFullName());
                    dto.setCustomerPhone(shipment.getOrder().getUser().getPhoneNumber());
                }
            }

            dto.setCustomerLat(shipment.getShippingLatitude());
            dto.setCustomerLng(shipment.getShippingLongitude());
            dto.setStatus(shipment.getStatus() != null ? shipment.getStatus().name() : "UNKNOWN");

            // Date
            dto.setCreatedDate(shipment.getCreatedAt());

            // Check if earning already exists
            java.util.Optional<AgentEarning> earningOpt = earningRepository.findByShipmentId(shipment.getId());
            if (earningOpt.isPresent()) {
                AgentEarning earning = earningOpt.get();
                dto.setEarningAmount(earning.getAmount());
                dto.setDistanceKm(earning.getDistanceKm());
            } else {
                dto.setEarningAmount(BigDecimal.ZERO);
                dto.setDistanceKm(0.0);
            }

            return dto;
        }).collect(java.util.stream.Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public com.odisha.handloom.logistics.dto.AgentSummaryDTO getAgentSummary(UUID agentId) {
        com.odisha.handloom.logistics.dto.AgentSummaryDTO summary = new com.odisha.handloom.logistics.dto.AgentSummaryDTO();

        summary.setTotalOrders(shipmentRepository.countByAgentId(agentId));
        summary.setCompletedOrders(shipmentRepository.countByAgentIdAndStatus(agentId, ShipmentStatus.DELIVERED));

        BigDecimal totalEarnings = earningRepository.sumAmountByAgentId(agentId);
        summary.setTotalEarnings(totalEarnings != null ? totalEarnings : BigDecimal.ZERO);

        java.time.LocalDateTime startOfDay = java.time.LocalDate.now().atStartOfDay();
        BigDecimal earningsToday = earningRepository.sumAmountByAgentIdSince(agentId, startOfDay);
        summary.setEarningsToday(earningsToday != null ? earningsToday : BigDecimal.ZERO);

        return summary;
    }

    @Override
    @Transactional
    public void assignAgent(UUID shipmentId, UUID agentId) {
        Shipment shipment = shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new RuntimeException("Shipment not found"));

        com.odisha.handloom.entity.User agent = userRepository.findById(agentId)
                .orElseThrow(() -> new RuntimeException("Agent not found"));

        // Optional: Verify role
        // if (!agent.getRole().getName().equals("DELIVERY_AGENT")) ...

        shipment.setAgent(agent);
        shipment.setStatus(ShipmentStatus.ASSIGNED);
        shipmentRepository.save(shipment);
    }

    @Override
    @Transactional
    public void dispatchShipment(UUID shipmentId) {
        Shipment shipment = shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new RuntimeException("Shipment not found"));

        if (shipment.getAgent() == null) {
            throw new RuntimeException("Cannot dispatch without assigned agent");
        }

        shipment.setStatus(ShipmentStatus.DISPATCHED);
        shipmentRepository.save(shipment);
    }

    @Override
    @Transactional
    public com.odisha.handloom.logistics.entity.DeliveryProof uploadProof(UUID shipmentId, UUID agentId,
            org.springframework.web.multipart.MultipartFile file) {
        Shipment shipment = shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new RuntimeException("Shipment not found"));

        if (shipment.getAgent() == null || !shipment.getAgent().getId().equals(agentId)) {
            throw new RuntimeException("Unauthorized: Agent not assigned");
        }

        // 1. Validate Barcode
        if (shipment.getBarcodeValue() != null && !shipment.isBarcodeVerified()) {
            throw new RuntimeException("Barcode not verified. Please scan package first.");
        }

        // 2. Validate OTP (Implicit: Status should be verified or we check OTP table)
        // STRICT CHECK: Ensure OTP was verified.
        // We can check if status is OUT_FOR_DELIVERY (OTP flow usually moves it to a
        // pre-delivered state or we rely on OTP logic)
        // Ideally, verifyOtp should have been called first.
        // Let's assume verifyOtp does NOT set DELIVERED yet, but sets a flag or we rely
        // on this upload to FINALIZE it.
        // Actually, previous flow said verifyOtp -> DELIVERED.
        // NEW REQUIREMENT: Delivery not complete until photo uploaded.
        // So verifyOtp should probably set status to a temporary state like
        // 'OTP_VERIFIED' or we just check if OTP record exists and is verified.

        // Let's check the OTP record for this shipment
        // 2. Validate OTP
        // We ensure OTP is verified before allowing upload
        com.odisha.handloom.logistics.entity.DeliveryOtp otp = deliveryOtpRepository
                .findByOrderId(shipment.getOrder().getId().toString())
                .orElseThrow(() -> new RuntimeException("OTP record not found"));

        if (!otp.isVerified()) {
            throw new RuntimeException("OTP not verified yet");
        }

        try {
            // Upload to Cloudinary
            String imageUrl = cloudinaryService.uploadImage(file, "delivery_proofs");

            // Save Proof
            com.odisha.handloom.logistics.entity.DeliveryProof proof = new com.odisha.handloom.logistics.entity.DeliveryProof();
            proof.setShipmentId(shipmentId);
            proof.setOrderId(shipment.getOrder().getId());
            proof.setAgentId(agentId);
            proof.setImageUrl(imageUrl);
            proof.setVerified(false); // Admin verification

            proof = deliveryProofRepository.save(proof);

            // COMPLETE DELIVERY
            shipment.setStatus(ShipmentStatus.DELIVERED);
            shipmentRepository.save(shipment);

            // CALCULATE AGENT EARNINGS
            // Mock distance or calculate real
            double distance = 5.0; // Default mock
            // If we had coordinates...
            // double dist = calculateDistance(shipment.getSellerLatitude(), ...,
            // shipment.getShippingLatitude(), ...);

            calculateAndRecordEarning(shipmentId, agentId, distance);

            // CREATE SELLER SETTLEMENT
            try {
                settlementService.createSettlement(shipment.getOrder());
            } catch (Exception e) {
                System.err.println("Failed to create settlement: " + e.getMessage());
                // Don't fail the delivery if settlement creation fails, but log it
            }

            return proof;

        } catch (java.io.IOException e) {
            throw new RuntimeException("Failed to upload image", e);
        }
    }

    @Override
    @Transactional
    public com.odisha.handloom.logistics.entity.DeliveryProof uploadProofByOrder(UUID orderId, UUID agentId,
            String remarks, org.springframework.web.multipart.MultipartFile file) {
        Shipment shipment = shipmentRepository.findByOrder_Id(orderId)
                .orElseThrow(() -> new RuntimeException("Shipment not found for Order ID: " + orderId));

        // Use the shipmentId to proceed with standard checks
        UUID shipmentId = shipment.getId();

        if (shipment.getAgent() == null || !shipment.getAgent().getId().equals(agentId)) {
            // Note: If agentId is passed as parameter but shipment has different agent,
            // error.
            // Some business logic might allow override or "Team" delivery, but strict check
            // for now.
            throw new RuntimeException("Unauthorized: Agent not assigned to this shipment");
        }

        // Validate Barcode (Optional based on workflow, but usually good)
        if (shipment.getBarcodeValue() != null && !shipment.isBarcodeVerified()) {
            throw new RuntimeException("Barcode not verified. Please scan package first.");
        }

        try {
            // Upload to Cloudinary
            String imageUrl = cloudinaryService.uploadImage(file, "delivery_proofs");

            // Save Proof
            com.odisha.handloom.logistics.entity.DeliveryProof proof = new com.odisha.handloom.logistics.entity.DeliveryProof();
            proof.setShipmentId(shipmentId);
            proof.setOrderId(orderId);
            proof.setAgentId(agentId);
            proof.setImageUrl(imageUrl);
            proof.setRemarks(remarks); // Set remarks
            proof.setVerified(false); // Admin verification required

            // Note: Logic for 'DELIVERED' status update might need to wait for Admin
            // Verification
            // OR happens immediately.
            // User Requirement #4: "Admin Approves -> Update status".
            // So here we probably DO NOT set shipment to DELIVERED yet?
            // "1. Delivery Agent Uploads ... Save DB record"
            // "4. Admin Approves ... Update status"
            // So we should NOT set DELIVERED here.
            // However, the existing 'uploadProof' DID set DELIVERED.
            // I will NOT set DELIVERED here to follow the new "Admin must approve" flow
            // strictly.
            // But shipment status might need to be 'delivered_proof_uploaded' or similar?
            // Or just leave it as DISPATCHED/OUT_FOR_DELIVERY?
            // Let's leave it as is, but maybe status 'DELIVERED' is premature if admin
            // needs to approve?
            // Requirement 4 says "Update status + timestamp" on Admin Approval.
            // So I will NOT set shipment.setStatus(DELIVERED) here.

            proof = deliveryProofRepository.save(proof);
            return proof;

        } catch (java.io.IOException e) {
            throw new RuntimeException("Failed to upload image", e);
        }
    }
}
