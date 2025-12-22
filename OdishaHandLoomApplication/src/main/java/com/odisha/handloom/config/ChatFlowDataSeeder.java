package com.odisha.handloom.config;

import com.odisha.handloom.entity.ChatFlow;
import com.odisha.handloom.repository.ChatFlowRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
public class ChatFlowDataSeeder implements CommandLineRunner {

    private final ChatFlowRepository chatFlowRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public ChatFlowDataSeeder(ChatFlowRepository chatFlowRepository) {
        this.chatFlowRepository = chatFlowRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (chatFlowRepository.count() == 0) {

            // Flow 1: Order Issue
            ChatFlow orderStep1 = ChatFlow.builder()
                    .intent("ORDER_ISSUE")
                    .stepId("STEP_1")
                    .question("I can help with order issues. What is the problem?")
                    .options(objectMapper.writeValueAsString(List.of("Late Delivery", "Damaged Item", "Wrong Item")))
                    .nextStep(objectMapper.writeValueAsString(Map.of(
                            "Late Delivery", "ORDER_LATE",
                            "Damaged Item", "ORDER_DAMAGED",
                            "Wrong Item", "ORDER_WRONG")))
                    .isFinal(false)
                    .build();

            ChatFlow orderLate = ChatFlow.builder()
                    .intent("ORDER_ISSUE")
                    .stepId("ORDER_LATE")
                    .question("Is it past the estimated delivery date?")
                    .options(objectMapper.writeValueAsString(List.of("Yes", "No")))
                    .nextStep(objectMapper.writeValueAsString(Map.of(
                            "Yes", "SUPPORT_TICKET",
                            "No", "WAIT_MSG")))
                    .isFinal(false)
                    .build();

            ChatFlow waitMsg = ChatFlow.builder()
                    .intent("ORDER_ISSUE")
                    .stepId("WAIT_MSG")
                    .question("Please wait for 24-48 hours. The package is on its way.")
                    .options("[]")
                    .nextStep(null)
                    .isFinal(true)
                    .build();

            // Flow 2: Payment Issue
            ChatFlow paymentStep1 = ChatFlow.builder()
                    .intent("PAYMENT_ISSUE")
                    .stepId("STEP_1")
                    .question("What is the payment issue?")
                    .options(objectMapper.writeValueAsString(List.of("Money Deducted", "Payment Failed")))
                    .nextStep(objectMapper.writeValueAsString(Map.of(
                            "Money Deducted", "PAYMENT_DEDUCTED",
                            "Payment Failed", "PAYMENT_FAILED")))
                    .isFinal(false)
                    .build();

            ChatFlow paymentDeducted = ChatFlow.builder()
                    .intent("PAYMENT_ISSUE")
                    .stepId("PAYMENT_DEDUCTED")
                    .question("It usually refunds automatically in 3-5 days. Do you want to raise a ticket?")
                    .options(objectMapper.writeValueAsString(List.of("Yes", "No")))
                    .nextStep(objectMapper.writeValueAsString(Map.of(
                            "Yes", "SUPPORT_TICKET",
                            "No", "RESOLVED")))
                    .isFinal(false)
                    .build();

            // Common Final Steps/Placeholders
            // Typically handled by logic, but good to have flow entry if needed or reuse
            // same ID logic

            chatFlowRepository.saveAll(List.of(orderStep1, orderLate, waitMsg, paymentStep1, paymentDeducted));
            System.out.println("ChatFlow Data Seeded Successfully.");
        }
    }
}
