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

    @Autowired
    private com.odisha.handloom.repository.SellerBankDetailsRepository bankDetailsRepository;

    @Override
    public List<com.odisha.handloom.payload.dto.SellerPayoutDTO> getAllSellerBankDetails() {
        return userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.SELLER)
                .map(seller -> {
                    com.odisha.handloom.entity.SellerBankDetails details = bankDetailsRepository.findBySeller(seller)
                            .orElse(null);

                    com.odisha.handloom.payload.dto.SellerPayoutDTO dto = new com.odisha.handloom.payload.dto.SellerPayoutDTO();
                    dto.setId(seller.getId());
                    dto.setFullName(seller.getFullName());
                    dto.setShopName(seller.getShopName());

                    if (details != null) {
                        dto.setBankDetails(new com.odisha.handloom.payload.dto.SellerPayoutDTO.BankDetailsDTO(
                                details.getAccountNumber(),
                                details.getIfscCode(),
                                details.getAccountHolderName(),
                                details.getBankName(),
                                details.isVerified()));
                    }

                    return dto;
                })
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
        // 5. Create Payout Record
        Payout payout = new Payout();
        payout.setSeller(seller);
        payout.setBankAccountSnapshot(snapshot);
        payout.setTotalAmount(totalAmount);
        payout.setPayoutReference("TXN-" + UUID.randomUUID().toString()); // Mock Reference
        payout.setStatus(Payout.PayoutStatus.SUCCESS); // Assuming manual success for now

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

    @Override
    public com.odisha.handloom.payload.response.WalletOverviewResponse getWalletOverview(UUID sellerId) {
        // 1. Calculate Current Balance (Pending Earnings)
        List<SellerEarnings> pendingEarnings = getPendingEarnings(sellerId);
        BigDecimal currentBalance = pendingEarnings.stream()
                .map(SellerEarnings::getNetAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 2. Calculate Total Withdrawn (Success Payouts)
        List<Payout> history = getPayoutHistory(sellerId);
        BigDecimal totalWithdrawn = history.stream()
                .filter(p -> p.getStatus() == Payout.PayoutStatus.SUCCESS)
                .map(Payout::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 3. Return Response
        return com.odisha.handloom.payload.response.WalletOverviewResponse.builder()
                .currentBalance(currentBalance)
                .totalWithdrawn(totalWithdrawn)
                .recentPayouts(history)
                .build();
    }
}
