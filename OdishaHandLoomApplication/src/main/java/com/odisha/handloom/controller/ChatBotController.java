package com.odisha.handloom.controller;

import com.odisha.handloom.entity.ChatMessage;
import com.odisha.handloom.entity.ChatSession;
import com.odisha.handloom.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/help/chat")
public class ChatBotController {

    @Autowired
    private ChatService chatService;

    @PostMapping("/start")
    public ResponseEntity<ChatSession> startSession() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = null;
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
            // Depending on how UserDetails maps, usually Principal is username(email)
            // But sometimes it is UserDetails object.
            // We will assume name is email for simplicity or check type
            email = auth.getName();
        }

        ChatSession session = chatService.startSession(email);
        return ResponseEntity.ok(session);
    }

    // Creating a DTO in inner class for simplicity or using Map
    @PostMapping("/send")
    public ResponseEntity<ChatMessage> sendMessage(@RequestBody Map<String, String> payload) {
        String sessionIdStr = payload.get("sessionId");
        String message = payload.get("message");

        if (sessionIdStr == null || message == null) {
            return ResponseEntity.badRequest().build();
        }

        UUID sessionId = UUID.fromString(sessionIdStr);
        ChatMessage response = chatService.processMessage(sessionId, message);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/history/{sessionId}")
    public ResponseEntity<List<ChatMessage>> getHistory(@PathVariable UUID sessionId) {
        return ResponseEntity.ok(chatService.getChatHistory(sessionId));
    }

    @PostMapping("/close")
    public ResponseEntity<Void> closeSession(@RequestBody Map<String, String> payload) {
        String sessionIdStr = payload.get("sessionId");
        if (sessionIdStr != null) {
            chatService.closeSession(UUID.fromString(sessionIdStr));
        }
        return ResponseEntity.ok().build();
    }
}
