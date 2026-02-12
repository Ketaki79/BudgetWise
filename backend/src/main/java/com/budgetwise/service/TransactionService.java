package com.budgetwise.service;

import com.budgetwise.model.Transaction;
import com.budgetwise.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class TransactionService {

    private final TransactionRepository repository;

    public TransactionService(TransactionRepository repository) {
        this.repository = Objects.requireNonNull(repository, "TransactionRepository cannot be null");
    }

    public Transaction add(Transaction t) {
        Objects.requireNonNull(t, "Transaction cannot be null");
        return repository.save(t);
    }

    public List<Transaction> getByUserEmail(String email) {
        Objects.requireNonNull(email, "User email cannot be null");
        return repository.findByUserEmail(email);
    }

    public Optional<Transaction> getById(Long id) {
        Objects.requireNonNull(id, "Transaction ID cannot be null");
        return repository.findById(id);
    }

    public boolean delete(Long id) {
        Objects.requireNonNull(id, "Transaction ID cannot be null");
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }


    @SuppressWarnings("null")
    public Optional<Transaction> update(Transaction updated) {
        Objects.requireNonNull(updated, "Updated transaction cannot be null");
        Objects.requireNonNull(updated.getId(), "Transaction ID cannot be null");

        return repository.findById(updated.getId())
                .map(existing -> {
                    existing.setDate(updated.getDate());
                    existing.setTitle(updated.getTitle());
                    existing.setCategory(updated.getCategory());
                    existing.setAmount(updated.getAmount());
                    existing.setType(updated.getType());
                    existing.setDescription(updated.getDescription());
                    existing.setUserEmail(updated.getUserEmail());
                    return repository.save(existing);
                });
    }
}
