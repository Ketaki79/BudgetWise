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
    private String apiUrl; // e.g., https://openrouter.ai/api/v1/chat/completions

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    private final int FREE_PLAN_MAX_TOKENS = 285; // free plan token limit

    public String askOpenRouter(String prompt) {
        try {
            String safeApiKey = Objects.requireNonNull(apiKey, "OpenRouter API key must not be null");
            String safePrompt = Objects.requireNonNull(prompt, "Prompt must not be null");

            // Truncate prompt if too long
            if (safePrompt.length() > 2000) { 
                safePrompt = safePrompt.substring(safePrompt.length() - 2000);
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(safeApiKey);

            String requestBody = """
            {
              "model": "openai/gpt-4",
              "messages": [
                {"role": "system", "content": "You are a concise, friendly financial assistant."},
                {"role": "user", "content": "%s"}
              ],
              "temperature": 0.7,
              "max_tokens": %d
            }
            """.formatted(safePrompt.replace("\"", "\\\""), FREE_PLAN_MAX_TOKENS);

            HttpEntity<String> request = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(
                    Objects.requireNonNull(apiUrl, "OpenRouter API URL must not be null"),
                    request,
                    String.class
            );

            JsonNode root = objectMapper.readTree(response.getBody());

            return root.path("choices")
                    .get(0)
                    .path("message")
                    .path("content")
                    .asText();

        } catch (Exception e) {
            e.printStackTrace();
            // Fallback if free plan exceeded or error occurs
            return "AI could not generate a full response due to free plan limits. Try asking shorter questions or upgrade your plan.";
        }
    }
}