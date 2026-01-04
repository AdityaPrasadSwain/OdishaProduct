package com.odisha.handloom.logistics.service;

import com.odisha.handloom.logistics.entity.AgentBankDetails;
import com.odisha.handloom.logistics.entity.AgentEarning;
import com.odisha.handloom.logistics.repository.AgentBankDetailsRepository;
import com.odisha.handloom.logistics.repository.AgentEarningRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class AgentPaymentService {

    @Autowired
    private AgentBankDetailsRepository bankDetailsRepository;

    @Autowired
    private AgentEarningRepository earningRepository;

    public AgentBankDetails saveBankDetails(UUID agentId, AgentBankDetails details) {
        AgentBankDetails existing = bankDetailsRepository.findByAgentId(agentId).orElse(new AgentBankDetails());
        existing.setAgentId(agentId);
        existing.setAccountHolderName(details.getAccountHolderName());
        existing.setBankName(details.getBankName());
        existing.setAccountNumber(details.getAccountNumber());
        existing.setIfsc(details.getIfsc());
        existing.setUpiId(details.getUpiId());
        return bankDetailsRepository.save(existing);
    }

    public AgentBankDetails getBankDetails(UUID agentId) {
        return bankDetailsRepository.findByAgentId(agentId).orElse(null);
    }

    public List<AgentEarning> getAgentEarnings(UUID agentId) {
        return earningRepository.findByAgentId(agentId);
    }

    public List<AgentEarning> getAllEarnings() {
        return earningRepository.findAll();
    }

    // Admin features
    public List<AgentEarning> getPendingEarnings() {
        return earningRepository.findByStatus(AgentEarning.EarningStatus.PENDING);
    }

    @Transactional
    public void markEarningsPaid(List<UUID> earningIds) {
        List<AgentEarning> earnings = earningRepository.findAllById(earningIds);
        earnings.forEach(e -> e.setStatus(AgentEarning.EarningStatus.PAID));
        earningRepository.saveAll(earnings);
    }

    @Transactional
    public void payEarning(UUID earningId, String transactionRef) {
        AgentEarning earning = earningRepository.findById(earningId)
                .orElseThrow(() -> new RuntimeException("Earning record not found"));
        earning.setStatus(AgentEarning.EarningStatus.PAID);
        earning.setTransactionRef(transactionRef);
        earning.setPaidAt(java.time.LocalDateTime.now());
        earningRepository.save(earning);
    }
}
