package com.budgetwise.controller;

import com.budgetwise.model.User;
import com.budgetwise.repository.UserRepository;
import com.budgetwise.security.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UsersController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    // ================= CHANGE PASSWORD =================
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(
        @RequestHeader(value="Authorization", required=false) String authHeader,
        @RequestBody Map<String,String> data) {

    if(authHeader == null || !authHeader.startsWith("Bearer "))
        return ResponseEntity.status(401).body(Map.of("message","Missing token"));

    String token = authHeader.substring(7);

    String email = jwtUtil.extractUsername(token);

    User user = userRepository.findByEmail(email);

    if(user == null)
        return ResponseEntity.status(404).body(Map.of("message","User not found"));

    String currentPassword = data.get("currentPassword");
    String newPassword = data.get("newPassword");

    if(!passwordEncoder.matches(currentPassword, user.getPassword()))
        return ResponseEntity.badRequest().body(Map.of(
                "message","Current password incorrect"
        ));

    user.setPassword(passwordEncoder.encode(newPassword));
    userRepository.save(user);

    return ResponseEntity.ok(Map.of(
            "message","Password updated successfully"
    ));
    }
}