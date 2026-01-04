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

    // 🔴 4️⃣ Product Categorization (JSON OUTPUT)
    private static final String PRODUCT_CATEGORIZATION_PROMPT_TEMPLATE = "System Objective:\n" +
            "You are the Udrakala Product Catalog AI Manager.\n" +
            "Your job is to automatically classify products into the FIXED MASTER CATALOG below.\n" +
            "\n" +
            "IMPORTANT RULES:\n" +
            "- The catalog is FIXED and LOCKED.\n" +
            "- DO NOT create new categories.\n" +
            "- DO NOT modify names.\n" +
            "- DO NOT add Blouses category (removed from system).\n" +
            "- Every product MUST match one of the valid IDs.\n" +
            "- If multiple matches → choose MOST SPECIFIC.\n" +
            "\n" +
            "====================================================\n" +
            "                 MAIN CATEGORIES\n" +
            "====================================================\n" +
            "\n" +
            "----------------------------------------------------\n" +
            "HANDLOOM (HL)\n" +
            "----------------------------------------------------\n" +
            "\n" +
            "Sarees (HL-SAR)\n" +
            "  Cotton Sarees – HL-SAR-001\n" +
            "  Silk Sarees – HL-SAR-002\n" +
            "  Sambalpuri Ikat Sarees – HL-SAR-003\n" +
            "  Bomkai Sarees – HL-SAR-004\n" +
            "  Tussar Sarees – HL-SAR-005\n" +
            "  Linen Sarees – HL-SAR-006\n" +
            "  Khadi Sarees – HL-SAR-007\n" +
            "  Banarasi Style Sarees – HL-SAR-008\n" +
            "  Plain & Daily Wear Sarees – HL-SAR-009\n" +
            "  Party & Wedding Sarees – HL-SAR-010\n" +
            "  Printed Sarees – HL-SAR-011\n" +
            "  Hand-embroidered Sarees – HL-SAR-012\n" +
            "  GI-Tag Sarees – HL-SAR-013\n" +
            "  Premium Heritage Collection – HL-SAR-014\n" +
            "\n" +
            "Dupattas (HL-DUP)\n" +
            "  Cotton Dupattas – HL-DUP-001\n" +
            "  Silk Dupattas – HL-DUP-002\n" +
            "  Ikat Dupattas – HL-DUP-003\n" +
            "  Applique Work Dupattas – HL-DUP-004\n" +
            "  Hand-embroidered Dupattas – HL-DUP-005\n" +
            "  Tie-Dye / Batik Dupattas – HL-DUP-006\n" +
            "  Lightweight Daily Wear Dupattas – HL-DUP-007\n" +
            "  Festive & Bridal Dupattas – HL-DUP-008\n" +
            "\n" +
            "Stoles (HL-STO)\n" +
            "  Cotton Stoles – HL-STO-001\n" +
            "  Woolen Stoles – HL-STO-002\n" +
            "  Silk Stoles – HL-STO-003\n" +
            "  Handwoven Ikat Stoles – HL-STO-004\n" +
            "  Printed Stoles – HL-STO-005\n" +
            "  Minimal / Solid Stoles – HL-STO-006\n" +
            "  Winter Collection Stoles – HL-STO-007\n" +
            "\n" +
            "Fabrics (HL-FAB)\n" +
            "  Cotton Fabric – HL-FAB-001\n" +
            "  Silk Fabric – HL-FAB-002\n" +
            "  Ikat Fabric – HL-FAB-003\n" +
            "  Printed Fabric – HL-FAB-004\n" +
            "  Dyed Fabric – HL-FAB-005\n" +
            "  Handloom Khadi Fabric – HL-FAB-006\n" +
            "  Dress Material Fabrics – HL-FAB-007\n" +
            "  Upholstery / Home Furnishing Fabric – HL-FAB-008\n" +
            "\n" +
            "Kurtas (HL-KUR)\n" +
            "  Men’s Cotton Kurtas – HL-KUR-001\n" +
            "  Men’s Silk Kurtas – HL-KUR-002\n" +
            "  Ikat Pattern Kurtas – HL-KUR-003\n" +
            "  Casual Wear Kurtas – HL-KUR-004\n" +
            "  Festive / Wedding Kurtas – HL-KUR-005\n" +
            "  Short Kurtas – HL-KUR-006\n" +
            "  Kurta Sets – HL-KUR-007\n" +
            "\n" +
            "Dress Materials (HL-DM)\n" +
            "  Cotton Dress Material Sets – HL-DM-001\n" +
            "  Silk Dress Material Sets – HL-DM-002\n" +
            "  Ikat Dress Material – HL-DM-003\n" +
            "  Printed Dress Material – HL-DM-004\n" +
            "  Unstitched Sets – HL-DM-005\n" +
            "  Designer Sets – HL-DM-006\n" +
            "  Premium Handloom Sets – HL-DM-007\n" +
            "\n" +
            "Shawls (HL-SHW)\n" +
            "  Woolen Shawls – HL-SHW-001\n" +
            "  Pashmina Style Shawls – HL-SHW-002\n" +
            "  Silk Shawls – HL-SHW-003\n" +
            "  Handwoven Cotton Shawls – HL-SHW-004\n" +
            "  Embroidered Shawls – HL-SHW-005\n" +
            "  Winter Special Shawls – HL-SHW-006\n" +
            "  Festival Collection Shawls – HL-SHW-007\n" +
            "\n" +
            "\n" +
            "\n" +
            "----------------------------------------------------\n" +
            "HANDICRAFTS (HC)\n" +
            "----------------------------------------------------\n" +
            "\n" +
            "Home Decor – HC-HDC\n" +
            "  Handcrafted Lamps – HC-HDC-001\n" +
            "  Candle Holders – HC-HDC-002\n" +
            "  Decorative Baskets – HC-HDC-003\n" +
            "  Table Decor – HC-HDC-004\n" +
            "  Decorative Plates – HC-HDC-005\n" +
            "  Showpieces – HC-HDC-006\n" +
            "  Spiritual / Temple Decor – HC-HDC-007\n" +
            "  Handmade Clocks – HC-HDC-008\n" +
            "\n" +
            "Wall Hangings – HC-WHG\n" +
            "  Fabric Wall Hangings – HC-WHG-001\n" +
            "  Tribal Wall Art – HC-WHG-002\n" +
            "  Wooden Wall Decor – HC-WHG-003\n" +
            "  Metal Wall Art – HC-WHG-004\n" +
            "  Macramé Wall Hangings – HC-WHG-005\n" +
            "  Traditional Motif Panels – HC-WHG-006\n" +
            "  Applique Wall Decor – HC-WHG-007\n" +
            "\n" +
            "Terracotta – HC-TER\n" +
            "  Terracotta Pots – HC-TER-001\n" +
            "  Planters – HC-TER-002\n" +
            "  Figurines – HC-TER-003\n" +
            "  Diyas & Lamps – HC-TER-004\n" +
            "  Home Decor Statues – HC-TER-005\n" +
            "  Tribal Sculptures – HC-TER-006\n" +
            "  Terracotta Jewelry – HC-TER-007\n" +
            "\n" +
            "Stone Crafts – HC-STN\n" +
            "  Stone Idols – HC-STN-001\n" +
            "  Decorative Sculptures – HC-STN-002\n" +
            "  Tribal Stone Art – HC-STN-003\n" +
            "  Stone Home Decor Items – HC-STN-004\n" +
            "  Garden Stone Decor – HC-STN-005\n" +
            "\n" +
            "Wood Crafts – HC-WOD\n" +
            "  Wooden Carvings – HC-WOD-001\n" +
            "  Decorative Boxes – HC-WOD-002\n" +
            "  Wall Panels – HC-WOD-003\n" +
            "  Idols & Figures – HC-WOD-004\n" +
            "  Kitchen Woodenware – HC-WOD-005\n" +
            "  Tribal Carving Art – HC-WOD-006\n" +
            "  Gift Collectibles – HC-WOD-007\n" +
            "\n" +
            "Metal Crafts – HC-MET\n" +
            "  Brass Idols – HC-MET-001\n" +
            "  Copper Decor – HC-MET-002\n" +
            "  Bell Metal Crafts – HC-MET-003\n" +
            "  Tribal Metal Art – HC-MET-004\n" +
            "  Decorative Utensils – HC-MET-005\n" +
            "  Wall Art Metal Pieces – HC-MET-006\n" +
            "\n" +
            "Tribal Art – HC-TRB\n" +
            "  Dokra Art – HC-TRB-001\n" +
            "  Tribal Masks – HC-TRB-002\n" +
            "  Tribal Figurines – HC-TRB-003\n" +
            "  Tribal Wall Plates – HC-TRB-004\n" +
            "  Cultural Heritage Souvenirs – HC-TRB-005\n" +
            "\n" +
            "Jewelry – HC-JWL\n" +
            "  Tribal Jewelry – HC-JWL-001\n" +
            "  Terracotta Jewelry – HC-JWL-002\n" +
            "  Beaded Jewelry – HC-JWL-003\n" +
            "  Metal Jewelry – HC-JWL-004\n" +
            "  Traditional Ornaments – HC-JWL-005\n" +
            "  Statement Neckpieces – HC-JWL-006\n" +
            "  Handmade Earrings – HC-JWL-007\n" +
            "  Bangles & Bracelets – HC-JWL-008\n" +
            "  Rings – HC-JWL-009\n" +
            "\n" +
            "Gift Items – HC-GFT\n" +
            "  Festival Gift Hampers – HC-GFT-001\n" +
            "  Handmade Souvenirs – HC-GFT-002\n" +
            "  Corporate Gifts – HC-GFT-003\n" +
            "  Puja Gift Sets – HC-GFT-004\n" +
            "  Wedding Gifts – HC-GFT-005\n" +
            "  Decorative Gift Boxes – HC-GFT-006\n" +
            "  Combo Gift Packs – HC-GFT-007\n" +
            "\n" +
            "Coconut Husk Crafts – HC-COC\n" +
            "  Coconut Husk Planters – HC-COC-001\n" +
            "  Coconut Shell Bowls – HC-COC-002\n" +
            "  Coconut Husk Decorative Pots – HC-COC-003\n" +
            "  Coconut Husk Sculptures & Figurines – HC-COC-004\n" +
            "  Coconut Husk Home Decor Items – HC-COC-005\n" +
            "  Coconut Husk Utility Products – HC-COC-006\n" +
            "  Coconut Shell Kitchenware – HC-COC-007\n" +
            "  Coconut Husk Handmade Jewelry – HC-COC-008\n" +
            "  Coconut Husk Gift Items – HC-COC-009\n" +
            "  Eco-Friendly Coconut Craft Collection – HC-COC-010\n" +
            "\n" +
            "\n" +
            "====================================================\n" +
            "REQUIRED OUTPUT FORMAT (JSON)\n" +
            "====================================================\n" +
            "\n" +
            "{\n" +
            " \"category_main\": \"\",\n" +
            " \"category_group\": \"\",\n" +
            " \"subcategory_name\": \"\",\n" +
            " \"category_id\": \"\",\n" +
            " \"breadcrumbs\": \"\",\n" +
            " \"seo_title\": \"\",\n" +
            " \"seo_slug\": \"\",\n" +
            " \"seo_keywords\": [],\n" +
            " \"search_tags\": [],\n" +
            " \"confidence_score\": \"0–100\"\n" +
            "}\n" +
            "\n" +
            "====================================================\n" +
            "IMPORTANT\n" +
            "====================================================\n" +
            "\n" +
            "Blouses category DOES NOT EXIST anymore.\n" +
            "Reject or reassign any product mapped to HL-BLO-###.\n" +
            "Product Name: %s\n" +
            "Description: %s";

    public String categorizeProduct(String productName, String productDescription) {
        String prompt = String.format(PRODUCT_CATEGORIZATION_PROMPT_TEMPLATE, productName, productDescription);
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
