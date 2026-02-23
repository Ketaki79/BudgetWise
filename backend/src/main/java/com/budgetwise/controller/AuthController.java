package com.budgetwise.controller;

import com.budgetwise.model.User;
import com.budgetwise.repository.UserRepository;
import com.budgetwise.security.JwtUtil;
import com.budgetwise.service.OtpService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired private UserRepository userRepository;
    @Autowired private OtpService otpService;
    @Autowired private BCryptPasswordEncoder passwordEncoder;
    @Autowired private AuthenticationManager authenticationManager;
    @Autowired private JwtUtil jwtUtil;

    // ================= REGISTER =================
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User request) {

        if (request == null)
            return ResponseEntity.badRequest().body("Invalid request");

        String username = request.getUsername();
        String email = request.getEmail();
        String password = request.getPassword();

        if (username == null || email == null || password == null)
            return ResponseEntity.badRequest().body("All fields are required");

        email = email.toLowerCase().trim();

        if (userRepository.findByEmail(email) != null)
            return ResponseEntity.badRequest().body("Email already registered");

        User user = new User();
        user.setUsername(username.trim());
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setVerified(false);
        user.setLoggedIn(false);

        userRepository.save(user);

        // Send OTP (saved in OTP table)
        otpService.sendOtp(email);

        return ResponseEntity.ok("Registration successful. OTP sent.");
    }

    // ================= VERIFY OTP =================
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestParam String email,
                                       @RequestParam String otpInput) {

        email = email.toLowerCase().trim();

        User user = userRepository.findByEmail(email);

        if (user == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not found");

        boolean isValid = otpService.verifyOtp(email, otpInput);

        if (!isValid)
            return ResponseEntity.badRequest()
                    .body("Invalid or expired OTP");

        user.setVerified(true);
        userRepository.save(user);

        return ResponseEntity.ok("Email verified successfully");
    }

    // ================= RESEND OTP =================
    @PostMapping("/resend-otp")
    public ResponseEntity<?> resendOtp(@RequestParam String email) {

        email = email.toLowerCase().trim();

        User user = userRepository.findByEmail(email);

        if (user == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not found");

        otpService.sendOtp(email);

        return ResponseEntity.ok("OTP resent successfully");
    }

    // ================= LOGIN =================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> data) {

        String email = data.get("email");
        String password = data.get("password");

        if (email == null || password == null)
            return ResponseEntity.badRequest()
                    .body("Email and password required");

        email = email.toLowerCase().trim();
        User user = userRepository.findByEmail(email);

        if (user == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not registered");

        if (!user.isVerified())
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Please verify your email first");

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password)
            );

            String token = jwtUtil.generateToken(email);

            user.setLoggedIn(true);
            userRepository.save(user);

            return ResponseEntity.ok(Map.of(
                    "message", "Login successful",
                    "token", token,
                    "username", user.getUsername()
            ));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid email or password");
        }
    }

    // ================= LOGOUT =================
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok("Logout successful. Please delete token on frontend.");
    }

    // ================= GET CURRENT USER =================
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Missing or invalid token");
        }

        String token = authHeader.substring(7);
        String email = jwtUtil.extractUsername(token);

        User user = userRepository.findByEmail(email);

        if (user == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not found");

        return ResponseEntity.ok(Map.of(
                "username", user.getUsername(),
                "email", user.getEmail()
        ));
    }
}