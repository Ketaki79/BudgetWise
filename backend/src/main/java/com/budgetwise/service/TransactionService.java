package com.budgetwise.service;

import com.budgetwise.model.Transaction;
import com.budgetwise.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class TransactionService {

    private final TransactionRepository repository;

    public TransactionService(TransactionRepository repository) {
        if (repository == null) throw new IllegalArgumentException("TransactionRepository cannot be null");
        this.repository = repository;
    }

    // -------------------
    // ADD
    // -------------------
    public Transaction add(Transaction transaction) {
        if (transaction == null) throw new IllegalArgumentException("Transaction cannot be null");
        return repository.save(transaction);
    }

    // -------------------
    // GET BY USER EMAIL
    // -------------------
    public List<Transaction> getByUserEmail(String email) {
        if (email == null) throw new IllegalArgumentException("User email cannot be null");

        // Convert reserved → expense if date arrived
        convertMaturedReserved(email);

        return repository.findByUserEmail(email);
    }

    // -------------------
    // GET BY ID
    // -------------------
    public Optional<Transaction> getById(Long id) {
        if (id == null) throw new IllegalArgumentException("Transaction ID cannot be null");
        return repository.findById(id);
    }

    // -------------------
    // DELETE
    // -------------------
    public boolean delete(Long id) {
        if (id == null) throw new IllegalArgumentException("Transaction ID cannot be null");
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }

    // -------------------
    // UPDATE
    // -------------------
    public Optional<Transaction> update(Transaction updated) {
        if (updated == null) throw new IllegalArgumentException("Updated transaction cannot be null");
        Long id = updated.getId();
        if (id == null) throw new IllegalArgumentException("Transaction ID cannot be null");

        return repository.findById(id).map(existing -> {
            existing.setDate(updated.getDate());
            existing.setTitle(updated.getTitle());
            existing.setCategory(updated.getCategory());
            existing.setAmount(updated.getAmount());
            existing.setType(updated.getType());
            existing.setDescription(updated.getDescription());
            existing.setUserEmail(updated.getUserEmail());
            existing.setReserved(updated.isReserved());

            // Keep type as "reserved" if reserved
            if (updated.isReserved()) existing.setType("reserved");

            return repository.save(existing);
        });
    }

    // -------------------
    // CONVERT RESERVED → EXPENSE
    // -------------------
    private void convertMaturedReserved(String email) {
        List<Transaction> reservedList = repository.findByUserEmailAndType(email, "reserved");
        LocalDate today = LocalDate.now();

        for (Transaction tx : reservedList) {
            if (tx.getDate() != null && !tx.getDate().isAfter(today)) {
                tx.setType("expense");
                tx.setReserved(false); // no longer reserved
                repository.save(tx);
            }
        }
    }
}
