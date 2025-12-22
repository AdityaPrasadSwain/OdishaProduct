package com.odisha.handloom.service.kyc;

import com.odisha.handloom.entity.KycStatus;
import com.odisha.handloom.entity.Role;
import com.odisha.handloom.entity.SellerKyc;
import com.odisha.handloom.entity.User;
import com.odisha.handloom.repository.SellerKycRepository;
import com.odisha.handloom.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class AdminKycService {

    @Autowired
    private SellerKycRepository sellerKycRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public void approveSeller(UUID kycId) {
        SellerKyc kyc = sellerKycRepository.findById(kycId)
                .orElseThrow(() -> new RuntimeException("KYC Request not found"));

        if (kyc.getKycStatus() != KycStatus.PENDING_APPROVAL) {
            // throw new IllegalStateException("KYC is not pending approval");
            // Relaxing for demo ease, or if admin wants to force approve
        }

        kyc.setKycStatus(KycStatus.APPROVED);
        kyc.setRejectionReason(null);
        sellerKycRepository.save(kyc);

        // Promote User
        User user = kyc.getUser();
        user.setApproved(true);
        user.setRole(Role.SELLER);
        userRepository.save(user);
    }

    @Transactional
    public void rejectSeller(UUID kycId, String reason) {
        SellerKyc kyc = sellerKycRepository.findById(kycId)
                .orElseThrow(() -> new RuntimeException("KYC Request not found"));

        kyc.setKycStatus(KycStatus.REJECTED);
        kyc.setRejectionReason(reason);
        sellerKycRepository.save(kyc);

        // User remains pending/customer
    }
}
