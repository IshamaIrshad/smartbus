package com.smartbus.backend.config;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

/**
 * Turns errors thrown by services into JSON {"message": "..."} responses.
 *
 * Without this, every error became an empty 403, and the frontend treated
 * 403 as "session expired" and logged the user out.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static ResponseEntity<Map<String, String>> reply(
            HttpStatus status, String message) {

        return ResponseEntity.status(status)
                .body(Map.of("message", message));
    }

    // Wrong email or password
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, String>> badCredentials() {
        return reply(HttpStatus.UNAUTHORIZED,
                "Invalid email or password.");
    }

    // Disabled / locked account, etc.
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<Map<String, String>> authentication(
            AuthenticationException ex) {

        return reply(HttpStatus.FORBIDDEN,
                "Login denied: " + ex.getMessage());
    }

    // Real permission problems must stay 403, handled by Spring Security.
    @ExceptionHandler(AccessDeniedException.class)
    public void accessDenied(AccessDeniedException ex) {
        throw ex;
    }

    // Duplicate value or record still in use. Never show the SQL to users.
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>> dataIntegrity() {
        return reply(HttpStatus.CONFLICT,
                "This value already exists or the record is in use.");
    }

    // Business rule errors thrown by services (seat taken, not found, ...)
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> business(
            RuntimeException ex) {

        String message = ex.getMessage() != null
                ? ex.getMessage()
                : "Request failed.";

        return reply(HttpStatus.BAD_REQUEST, message);
    }
}
