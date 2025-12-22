package com.odisha.handloom.service.impl;

import com.odisha.handloom.entity.Payout;
import com.odisha.handloom.entity.SellerEarnings;
import com.odisha.handloom.entity.User;
import com.odisha.handloom.entity.Role;
import com.odisha.handloom.payload.request.BankDetailsRequest;
import com.odisha.handloom.repository.PayoutRepository;
import com.odisha.handloom.repository.SellerEarningsRepository;
import com.odisha.handloom.repository.UserRepository;
import com.odisha.handloom.service.SellerPayoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SellerPayoutServiceImpl implements SellerPayoutService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SellerEarningsRepository earningsRepository;

    @Autowired
    private PayoutRepository payoutRepository;

    @Override
    public User addOrUpdateBankDetails(UUID sellerId, BankDetailsRequest request) {
        User seller = userRepository.findById(sellerId)
                .orElseThrow(() -> new RuntimeException("Seller not found"));

        seller.setAccountHolderName(request.getAccountHolderName());
        seller.setBankName(request.getBankName());
        seller.setBankAccountNumber(request.getAccountNumber());
        seller.setIfscCode(request.getIfscCode());
        // Branch is possibly contained in ifsc or optional, we won't store explicit
        // branch if not in User entity
        // Or if simple string address field is used, maybe request has it but User
        // doesn't.
        // For now, mapping what we have.

        seller.setBankVerified(false); // Reset verification on update
        return userRepository.save(seller);
    }

    @Override
    public User getBankDetails(UUID sellerId) {
        return userRepository.findById(sellerId).orElseThrow(() -> new RuntimeException("Seller not found"));
    }

    @Override
    public List<User> getAllSellerBankDetails() {
        return userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.SELLER && u.getBankAccountNumber() != null)
                .collect(Collectors.toList());
    }

    @Override
    public User verifyBankDetails(UUID sellerId, boolean isVerified) {
        User seller = userRepository.findById(sellerId)
                .orElseThrow(() -> new RuntimeException("Seller not found"));

        seller.setBankVerified(isVerified);
        return userRepository.save(seller);
    }

    @Override
    public List<SellerEarnings> getPendingEarnings(UUID sellerId) {
        return earningsRepository.findBySeller_Id(sellerId).stream()
                .filter(e -> e.getPayoutStatus() == SellerEarnings.PayoutStatus.PENDING)
                .collect(Collectors.toList());
    }

    @Override
    public List<SellerEarnings> getSellerEarnings(UUID sellerId) {
        return earningsRepository.findBySeller_Id(sellerId);
    }

    @Override
    @Transactional
    public Payout initiatePayout(UUID sellerId) {
        // 1. Validate Bank Details
        User seller = userRepository.findById(sellerId)
                .orElseThrow(() -> new RuntimeException("Seller not found"));

        if (!seller.isBankVerified()) {
            throw new RuntimeException("Bank details are not verified. Cannot initiate payout.");
        }

        // 2. Get Pending Earnings
        List<SellerEarnings> pendingEarnings = getPendingEarnings(sellerId);

        if (pendingEarnings.isEmpty()) {
            throw new RuntimeException("No pending earnings to payout.");
        }

        // 3. Calculate Total
        BigDecimal totalAmount = pendingEarnings.stream()
                .map(SellerEarnings::getNetAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 4. Create Snapshot
        String snapshot = String.format("Bank: %s, Acc: %s, IFSC: %s, Holder: %s",
                seller.getBankName(), seller.getBankAccountNumber(), seller.getIfscCode(),
                seller.getAccountHolderName());

        // 5. Create Payout Record
        Payout payout = Payout.builder()
                .seller(seller)
                .bankAccountSnapshot(snapshot)
                .totalAmount(totalAmount)
                .payoutReference("TXN-" + UUID.randomUUID().toString()) // Mock Reference
                .status(Payout.PayoutStatus.SUCCESS) // Assuming manual success for now
                .build();

        Payout savedPayout = payoutRepository.save(payout);

        // 6. Update Earnings
        for (SellerEarnings earning : pendingEarnings) {
            earning.setPayoutStatus(SellerEarnings.PayoutStatus.PAID);
            earning.setPayout(savedPayout);
            earningsRepository.save(earning);
        }

        return savedPayout;
    }

    @Override
    public List<Payout> getPayoutHistory(UUID sellerId) {
        return payoutRepository.findBySeller_Id(sellerId);
    }
}
