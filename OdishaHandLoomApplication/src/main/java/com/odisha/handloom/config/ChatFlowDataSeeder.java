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
                        ChatFlow orderStep1 = new ChatFlow();
                        orderStep1.setIntent("ORDER_ISSUE");
                        orderStep1.setStepId("STEP_1");
                        orderStep1.setQuestion("I can help with order issues. What is the problem?");
                        orderStep1.setOptions(objectMapper
                                        .writeValueAsString(List.of("Late Delivery", "Damaged Item", "Wrong Item")));
                        orderStep1.setNextStep(objectMapper.writeValueAsString(Map.of(
                                        "Late Delivery", "ORDER_LATE",
                                        "Damaged Item", "ORDER_DAMAGED",
                                        "Wrong Item", "ORDER_WRONG")));
                        orderStep1.setFinal(false);

                        ChatFlow orderLate = new ChatFlow();
                        orderLate.setIntent("ORDER_ISSUE");
                        orderLate.setStepId("ORDER_LATE");
                        orderLate.setQuestion("Is it past the estimated delivery date?");
                        orderLate.setOptions(objectMapper.writeValueAsString(List.of("Yes", "No")));
                        orderLate.setNextStep(objectMapper.writeValueAsString(Map.of(
                                        "Yes", "SUPPORT_TICKET",
                                        "No", "WAIT_MSG")));
                        orderLate.setFinal(false);

                        ChatFlow waitMsg = new ChatFlow();
                        waitMsg.setIntent("ORDER_ISSUE");
                        waitMsg.setStepId("WAIT_MSG");
                        waitMsg.setQuestion("Please wait for 24-48 hours. The package is on its way.");
                        waitMsg.setOptions("[]");
                        waitMsg.setNextStep(null);
                        waitMsg.setFinal(true);

                        // Flow 2: Payment Issue
                        ChatFlow paymentStep1 = new ChatFlow();
                        paymentStep1.setIntent("PAYMENT_ISSUE");
                        paymentStep1.setStepId("STEP_1");
                        paymentStep1.setQuestion("What is the payment issue?");
                        paymentStep1.setOptions(
                                        objectMapper.writeValueAsString(List.of("Money Deducted", "Payment Failed")));
                        paymentStep1.setNextStep(objectMapper.writeValueAsString(Map.of(
                                        "Money Deducted", "PAYMENT_DEDUCTED",
                                        "Payment Failed", "PAYMENT_FAILED")));
                        paymentStep1.setFinal(false);

                        ChatFlow paymentDeducted = new ChatFlow();
                        paymentDeducted.setIntent("PAYMENT_ISSUE");
                        paymentDeducted.setStepId("PAYMENT_DEDUCTED");
                        paymentDeducted.setQuestion(
                                        "It usually refunds automatically in 3-5 days. Do you want to raise a ticket?");
                        paymentDeducted.setOptions(objectMapper.writeValueAsString(List.of("Yes", "No")));
                        paymentDeducted.setNextStep(objectMapper.writeValueAsString(Map.of(
                                        "Yes", "SUPPORT_TICKET",
                                        "No", "RESOLVED")));
                        paymentDeducted.setFinal(false);

                        // Common Final Steps/Placeholders
                        // Typically handled by logic, but good to have flow entry if needed or reuse
                        // same ID logic

                        chatFlowRepository.saveAll(
                                        List.of(orderStep1, orderLate, waitMsg, paymentStep1, paymentDeducted));
                        System.out.println("ChatFlow Data Seeded Successfully.");
                }
        }
}
