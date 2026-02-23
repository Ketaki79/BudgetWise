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

    // -------------------
    // ADD TRANSACTION
    // -------------------
    @PostMapping
    public ResponseEntity<Transaction> addTransaction(
            @RequestBody Transaction transaction,
            Authentication auth) {

        transaction.setUserEmail(auth.getName());

        if ("reserved".equalsIgnoreCase(transaction.getType())) {
            transaction.setReserved(true);
        }

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(transactionService.add(transaction));
    }

    // -------------------
    // GET ALL TRANSACTIONS
    // -------------------
    @GetMapping
    public ResponseEntity<List<Transaction>> getAllTransactions(Authentication auth) {

        return ResponseEntity.ok(
                transactionService.getByUserEmail(auth.getName())
        );
    }

    // -------------------
    // GET BY ID
    // -------------------
    @GetMapping("/{id}")
    public ResponseEntity<Transaction> getById(@PathVariable Long id) {
        Optional<Transaction> t = transactionService.getById(id);
        return t.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // -------------------
    // UPDATE TRANSACTION
    // -------------------
    @PutMapping("/{id}")
    public ResponseEntity<Transaction> updateTransaction(
            @PathVariable Long id,
            @RequestBody Transaction transaction,
            Authentication auth) {

        transaction.setId(id);
        transaction.setUserEmail(auth.getName());

        if (transaction.isReserved()) {
            transaction.setType("reserved");
        }

        return transactionService.update(transaction)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // -------------------
    // DELETE TRANSACTION
    // -------------------
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable Long id) {
        return transactionService.delete(id)
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }
}