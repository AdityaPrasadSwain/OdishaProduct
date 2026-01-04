package com.odisha.handloom.finance.repository;

import com.odisha.handloom.finance.entity.PlatformWallet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface PlatformWalletRepository extends JpaRepository<PlatformWallet, UUID> {
}
