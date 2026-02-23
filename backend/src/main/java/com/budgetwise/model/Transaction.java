package com.budgetwise.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date;

    // income, expense, reserved
    private String type;

    private String title;

    private String category;

    private Double amount;

    @Column(length = 500)
    private String description;

    @Column(name = "user_email")
    private String userEmail;

    private boolean reserved = false;  // ✅ Reserved flag

    // Constructors
    public Transaction() {}

    public Transaction(LocalDate date, String type, String title,
                       String category, Double amount,
                       String description, String userEmail,
                       boolean reserved) {
        this.date = date;
        this.type = type;
        this.title = title;
        this.category = category;
        this.amount = amount;
        this.description = description;
        this.userEmail = userEmail;
        this.reserved = reserved;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public boolean isReserved() { return reserved; }
    public void setReserved(boolean reserved) { this.reserved = reserved; }
}
