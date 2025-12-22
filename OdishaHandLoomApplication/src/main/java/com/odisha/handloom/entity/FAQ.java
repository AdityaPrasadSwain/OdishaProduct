package com.odisha.handloom.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "faqs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FAQ {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String keyword; // lowercase for matching

    @Column(columnDefinition = "TEXT", nullable = false)
    private String answer;

    @Column(name = "target_role", nullable = false)
    private String targetRole; // CUSTOMER, SELLER, ALL
}
