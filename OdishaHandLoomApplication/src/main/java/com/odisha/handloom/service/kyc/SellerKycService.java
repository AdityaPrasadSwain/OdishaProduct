package com.odisha.handloom.service.kyc;

import com.odisha.handloom.dto.kyc.*;
import com.odisha.handloom.entity.KycStatus;

import com.odisha.handloom.entity.SellerKyc;
import com.odisha.handloom.entity.User;
import com.odisha.handloom.repository.SellerKycRepository;
import com.odisha.handloom.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class SellerKycService {

    @Autowired
    private SellerKycRepository sellerKycRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PanVerificationService panService;

    @Autowired
    private AadhaarVerificationService aadhaarService;

    @Autowired
    private GstVerificationService gstService;

    @Transactional(readOnly = true)
    public SellerKycResponse getKycStatus(UUID userId) {
        SellerKyc kyc = getOrCreateKyc(userId);
        return mapToResponse(kyc);
    }

    @Transactional
    public SellerKycResponse verifyPan(UUID userId, PanVerifyRequest request) {
        SellerKyc kyc = getOrCreateKyc(userId);

        if (kyc.isPanVerified()) {
            throw new IllegalStateException("PAN already verified");
        }

        // External Verification
        boolean isValid = panService.verifyPan(request.getPanNumber(), request.getFullName(), request.getDob());
        if (!isValid) {
            throw new IllegalArgumentException("PAN Verification Failed at Method Level");
        }

        // Mask and Save
        kyc.setPanMasked(maskString(request.getPanNumber(), 5, 1)); // ABCDE1234F -> ABCDE****F
        kyc.setPanVerified(true);
        kyc.setKycStatus(KycStatus.PAN_VERIFIED);

        // Map user PAN too for profile
        User user = kyc.getUser();
        user.setPanNumber(request.getPanNumber()); // In real app, might want to store encrypted or just masked
        userRepository.save(user);

        return mapToResponse(sellerKycRepository.save(kyc));
    }

    public String sendAadhaarOtp(UUID userId, AadhaarOtpRequest request) {
        SellerKyc kyc = getOrCreateKyc(userId);
        if (!kyc.isPanVerified()) {
            throw new IllegalStateException("Please verify PAN first");
        }
        if (kyc.isAadhaarVerified()) {
            throw new IllegalStateException("Aadhaar already verified");
        }
        return aadhaarService.sendOtp(request.getAadhaarNumber());
    }

    @Transactional
    public SellerKycResponse verifyAadhaarOtp(UUID userId, AadhaarVerifyRequest request) {
        SellerKyc kyc = getOrCreateKyc(userId);

        boolean isValid = aadhaarService.verifyOtp(request.getAadhaarNumber(), request.getOtp());
        if (!isValid) {
            throw new IllegalArgumentException("Invalid OTP");
        }

        // Mask and Save (XXXX-XXXX-1234)
        String aadhaar = request.getAadhaarNumber();
        String masked = "XXXX-XXXX-" + aadhaar.substring(aadhaar.length() - 4);
        kyc.setAadhaarMasked(masked);
        kyc.setAadhaarVerified(true);
        kyc.setKycStatus(KycStatus.AADHAAR_VERIFIED);

        return mapToResponse(sellerKycRepository.save(kyc));
    }

    @Transactional
    public SellerKycResponse verifyGst(UUID userId, GstVerifyRequest request) {
        SellerKyc kyc = getOrCreateKyc(userId);
        if (!kyc.isAadhaarVerified()) {
            throw new IllegalStateException("Please verify Aadhaar first");
        }

        boolean isValid = gstService.verifyGst(request.getGstNumber());
        if (!isValid) {
            throw new IllegalArgumentException("Invalid GSTIN");
        }

        kyc.setGstin(request.getGstNumber());
        kyc.setGstVerified(true);
        kyc.setKycStatus(KycStatus.GST_VERIFIED);

        User user = kyc.getUser();
        user.setGstNumber(request.getGstNumber());
        if (request.getBusinessName() != null)
            user.setShopName(request.getBusinessName());
        userRepository.save(user);

        return mapToResponse(sellerKycRepository.save(kyc));
    }

    @Transactional
    public SellerKycResponse submitForApproval(UUID userId) {
        SellerKyc kyc = getOrCreateKyc(userId);
        if (!kyc.isPanVerified() || !kyc.isAadhaarVerified()) {
            throw new IllegalStateException("Incomplete Verification Steps");
        }
        kyc.setKycStatus(KycStatus.PENDING_APPROVAL);
        return mapToResponse(sellerKycRepository.save(kyc));
    }

    // --- Helpers ---

    private SellerKyc getOrCreateKyc(UUID userId) {
        return sellerKycRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new RuntimeException("User not found"));
                    SellerKyc newKyc = new SellerKyc();
                    newKyc.setUser(user);
                    newKyc.setKycStatus(KycStatus.NOT_STARTED);
                    return sellerKycRepository.save(newKyc);
                });
    }

    private SellerKycResponse mapToResponse(SellerKyc kyc) {
        SellerKycResponse response = new SellerKycResponse();
        response.setStatus(kyc.getKycStatus().name());
        response.setPanVerified(kyc.isPanVerified());
        response.setPanMasked(kyc.getPanMasked());
        response.setAadhaarVerified(kyc.isAadhaarVerified());
        response.setAadhaarMasked(kyc.getAadhaarMasked());
        response.setGstVerified(kyc.isGstVerified());
        response.setRejectionReason(kyc.getRejectionReason());
        return response;
    }

    private String maskString(String input, int visibleStart, int visibleEnd) {
        if (input == null)
            return null;
        int len = input.length();
        if (len <= visibleStart + visibleEnd)
            return input; // Too short to mask

        StringBuilder sb = new StringBuilder();
        sb.append(input, 0, visibleStart);
        for (int i = visibleStart; i < len - visibleEnd; i++) {
            sb.append("*");
        }
        sb.append(input.substring(len - visibleEnd));
        return sb.toString();
    }
}
