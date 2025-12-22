package com.odisha.handloom.service;

import com.odisha.handloom.entity.Payout;
import com.odisha.handloom.entity.SellerEarnings;
import com.odisha.handloom.entity.User;
import com.odisha.handloom.payload.request.BankDetailsRequest;
import java.util.List;
import java.util.UUID;

public interface SellerPayoutService {
    User addOrUpdateBankDetails(UUID sellerId, BankDetailsRequest request);

    User getBankDetails(UUID sellerId);

    // Admin methods
    List<User> getAllSellerBankDetails();

    User verifyBankDetails(UUID sellerId, boolean isVerified);

    // Earnings & Payouts
    List<SellerEarnings> getPendingEarnings(UUID sellerId);

    List<SellerEarnings> getSellerEarnings(UUID sellerId);

    Payout initiatePayout(UUID sellerId);

    List<Payout> getPayoutHistory(UUID sellerId);
}
