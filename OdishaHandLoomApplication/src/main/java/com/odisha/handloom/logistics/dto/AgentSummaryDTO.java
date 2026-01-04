package com.odisha.handloom.logistics.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class AgentSummaryDTO {
    private long totalOrders;
    private long completedOrders;
    private BigDecimal earningsToday;
    private BigDecimal totalEarnings;

    public long getTotalOrders() {
        return totalOrders;
    }

    public long getCompletedOrders() {
        return completedOrders;
    }

    public BigDecimal getEarningsToday() {
        return earningsToday;
    }

    public BigDecimal getTotalEarnings() {
        return totalEarnings;
    }

    public void setTotalOrders(long totalOrders) {
        this.totalOrders = totalOrders;
    }

    public void setCompletedOrders(long completedOrders) {
        this.completedOrders = completedOrders;
    }

    public void setEarningsToday(BigDecimal earningsToday) {
        this.earningsToday = earningsToday;
    }

    public void setTotalEarnings(BigDecimal totalEarnings) {
        this.totalEarnings = totalEarnings;
    }
}
