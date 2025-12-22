package com.odisha.handloom.service;

import com.odisha.handloom.entity.*;
import com.odisha.handloom.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class ChatService {

    @Autowired
    private ChatSessionRepository chatSessionRepository;

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private FAQRepository faqRepository; // Keep as fallback if needed for quick Q&A

    @Autowired
    private ChatFlowRepository chatFlowRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private com.odisha.handloom.repository.OrderRepository orderRepository;

    private final com.fasterxml.jackson.databind.ObjectMapper objectMapper = new com.fasterxml.jackson.databind.ObjectMapper();

    @Transactional
    public ChatSession startSession(String email) {
        // ... (Same startSession logic, just ensure existing session is reused)
        // For brevity, using same logic as before but resetting state if needed?
        // Let's keep existing logic.
        if (email != null) {
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Check for existing active session
            Optional<ChatSession> existing = chatSessionRepository.findByUserIdAndActiveTrue(user.getId());
            if (existing.isPresent())
                return existing.get();

            ChatSession session = ChatSession.builder()
                    .userId(user.getId())
                    .userRole(determineRole(user))
                    .active(true)
                    .build();
            return chatSessionRepository.save(session);
        } else {
            ChatSession session = ChatSession.builder().userRole("GUEST").active(true).build();
            return chatSessionRepository.save(session);
        }
    }

    private String determineRole(User user) {
        String roleName = user.getRole().name();
        if (roleName.equals("SELLER"))
            return "SELLER";
        if (roleName.equals("ADMIN"))
            return "ADMIN";
        return "CUSTOMER";
    }

    @Transactional
    public ChatMessage processMessage(UUID sessionId, String userMessage) {
        ChatSession session = chatSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        if (!session.isActive()) {
            session.setActive(true);
            chatSessionRepository.save(session);
        }

        // 1. Save User Message
        ChatMessage userMsg = ChatMessage.builder()
                .session(session)
                .sender("USER")
                .message(userMessage)
                .build();
        chatMessageRepository.save(userMsg);

        // 2. Logic to determine Bot Response
        BotResponse response;

        // A. Special: Check for Order Selection Payload First (Signal)
        if (userMessage.startsWith("ORDER_SELECTED:")) {
            response = handleOrderSelectionSignal(session, userMessage);
        }
        // B. Check if User is in an Active Flow
        else if (session.getCurrentStepId() != null && session.getCurrentIntent() != null) {
            response = handleExistingFlow(session, userMessage);
        }
        // C. Detect Intent and Start New Flow
        else {
            response = handleNewIntent(session, userMessage);
        }

        // Re-Sync Options (If flow transition happened silently or we need to load DB
        // options)
        if (session.getCurrentStepId() != null && response.options == null) {
            response.options = fetchOptionsForStep(session);
        }

        // 3. Save Bot Message
        ChatMessage botMsg = ChatMessage.builder()
                .session(session)
                .sender("BOT")
                .message(response.text)
                .options(response.options)
                .payload(response.payload)
                .build();
        return chatMessageRepository.save(botMsg);
    }

    // --- Phase 1: Signal Handling ---
    private BotResponse handleOrderSelectionSignal(ChatSession session, String userMessage) {
        String orderIdStr = userMessage.split(":")[1];
        try {
            UUID orderId = UUID.fromString(orderIdStr);
            session.setSelectedOrderId(orderId);
            session.setCurrentIntent("ORDER_SUPPORT");
            session.setCurrentStepId("ORDER_ISSUES");
            chatSessionRepository.save(session);

            // Dynamic Options for Order Issues
            return new BotResponse(
                    "What issue are you facing with this order?",
                    objectMapper.writeValueAsString(
                            List.of("Where is my order?", "Want to cancel", "Return / Replace", "Product damaged")),
                    null);
        } catch (Exception e) {
            return new BotResponse("Invalid order selection.", null, null);
        }
    }

    // --- Phase 2: Flow Handling ---
    private BotResponse handleExistingFlow(ChatSession session, String userMessage) {
        try {
            // Dynamic Flow: ORDER_ISSUES
            if ("ORDER_ISSUES".equals(session.getCurrentStepId())) {
                return handleOrderIssueSelection(session, userMessage);
            }

            // Standard DB Flow
            com.odisha.handloom.entity.ChatFlow currentFlow = chatFlowRepository
                    .findByIntentAndStepId(session.getCurrentIntent(), session.getCurrentStepId())
                    .orElse(null);

            if (currentFlow == null) {
                // State is corrupted or flow missing, reset and try intent detection
                resetSessionState(session);
                return handleNewIntent(session, userMessage);
            }

            if (currentFlow.getNextStep() == null) {
                // Should have been final, reset
                resetSessionState(session);
                return handleNewIntent(session, userMessage);
            }

            Map<String, String> nextSteps = objectMapper.readValue(currentFlow.getNextStep(), Map.class);
            String nextStepId = nextSteps.get(userMessage);

            // Valid Option Selected?
            if (nextStepId != null) {
                // Special Steps
                if ("SUPPORT_TICKET".equals(nextStepId)) {
                    resetSessionState(session);
                    return new BotResponse("I'll connect you to support. Please create a ticket.", null, null);
                }
                if ("RESOLVED".equals(nextStepId)) {
                    resetSessionState(session);
                    return new BotResponse("Glad I could help!", null, null);
                }

                // Advance Step
                session.setCurrentStepId(nextStepId);
                chatSessionRepository.save(session);
                return new BotResponse(getQuestionForStep(session.getCurrentIntent(), nextStepId), null, null);
            }

            // Invalid Option for Current Step -> Fallback to "Please select option"
            return new BotResponse("Please select one of the options below.", currentFlow.getOptions(), null);

        } catch (Exception e) {
            e.printStackTrace();
            return new BotResponse("An error occurred.", null, null);
        }
    }

    // --- Phase 3: New Intent Detection ---
    private BotResponse handleNewIntent(ChatSession session, String userMessage) {
        String msg = userMessage.toLowerCase();

        // 1. Order Support
        if (msg.contains("order") || msg.contains("delivery") || msg.contains("return") || msg.contains("refund")) {
            return startOrderSupportFlow(session);
        }

        // 2. Payment Issue
        if (msg.contains("payment") || msg.contains("money") || msg.contains("refund") || msg.contains("transaction")) {
            return startStaticFlow(session, "PAYMENT_ISSUE", "STEP_1");
        }

        // 3. Internet/Technical (Example)
        if (msg.contains("internet") || msg.contains("slow") || msg.contains("network") || msg.contains("site")) {
            // Maybe map to a Technical flow if exists
        }

        // 4. FAQ Match (Knowledge Base)
        Optional<FAQ> faqMatch = findFAQ(session, msg);
        if (faqMatch.isPresent()) {
            return new BotResponse(faqMatch.get().getAnswer(), null, null);
        }

        // 5. Fallback (LAST RESORT)
        return new BotResponse("Sorry, I couldn't understand. Do you want to create a support ticket?", null, null);
    }

    // --- Helpers ---

    private BotResponse startOrderSupportFlow(ChatSession session) {
        if (session.getUserId() == null) {
            return new BotResponse("Please login to verify your orders.", null, null);
        }

        List<Order> recentOrders = orderRepository.findByUserIdAndCreatedAtAfter(session.getUserId(),
                LocalDateTime.now().minusDays(7));
        if (recentOrders.isEmpty()) {
            return new BotResponse("I couldn't find any recent orders (last 7 days).", null, null);
        }

        try {
            List<Map<String, Object>> ordersJson = recentOrders.stream().<Map<String, Object>>map(o -> {
                Map<String, Object> map = new java.util.HashMap<>();
                map.put("orderId", o.getId().toString());
                map.put("amount", o.getTotalAmount());
                map.put("status", o.getStatus().name());
                map.put("orderDate", o.getCreatedAt().toString());
                return map;
            }).collect(java.util.stream.Collectors.toList());

            String payload = objectMapper.writeValueAsString(Map.of("type", "ORDER_LIST", "orders", ordersJson));

            // Note: Not setting session state yet, waiting for selection
            return new BotResponse("Here are your recent orders. Please select one:", null, payload);
        } catch (Exception e) {
            return new BotResponse("Error fetching orders.", null, null);
        }
    }

    private BotResponse startStaticFlow(ChatSession session, String intent, String stepId) {
        session.setCurrentIntent(intent);
        session.setCurrentStepId(stepId);
        chatSessionRepository.save(session);
        return new BotResponse(getQuestionForStep(intent, stepId), null, null);
    }

    private BotResponse handleOrderIssueSelection(ChatSession session, String userMessage) {
        if ("Want to cancel".equals(userMessage)) {
            resetSessionState(session); // End flow
            return new BotResponse("To cancel, please go to 'My Orders' -> Select Order -> Cancel.", null, null);
        }
        if ("Where is my order?".equals(userMessage)) {
            resetSessionState(session);
            return new BotResponse("Your order status is shown on the card. You can track it in 'My Orders'.", null,
                    null);
        }

        resetSessionState(session);
        return new BotResponse("I've created a ticket for '" + userMessage + "'. Our team will contact you.", null,
                null);
    }

    private String fetchOptionsForStep(ChatSession session) {
        if ("ORDER_ISSUES".equals(session.getCurrentStepId()))
            return null; // Dynamic
        return chatFlowRepository.findByIntentAndStepId(session.getCurrentIntent(), session.getCurrentStepId())
                .map(ChatFlow::getOptions).orElse(null);
    }

    private Optional<FAQ> findFAQ(ChatSession session, String msg) {
        return faqRepository.findAll().stream()
                .filter(faq -> {
                    boolean roleMatch = "ALL".equalsIgnoreCase(faq.getTargetRole())
                            || session.getUserRole().equalsIgnoreCase(faq.getTargetRole());
                    return roleMatch && msg.contains(faq.getKeyword().toLowerCase());
                })
                .findFirst();
    }

    private String getQuestionForStep(String intent, String stepId) {
        if ("WAIT_MSG".equals(stepId))
            return "Please wait for a moment.";

        return chatFlowRepository.findByIntentAndStepId(intent, stepId)
                .map(ChatFlow::getQuestion)
                .orElse("Please continue.");
    }

    // Helper Class
    class BotResponse {
        String text;
        String options;
        String payload;

        public BotResponse(String text, String options, String payload) {
            this.text = text;
            this.options = options;
            this.payload = payload;
        }
    }

    private void resetSessionState(ChatSession session) {
        session.setCurrentIntent(null);
        session.setCurrentStepId(null);
        chatSessionRepository.save(session);
    }

    public List<ChatMessage> getChatHistory(UUID sessionId) {
        return chatMessageRepository.findBySessionIdOrderBySentAtAsc(sessionId);
    }

    @Transactional
    public void closeSession(UUID sessionId) {
        ChatSession session = chatSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
        session.setActive(false);
        chatSessionRepository.save(session);
    }
}
