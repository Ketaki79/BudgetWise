package com.budgetwise.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Objects;

@Service
public class OpenRouterService {

    @Value("${openrouter.api.key}")
    private String apiKey;

    @Value("${openrouter.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    // Safe token limit for free plan
    private final int MAX_TOKENS = 350;

    public String askOpenRouter(String prompt) {

        try {

            String safeApiKey = Objects.requireNonNull(apiKey, "OpenRouter API key must not be null");
            String safePrompt = Objects.requireNonNull(prompt, "Prompt must not be null");

            // Limit prompt size
            if (safePrompt.length() > 2000) {
                safePrompt = safePrompt.substring(safePrompt.length() - 2000);
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(safeApiKey);

            String systemPrompt = """
You are a helpful AI Financial Advisor for a budgeting app called BudgetWise.

Rules:
- Respond in clean plain text.
- Do NOT use markdown symbols like ** or ##.
- Keep answers short and clear.
- Always end with a complete sentence.
- Maximum 180 words.
""";

            String requestBody = """
            {
              "model": "openai/gpt-4o-mini",
              "messages": [
                {"role": "system", "content": "%s"},
                {"role": "user", "content": "%s"}
              ],
              "temperature": 0.6,
              "max_tokens": %d
            }
            """.formatted(
                    systemPrompt.replace("\"", "\\\""),
                    safePrompt.replace("\"", "\\\""),
                    MAX_TOKENS
            );

            HttpEntity<String> request = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(
                    Objects.requireNonNull(apiUrl),
                    request,
                    String.class
            );

            String responseBody = Objects.requireNonNull(response.getBody());

            JsonNode root = objectMapper.readTree(responseBody);

            String aiResponse = root.path("choices")
                    .get(0)
                    .path("message")
                    .path("content")
                    .asText();

            // Clean markdown symbols
            aiResponse = aiResponse
                    .replace("**", "")
                    .replace("##", "");

            // Ensure sentence completion
            if (!aiResponse.trim().endsWith(".")) {
                aiResponse = aiResponse.trim() + ".";
            }

            return aiResponse;

        } catch (Exception e) {
            e.printStackTrace();

            return "Sorry, the AI advisor could not generate a response right now. Please try again later.";
        }
    }
}