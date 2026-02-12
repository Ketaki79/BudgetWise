package com.budgetwise.controller;

import com.budgetwise.model.User;
import com.budgetwise.repository.UserRepository;
import com.budgetwise.service.OtpService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OtpService otpService;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    // ================= REGISTER =================
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User request) {

        if (request == null)
            return ResponseEntity.badRequest().body("Invalid request");

        // ===== USERNAME VALIDATION =====
        String username = request.getUsername();

        if (username == null || username.trim().isEmpty())
            return ResponseEntity.badRequest().body("Username is required");

        username = username.trim().replaceAll("\\s+", " ");

        if (username.length() < 3)
            return ResponseEntity.badRequest().body("Username must be at least 3 characters");

        if (!username.matches("^[A-Za-z ]+$"))
            return ResponseEntity.badRequest().body("Username can contain only letters and spaces");

        username = capitalizeWords(username); // ✅ Now method is used

        if (userRepository.existsByUsername(username))
            return ResponseEntity.badRequest().body("Username already taken");

        // ===== EMAIL VALIDATION =====
        String email = request.getEmail();

        if (email == null || email.trim().isEmpty())
            return ResponseEntity.badRequest().body("Email is required");

        email = email.toLowerCase().trim();

        if (!email.endsWith("@gmail.com"))
            return ResponseEntity.badRequest().body("Email must end with @gmail.com");

        if (userRepository.findByEmail(email) != null)
            return ResponseEntity.badRequest().body("Email already registered");

        // ===== PASSWORD VALIDATION =====
        if (!isValidPassword(request.getPassword()))
            return ResponseEntity.badRequest()
                    .body("Password must contain uppercase, lowercase, number & symbol (min 8 chars)");

        // ===== CREATE USER =====
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setVerified(false);
        user.setLoggedIn(false);

        userRepository.save(user);

        return ResponseEntity.ok("Registration successful. Please verify email.");
    }

    // ================= VERIFY OTP =================
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestParam String email,
                                       @RequestParam String otpInput) {

        if (email == null || otpInput == null)
            return ResponseEntity.badRequest().body("Invalid request");

        User user = userRepository.findByEmail(email.toLowerCase().trim());

        if (user == null)
            return ResponseEntity.badRequest().body("Email not found");

        if (user.getOtp() == null || !otpInput.equals(user.getOtp()))
            return ResponseEntity.badRequest().body("Wrong OTP");

        if (user.getOtpGeneratedTime() == null ||
                user.getOtpGeneratedTime().plusMinutes(10).isBefore(LocalDateTime.now()))
            return ResponseEntity.badRequest().body("OTP expired");

        user.setVerified(true);
        user.setOtp(null);
        user.setOtpGeneratedTime(null);

        userRepository.save(user);

        return ResponseEntity.ok("Email verified successfully");
    }

    // ================= LOGIN =================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> data,
                                   HttpServletRequest request) {

        if (data == null)
            return ResponseEntity.badRequest().body("Invalid request");

        String email = data.get("email");
        String password = data.get("password");

        if (email == null || password == null)
            return ResponseEntity.badRequest().body("Email and password required");

        email = email.toLowerCase().trim();

        User user = userRepository.findByEmail(email);

        if (user == null)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid email or password");

        if (!user.isVerified())
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Please verify your email first");

        try {
            Authentication authentication =
                    authenticationManager.authenticate(
                            new UsernamePasswordAuthenticationToken(email, password)
                    );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            HttpSession session = request.getSession(true);
            session.setAttribute("SPRING_SECURITY_CONTEXT",
                    SecurityContextHolder.getContext());

            user.setLoggedIn(true);
            userRepository.save(user);

            return ResponseEntity.ok(
                    Map.of(
                            "message", "Login successful",
                            "username", user.getUsername()
                    )
            );

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid email or password");
        }
    }

    // ================= GET CURRENT USER =================
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated())
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Not logged in");

        String email = authentication.getName();
        User user = userRepository.findByEmail(email);

        if (user == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not found");

        return ResponseEntity.ok(
                Map.of(
                        "username", user.getUsername(),
                        "email", user.getEmail(),
                        "loggedIn", user.isLoggedIn()
                )
        );
    }

    // ================= LOGOUT =================
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {

        HttpSession session = request.getSession(false);

        if (session != null) {

            Authentication auth = SecurityContextHolder.getContext().getAuthentication();

            if (auth != null) {
                String email = auth.getName();
                User user = userRepository.findByEmail(email);

                if (user != null) {
                    user.setLoggedIn(false);
                    userRepository.save(user);
                }
            }

            session.invalidate();
        }

        SecurityContextHolder.clearContext();

        return ResponseEntity.ok("Logged out successfully");
    }

    // ================= RESEND OTP =================
    @PostMapping("/resend-otp")
    public ResponseEntity<?> resendOtp(@RequestParam String email) {

        if (email == null || email.trim().isEmpty())
            return ResponseEntity.badRequest().body("Email is required");

        User user = userRepository.findByEmail(email.toLowerCase().trim());

        if (user == null)
            return ResponseEntity.badRequest().body("Email not found");

        String otp = otpService.sendOtp(email);
        user.setOtp(otp);
        user.setOtpGeneratedTime(LocalDateTime.now());

        userRepository.save(user);

        return ResponseEntity.ok("OTP resent successfully");
    }

    // ================= HELPER METHODS =================

    private String capitalizeWords(String str) {
        String[] words = str.split(" ");
        StringBuilder capitalized = new StringBuilder();
        for (String word : words) {
            if (!word.isBlank()) {
                capitalized.append(Character.toUpperCase(word.charAt(0)))
                        .append(word.substring(1).toLowerCase())
                        .append(" ");
            }
        }
        return capitalized.toString().trim();
    }

    private boolean isValidPassword(String password) {
        if (password == null) return false;

        boolean hasUpper = password.matches(".*[A-Z].*");
        boolean hasLower = password.matches(".*[a-z].*");
        boolean hasDigit = password.matches(".*\\d.*");
        boolean hasSymbol = password.matches(".*[!@#$%^&*()_+\\-=[\\]{};':\"\\\\|,.<>/?].*");

        return password.length() >= 8 &&
                hasUpper && hasLower &&
                hasDigit && hasSymbol;
    }
}
