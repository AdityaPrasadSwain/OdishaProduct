package com.odisha.handloom.payload.response;

import com.odisha.handloom.entity.Payout;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class WalletOverviewResponse {
    private BigDecimal currentBalance;
    private BigDecimal totalWithdrawn;
    private List<Payout> recentPayouts;
}
