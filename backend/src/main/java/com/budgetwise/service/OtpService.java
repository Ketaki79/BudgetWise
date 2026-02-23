package com.budgetwise.service;

import com.budgetwise.model.OtpVerification;
import com.budgetwise.repository.OtpVerificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class OtpService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private OtpVerificationRepository otpRepository;

    // ================= SEND OTP =================
    public void sendOtp(String email) {

        String otp = String.valueOf(100000 + new Random().nextInt(900000));

        // Invalidate old OTPs
        otpRepository.findAll()
                .stream()
                .filter(o -> email.equals(o.getEmail()) && !o.isUsed())
                .forEach(o -> {
                    o.setUsed(true);
                    otpRepository.save(o);
                });

        // Save new OTP
        OtpVerification otpVerification = new OtpVerification();
        otpVerification.setEmail(email);
        otpVerification.setOtp(otp);
        otpVerification.setUsed(false);
        otpVerification.setExpiryTime(LocalDateTime.now().plusMinutes(10));

        otpRepository.save(otpVerification);

        // Send mail
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setText(
            "Dear User,\n\n" +
            "Welcome to BudgetWise! 💼📊\n\n" +
            "To complete your email verification, please use the One-Time Password (OTP) below:\n\n" +
            "🔐  OTP: " + otp + "\n\n" +
            "This OTP is valid for 10 minutes. Please do not share this code with anyone for security reasons.\n\n" +
            "If you did not request this verification, please ignore this email.\n\n" +
            "Best Regards,\n" +
            "Team BudgetWise\n" +
            "Secure • Smart • Simple"
);

            mailSender.send(message);

        } catch (MailException e) {
            throw new RuntimeException("Failed to send OTP");
        }
    }

    // ================= VERIFY OTP =================
    public boolean verifyOtp(String email, String otpInput) {

        Optional<OtpVerification> otpOptional =
                otpRepository.findByEmailAndOtpAndUsedFalse(email, otpInput);

        if (otpOptional.isEmpty())
            return false;

        OtpVerification otp = otpOptional.get();

        if (otp.getExpiryTime().isBefore(LocalDateTime.now()))
            return false;

        otp.setUsed(true);
        otpRepository.save(otp);

        return true;
    }
}