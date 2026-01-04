package com.odisha.handloom.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "platform_config")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlatformConfig {

    @Id
    private String configKey; // e.g., "DEFAULT"

    private BigDecimal commissionPercentage; // e.g., 0.05 for 5%
    private BigDecimal gstPercentage; // e.g., 0.18 for 18%

    // We can add a method to get default values if not found in DB
    public static PlatformConfig createDefault() {
        return new PlatformConfig("DEFAULT", new BigDecimal("0.05"), new BigDecimal("0.18"));
    }

    public BigDecimal getCommissionPercentage() {
        return commissionPercentage;
    }

    public BigDecimal getGstPercentage() {
        return gstPercentage;
    }
}
