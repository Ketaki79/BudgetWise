package com.budgetwise.controller;

import com.budgetwise.model.Transaction;
import com.budgetwise.service.TransactionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    // CREATE
    @PostMapping
    public ResponseEntity<Transaction> addTransaction(@RequestBody Transaction transaction, Authentication auth) {
        transaction.setUserEmail(auth.getName()); // use logged-in email
        Transaction saved = transactionService.add(transaction);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // GET ALL TRANSACTIONS for logged-in user
    @GetMapping
    public ResponseEntity<List<Transaction>> getAllTransactions(Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String email = auth.getName();
        List<Transaction> transactions = transactionService.getByUserEmail(email);
        return ResponseEntity.ok(transactions);
    }

    // GET TRANSACTION BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Transaction> getById(@PathVariable Long id) {
        Optional<Transaction> t = transactionService.getById(id);
        return t.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<Transaction> updateTransaction(@PathVariable Long id, @RequestBody Transaction transaction, Authentication auth) {
        transaction.setId(id);
        transaction.setUserEmail(auth.getName());
        return transactionService.update(transaction)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable Long id) {
        boolean deleted = transactionService.delete(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
