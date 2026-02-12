package com.budgetwise.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class OtpService {

    @Autowired
    private JavaMailSender mailSender;

    public String sendOtp(String email) {
        String otp = String.valueOf(100000 + new Random().nextInt(900000));

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("BudgetWise – Email Verification OTP");
        message.setFrom("no-reply@budgetwise.com"); // optional but recommended

        message.setText(
            "Dear User,\n\n" +
            "Thank you for registering with BudgetWise.\n\n" +
            "Your One-Time Password (OTP) for email verification is:\n\n" +
            otp + "\n\n" +
            "This OTP is valid for 10 minutes. Please do not share this code with anyone.\n\n" +
            "If you did not request this verification, please ignore this email.\n\n" +
            "Best regards,\n" +
            "Team BudgetWise"
        );

        mailSender.send(message);

        return otp;
    }
}
