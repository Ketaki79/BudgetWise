package com.budgetwise.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "otp_verification")
public class OtpVerification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;
    private String otp;
    private boolean used = false;
    private LocalDateTime expiryTime;

    // getters & setters
    public String getEmail() { return email; }
    public String getOtp() { return otp; }
    public boolean isUsed() { return used; }
    public LocalDateTime getExpiryTime() { return expiryTime; }

    public void setEmail(String email) { this.email = email; }
    public void setOtp(String otp) { this.otp = otp; }
    public void setUsed(boolean used) { this.used = used; }
    public void setExpiryTime(LocalDateTime expiryTime) { this.expiryTime = expiryTime; }
}
