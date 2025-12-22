package com.odisha.handloom.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "chat_flows")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatFlow {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 50)
    private String intent; // e.g., "INTERNET_ISSUE"

    @Column(nullable = false, length = 50)
    private String stepId; // e.g., "STEP_1"

    @Column(columnDefinition = "TEXT", nullable = false)
    private String question;

    @Column(columnDefinition = "TEXT")
    private String options; // JSON string: ["Option A", "Option B"]

    @Column(name = "next_step", columnDefinition = "TEXT")
    private String nextStep; // JSON string: {"Option A": "STEP_2", "Option B": "STEP_3"}

    @Column(name = "is_final")
    private boolean isFinal; // If true, flow ends here
}
