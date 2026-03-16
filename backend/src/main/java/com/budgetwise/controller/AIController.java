package com.budgetwise.controller;

import com.budgetwise.model.Transaction;
import com.budgetwise.model.User;
import com.budgetwise.repository.TransactionRepository;
import com.budgetwise.repository.UserRepository;
import com.budgetwise.service.OpenRouterService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.Month;
import java.util.*;
import java.util.stream.Collectors;

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
    public ResponseEntity<?> askAI(@RequestBody Map<String, String> request,
                                   Authentication authentication) {

        String question = request.get("question");

        if (question == null || question.trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Question cannot be empty"));
        }

        String email = authentication.getName();

        User user = userRepository.findByEmail(email);

        if (user == null) {
            return ResponseEntity.status(404)
                    .body(Map.of("error", "User not found"));
        }

        List<Transaction> transactions =
                transactionRepository.findByUserEmail(user.getEmail());

        double totalIncome = 0;
        double totalExpense = 0;
        double reservedSavings = 0;

        Map<String, Double> categoryExpenses = new HashMap<>();
        Map<String, Double> monthlyExpenses = new HashMap<>();

        for (Transaction t : transactions) {

            if (t.getAmount() == null) continue;

            double amount = t.getAmount();

            // ===== INCOME =====
            if ("income".equalsIgnoreCase(t.getType())) {

                totalIncome += amount;

                if (t.isReserved()) {
                    reservedSavings += amount;
                }
            }

            // ===== EXPENSE =====
            if ("expense".equalsIgnoreCase(t.getType())) {

                totalExpense += amount;

                if (t.getCategory() != null) {
                    categoryExpenses.put(
                            t.getCategory(),
                            categoryExpenses.getOrDefault(t.getCategory(), 0.0) + amount
                    );
                }

                if (t.getDate() != null) {

                    String month =
                            Month.of(t.getDate().getMonthValue()).name();

                    monthlyExpenses.put(
                            month,
                            monthlyExpenses.getOrDefault(month, 0.0) + amount
                    );
                }
            }
        }

        // ✅ Correct dashboard balance
        double balance = totalIncome - totalExpense;

        String categoryBreakdown = categoryExpenses.isEmpty()
                ? "No expenses recorded"
                : categoryExpenses.entrySet()
                .stream()
                .map(e -> e.getKey() + " ₹" + e.getValue())
                .collect(Collectors.joining(", "));

        String monthlyBreakdown = monthlyExpenses.isEmpty()
                ? "No monthly spending recorded"
                : monthlyExpenses.entrySet()
                .stream()
                .map(e -> e.getKey() + " ₹" + e.getValue())
                .collect(Collectors.joining(", "));

        String highestCategory = categoryExpenses.entrySet()
                .stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("None");

        String prompt = """
User Question: %s

User Financial Data

Total Income: ₹%.2f
Total Expenses: ₹%.2f
Reserved Savings: ₹%.2f
Available Balance: ₹%.2f

Highest Spending Category: %s

Expense by Category:
%s

Monthly Spending:
%s

Instructions:
You are a friendly AI Financial Advisor for the BudgetWise app.

Respond in plain text.

Rules:
- Do NOT use markdown symbols like **, ##, *, _
- Do NOT use headings with #
- Use simple sentences
- Use "-" for bullet points if needed
- Give practical financial advice based on the user's data
- Keep response under 180 words
- End with a complete sentence.
""".formatted(
                question,
                totalIncome,
                totalExpense,
                reservedSavings,
                balance,
                highestCategory,
                categoryBreakdown,
                monthlyBreakdown
        );

        String aiResponse = openRouterService.askOpenRouter(prompt);

        return ResponseEntity.ok(Map.of("response", aiResponse));
    }
}