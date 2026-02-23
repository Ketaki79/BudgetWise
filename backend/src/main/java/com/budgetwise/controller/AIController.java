package com.budgetwise.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.budgetwise.model.Transaction;
import com.budgetwise.model.User;
import com.budgetwise.repository.TransactionRepository;
import com.budgetwise.repository.UserRepository;
import com.budgetwise.service.OpenRouterService;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:5173")
public class AIController {

    private final OpenRouterService openRouterService;
    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;

    public AIController(OpenRouterService openRouterService,
                        UserRepository userRepository,
                        TransactionRepository transactionRepository) {
        this.openRouterService = openRouterService;
        this.userRepository = userRepository;
        this.transactionRepository = transactionRepository;
    }

    @PostMapping("/ask")
    public ResponseEntity<?> chat(@RequestBody Map<String, String> request,
                                  Authentication authentication) {

        String message = request.get("question");

        if (message == null || message.trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Question cannot be empty"));
        }

        String email = authentication.getName();
        User user = userRepository.findByEmail(email);

        if (user == null) {
            return ResponseEntity.status(404)
                    .body(Map.of("error", "User not found"));
        }

        List<Transaction> transactions = transactionRepository.findByUserEmail(user.getEmail());

        // --- Short Dashboard summary for AI prompt ---
        double totalIncome = transactions.stream()
                .filter(t -> "income".equals(t.getType()) && !t.isReserved())
                .mapToDouble(t -> t.getAmount()).sum();

        double reservedSavings = transactions.stream()
                .filter(t -> "income".equals(t.getType()) && t.isReserved())
                .mapToDouble(t -> t.getAmount()).sum();

        double totalExpenses = transactions.stream()
                .filter(t -> "expense".equals(t.getType()))
                .mapToDouble(t -> t.getAmount()).sum() +
                transactions.stream()
                .filter(t -> "income".equals(t.getType()) && t.isReserved())
                .mapToDouble(t -> t.getAmount()).sum();

        double totalBalance = totalIncome - totalExpenses;

        String prompt = """
User: %s
Dashboard Summary:
- Total Income: ₹%.2f
- Reserved Savings: ₹%.2f
- Total Expenses: ₹%.2f
- Total Balance: ₹%.2f
Instructions: Provide short, actionable, friendly advice based on this data.
""".formatted(message, totalIncome, reservedSavings, totalExpenses, totalBalance);

        String aiResponse = openRouterService.askOpenRouter(prompt);

        return ResponseEntity.ok(Map.of("response", aiResponse));
    }
}