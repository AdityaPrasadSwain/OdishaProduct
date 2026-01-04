package com.odisha.handloom.finance.service;

import com.odisha.handloom.finance.entity.SellerSettlement;
import com.odisha.handloom.finance.enums.SettlementStatus;
import com.odisha.handloom.finance.repository.SellerSettlementRepository;
import com.odisha.handloom.entity.Order;
import com.odisha.handloom.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class SettlementService {

    @Autowired
    private SellerSettlementRepository settlementRepository;

    @Autowired
    private PlatformWalletService platformWalletService;

    @Autowired
    private com.odisha.handloom.logistics.repository.AgentEarningRepository agentEarningRepository;

    public com.odisha.handloom.logistics.entity.AgentEarning payAgent(UUID earningId, String transactionRef) {
        com.odisha.handloom.logistics.entity.AgentEarning earning = agentEarningRepository.findById(earningId)
                .orElseThrow(() -> new RuntimeException("Earning record not found"));

        if (earning.getStatus() == com.odisha.handloom.logistics.entity.AgentEarning.EarningStatus.PAID) {
            throw new RuntimeException("Agent earning already paid");
        }

        // Debit Platform Wallet
        platformWalletService.debit(
                earning.getAmount(),
                com.odisha.handloom.finance.entity.WalletTransaction.TransactionSource.AGENT_PAYOUT,
                earning.getId().toString(),
                "Payout for Agent Earning #" + earning.getId() + " (Ref: " + transactionRef + ")");

        earning.setStatus(com.odisha.handloom.logistics.entity.AgentEarning.EarningStatus.PAID);
        earning.setTransactionRef(transactionRef);
        earning.setPaidAt(LocalDateTime.now());

        return agentEarningRepository.save(earning);
    }

    private static final BigDecimal PLATFORM_FEE_PERCENTAGE = new BigDecimal("0.05"); // 5%
    private static final BigDecimal TAX_PERCENTAGE = new BigDecimal("0.18"); // 18% on Fee

    @Transactional
    public SellerSettlement createSettlement(Order order) {
        if (order.getSeller() == null) {
            throw new RuntimeException("Order has no seller assigned");
        }

        BigDecimal orderAmount = order.getTotalAmount();
        BigDecimal platformFee = orderAmount.multiply(PLATFORM_FEE_PERCENTAGE);
        BigDecimal tax = platformFee.multiply(TAX_PERCENTAGE); // Tax on service fee
        BigDecimal netAmount = orderAmount.subtract(platformFee).subtract(tax);

        SellerSettlement settlement = SellerSettlement.builder()
                .orderId(order.getId())
                .sellerId(order.getSeller().getId())
                .orderAmount(orderAmount)
                .platformFee(platformFee)
                .tax(tax)
                .netAmount(netAmount)
                .status(SettlementStatus.READY) // Assuming this is called on delivery success
                .build();

        return settlementRepository.save(settlement);
    }

    public List<SellerSettlement> getSettlementsBySeller(UUID sellerId) {
        return settlementRepository.findBySellerId(sellerId);
    }

    public List<SellerSettlement> getAllSettlements() {
        return settlementRepository.findAll();
    }

    @Transactional
    public SellerSettlement approvePayout(UUID settlementId, String transactionRef) {
        SellerSettlement settlement = settlementRepository.findById(settlementId)
                .orElseThrow(() -> new RuntimeException("Settlement not found"));

        if (settlement.getStatus() == SettlementStatus.PAID) {
            throw new RuntimeException("Settlement already paid");
        }

        // Debit Platform Wallet (Real money movement logic would go here or via Payment
        // Gateway)
        platformWalletService.debit(
                settlement.getNetAmount(),
                com.odisha.handloom.finance.entity.WalletTransaction.TransactionSource.SELLER_PAYOUT,
                settlement.getId().toString(),
                "Payout for Settlement #" + settlement.getId() + " (Ref: " + transactionRef + ")");

        settlement.setStatus(SettlementStatus.PAID);
        settlement.setTransactionRef(transactionRef);
        settlement.setPaidAt(LocalDateTime.now());

        return settlementRepository.save(settlement);
    }

    public SellerSettlement holdSettlement(UUID settlementId) {
        SellerSettlement settlement = settlementRepository.findById(settlementId)
                .orElseThrow(() -> new RuntimeException("Settlement not found"));
        settlement.setStatus(SettlementStatus.HOLD);
        return settlementRepository.save(settlement);
    }

    public SellerSettlement releaseSettlement(UUID settlementId) {
        SellerSettlement settlement = settlementRepository.findById(settlementId)
                .orElseThrow(() -> new RuntimeException("Settlement not found"));
        settlement.setStatus(SettlementStatus.READY);
        return settlementRepository.save(settlement);
    }
}
