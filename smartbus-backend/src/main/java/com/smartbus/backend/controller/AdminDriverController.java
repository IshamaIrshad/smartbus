package com.smartbus.backend.controller;

import com.smartbus.backend.dto.AdminDriverRequest;
import com.smartbus.backend.entity.User;
import com.smartbus.backend.service.AuthRegistrationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/drivers")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminDriverController {

    private final AuthRegistrationService authRegistrationService;

    public AdminDriverController(
            AuthRegistrationService authRegistrationService) {

        this.authRegistrationService = authRegistrationService;
    }

    // Admin creates a Driver
    @PostMapping
    public ResponseEntity<User> createDriver(
            @RequestBody AdminDriverRequest request) {

        User user = authRegistrationService.createDriver(
                request.getName(),
                request.getEmail(),
                request.getPassword(),
                request.getPhone(),
                request.getGender(),
                request.getEmployeeId(),
                request.getLicenseNo()
        );

        return ResponseEntity.ok(user);
    }
}