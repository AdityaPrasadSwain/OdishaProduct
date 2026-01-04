package com.odisha.handloom.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.util.UUID;

@Entity
@Table(name = "product_policies")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductPolicy {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonBackReference
    private Product product;

    private Integer dispatchDays; // Time to pack/dispatch

    private Boolean returnAvailable;
    private Integer returnWindowDays;

    @Column(columnDefinition = "TEXT")
    private String returnPolicyDescription;

    private Boolean cancellationAvailable;
}
