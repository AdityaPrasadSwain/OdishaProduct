package com.odisha.handloom.finance.service;

import com.odisha.handloom.finance.entity.PlatformWallet;
import com.odisha.handloom.finance.repository.PlatformWalletRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class PlatformWalletService {

    @Autowired
    private com.odisha.handloom.finance.repository.WalletTransactionRepository transactionRepository;

    @Autowired
    private PlatformWalletRepository platformWalletRepository;

    public PlatformWallet getWallet() {
        return platformWalletRepository.findAll().stream().findFirst()
                .orElseGet(() -> {
                    PlatformWallet wallet = PlatformWallet.builder()
                            .totalBalance(BigDecimal.ZERO)
                            .build();
                    return platformWalletRepository.save(wallet);
                });
    }

    @Transactional
    public void credit(BigDecimal amount, com.odisha.handloom.finance.entity.WalletTransaction.TransactionSource source,
            String referenceId, String description) {
        PlatformWallet wallet = getWallet();
        wallet.setTotalBalance(wallet.getTotalBalance().add(amount));
        platformWalletRepository.save(wallet);

        com.odisha.handloom.finance.entity.WalletTransaction txn = com.odisha.handloom.finance.entity.WalletTransaction
                .builder()
                .wallet(wallet)
                .type(com.odisha.handloom.finance.entity.WalletTransaction.TransactionType.CREDIT)
                .amount(amount)
                .source(source)
                .referenceId(referenceId)
                .description(description)
                .build();
        transactionRepository.save(txn);
    }

    // Default overload for backward compatibility (assumes ORDER_PAYMENT)
    @Transactional
    public void credit(BigDecimal amount) {
        credit(amount, com.odisha.handloom.finance.entity.WalletTransaction.TransactionSource.ORDER_PAYMENT, null,
                "Credit to wallet");
    }

    @Transactional
    public void debit(BigDecimal amount, com.odisha.handloom.finance.entity.WalletTransaction.TransactionSource source,
            String referenceId, String description) {
        PlatformWallet wallet = getWallet();
        if (wallet.getTotalBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Insufficient platform balance");
        }
        wallet.setTotalBalance(wallet.getTotalBalance().subtract(amount));
        platformWalletRepository.save(wallet);

        com.odisha.handloom.finance.entity.WalletTransaction txn = com.odisha.handloom.finance.entity.WalletTransaction
                .builder()
                .wallet(wallet)
                .type(com.odisha.handloom.finance.entity.WalletTransaction.TransactionType.DEBIT)
                .amount(amount)
                .source(source)
                .referenceId(referenceId)
                .description(description)
                .build();
        transactionRepository.save(txn);
    }

    // Default overload (assumes SELLER_PAYOUT if unspecified, but better to be
    // explicit)
    @Transactional
    public void debit(BigDecimal amount) {
        debit(amount, com.odisha.handloom.finance.entity.WalletTransaction.TransactionSource.ADJUSTMENT, null,
                "Manual debit");
    }
}
