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

    @Column(name = "is_final", nullable = false)
    @Builder.Default
    private Boolean isFinal = false; // If true, flow ends here

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getIntent() {
        return intent;
    }

    public void setIntent(String intent) {
        this.intent = intent;
    }

    public String getStepId() {
        return stepId;
    }

    public void setStepId(String stepId) {
        this.stepId = stepId;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getOptions() {
        return options;
    }

    public void setOptions(String options) {
        this.options = options;
    }

    public String getNextStep() {
        return nextStep;
    }

    public void setNextStep(String nextStep) {
        this.nextStep = nextStep;
    }

    public boolean isFinal() {
        return Boolean.TRUE.equals(isFinal);
    }

    public void setFinal(Boolean isFinal) {
        this.isFinal = isFinal;
    }
}
