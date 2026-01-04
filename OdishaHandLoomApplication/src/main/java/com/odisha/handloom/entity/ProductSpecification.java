package com.odisha.handloom.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.util.UUID;

@Entity
@Table(name = "product_specifications")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductSpecification {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonBackReference
    private Product product;

    @Column(nullable = false)
    private String specKey; // 'key' is a reserved word in some DBs

    @Column(nullable = false)
    private String specValue;
}
