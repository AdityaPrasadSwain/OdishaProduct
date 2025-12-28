package com.odisha.handloom.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import java.util.Map;
import java.util.List;

@Service
public class AiService {

    @Value("${ai.ollama.base-url}")
    private String ollamaUrl;

    @Value("${ai.ollama.model}")
    private String ollamaModel;

    private final RestTemplate restTemplate;

    // 1️⃣ Comment Reply – ONLY 5 WORDS (with emojis allowed)
    private static final String COMMENT_REPLY_PROMPT_TEMPLATE = "You are replying to a customer comment for UdraKala handloom products.\n"
            +
            "\n" +
            "Strict Rules:\n" +
            "1. Analyze the comment and reply with a handy answer.\n" +
            "2. Reply MUST be EXACTLY 5 words long.\n" +
            "3. You MUST include the brand name 'UdraKala' in the reply.\n" +
            "4. Use simple Odia language.\n" +
            "5. Include 1-2 Emojis.\n" +
            "6. Output ONLY the reply text, no explanations.\n" +
            "\n" +
            "Customer said:\n" +
            "%s";

    // 🟣 2️⃣ Product Description – 80–120 Words (with emojis allowed)
    private static final String PRODUCT_DESCRIPTION_PROMPT_TEMPLATE = "You are creating ecommerce product content for UdraKala – an authentic handloom marketplace from Odisha.\n"
            +
            "\n" +
            "Write ONLY:\n" +
            "• 1 short Odia caption (you MAY use emojis)\n" +
            "• 1 English product description of 80–120 words (you MAY use emojis)\n" +
            "• 10 SEO hashtags\n" +
            "\n" +
            "Tone:\n" +
            "• Warm\n" +
            "• Honest\n" +
            "• Cultural\n" +
            "• No hype\n" +
            "• No AI mention\n" +
            "\n" +
            "Content must include:\n" +
            "• Tradition\n" +
            "• Heritage\n" +
            "• Authenticity\n" +
            "• Comfort\n" +
            "• Handloom weaving context\n" +
            "\n" +
            "Brand name to mention once:\n" +
            "UdraKala\n" +
            "\n" +
            "Input product details:\n" +
            "Name: %s\n" +
            "Features: %s";

    // 🔵 3️⃣ Reel / Script Text – Short & Engaging (with emojis)
    private static final String REEL_SCRIPT_PROMPT_TEMPLATE = "Create short reel text for UdraKala handloom products.\n"
            +
            "\n" +
            "Write:\n" +
            "• 1–2 Odia lines with emojis\n" +
            "• 40–60 word English reel script with emojis\n" +
            "• 8 SEO hashtags\n" +
            "\n" +
            "Tone:\n" +
            "• Cultural\n" +
            "• Soulful\n" +
            "• Natural\n" +
            "• Respectful to weavers\n" +
            "• Storytelling vibe\n" +
            "\n" +
            "Input:\n" +
            "Product: %s\n" +
            "Audience: %s\n" +
            "Platform: %s";

    public AiService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String generateProductDescription(String title, String features, String language) {
        String prompt = String.format(PRODUCT_DESCRIPTION_PROMPT_TEMPLATE, title, features);
        return callAiApi(prompt);
    }

    public String generateReelScript(String productName, String targetAudience, String platform) {
        String prompt = String.format(REEL_SCRIPT_PROMPT_TEMPLATE, productName, targetAudience, platform);
        return callAiApi(prompt);
    }

    public String generateCommentReply(String comment, String context) {
        // Combining comment and context if needed, or just using comment as per master
        // prompt structure which asks for "Customer Message".
        // The master prompt only has {{customerMessage}}. I will treat 'comment' as
        // that.
        // 'context' is ignored or could be appended if essential, but user said "Use
        // these exact prompts".
        // The user input has `{{customerMessage}}` so I'll just map `comment` to it.
        String prompt = String.format(COMMENT_REPLY_PROMPT_TEMPLATE, comment);
        return callAiApi(prompt);
    }

    private String callAiApi(String prompt) {
        try {
            // Ollama API request structure
            Map<String, Object> body = Map.of(
                    "model", ollamaModel,
                    "prompt", prompt,
                    "stream", false,
                    "options", Map.of(
                            "num_ctx", 1024,
                            "top_k", 20,
                            "top_p", 0.9,
                            "temperature", 0.6));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

            // Post to Ollama
            Map response = restTemplate.postForObject(ollamaUrl, entity, Map.class);

            return extractTextFromResponse(response);

        } catch (Exception e) {
            e.printStackTrace();
            return "Error calling AI service (Ollama): " + e.getMessage();
        }
    }

    private String extractTextFromResponse(Map responseBody) {
        try {
            if (responseBody == null) {
                return "No response from AI";
            }

            // Ollama returns "response" field
            if (responseBody.containsKey("response")) {
                return responseBody.get("response").toString();
            } else {
                return "Unexpected response format: " + responseBody;
            }

        } catch (Exception e) {
            return "Error parsing AI response: " + e.getMessage();
        }
    }
}
