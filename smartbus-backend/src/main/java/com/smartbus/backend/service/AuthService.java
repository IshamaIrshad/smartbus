package com.smartbus.backend.service;

import com.smartbus.backend.dto.AuthResponse;
import com.smartbus.backend.dto.LoginRequest;
import com.smartbus.backend.entity.User;
import com.smartbus.backend.repository.UserRepository;
import com.smartbus.backend.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public AuthService(
            AuthenticationManager authenticationManager,
            UserRepository userRepository,
            JwtService jwtService) {

        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    public AuthResponse login(LoginRequest request) {

        // Check email and password
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // Find the authenticated user using email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        // Generate JWT token
        String token = jwtService.generateToken(user.getEmail());

        // Get user's role
        String role = user.getRole().getRoleName();

        // Return token, email and role
        return new AuthResponse(
                token,
                user.getEmail(),
                role
        );
    }
}