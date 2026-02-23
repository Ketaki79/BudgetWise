package com.budgetwise.repository;

import com.budgetwise.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByUserEmail(String email);

    // For auto conversion
    List<Transaction> findByUserEmailAndType(String email, String type);
}
