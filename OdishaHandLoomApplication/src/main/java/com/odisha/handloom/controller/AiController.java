package com.odisha.handloom.controller;

import com.odisha.handloom.service.AiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AiController {

    private final AiService aiService;

    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/product/description")
    public ResponseEntity<String> generateProductDescription(@RequestBody Map<String, String> request) {
        String title = request.get("title");
        String features = request.get("features");
        String language = request.getOrDefault("language", "English");

        String result = aiService.generateProductDescription(title, features, language);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/reels/script")
    public ResponseEntity<String> generateReelScript(@RequestBody Map<String, String> request) {
        String productName = request.get("productName");
        String targetAudience = request.get("targetAudience");
        String platform = request.getOrDefault("platform", "Instagram");

        String result = aiService.generateReelScript(productName, targetAudience, platform);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/comment/reply")
    public ResponseEntity<String> generateCommentReply(@RequestBody Map<String, String> request) {
        String comment = request.get("comment");
        String context = request.get("context");

        String result = aiService.generateCommentReply(comment, context);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/product/categorize")
    public ResponseEntity<String> categorizeProduct(@RequestBody Map<String, String> request) {
        String title = request.get("title");
        String description = request.get("description");

        String result = aiService.categorizeProduct(title, description); // Uses the new categorization prompt
        return ResponseEntity.ok(result);
    }
}
