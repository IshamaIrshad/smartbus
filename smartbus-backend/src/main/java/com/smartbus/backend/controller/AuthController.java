package com.smartbus.backend.controller;

import com.smartbus.backend.dto.AuthResponse;
import com.smartbus.backend.dto.LoginRequest;
import com.smartbus.backend.dto.RegisterRequest;
import com.smartbus.backend.entity.User;
import com.smartbus.backend.security.JwtService;
import com.smartbus.backend.service.AuthRegistrationService;
import com.smartbus.backend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final AuthService authService;
    private final AuthRegistrationService authRegistrationService;
    private final JwtService jwtService;

    public AuthController(
            AuthService authService,
            AuthRegistrationService authRegistrationService,
            JwtService jwtService) {

        this.authService = authService;
        this.authRegistrationService = authRegistrationService;
        this.jwtService = jwtService;
    }

    // Login
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @RequestBody LoginRequest request) {

        return ResponseEntity.ok(
                authService.login(request)
        );
    }

    // Passenger registration
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @RequestBody RegisterRequest request) {

        User user = authRegistrationService.registerPassenger(request);

        String token = jwtService.generateToken(user.getEmail());

        String role = user.getRole().getRoleName();

        AuthResponse response = new AuthResponse(
                token,
                user.getEmail(),
                role
        );

        return ResponseEntity.ok(response);
    }
}