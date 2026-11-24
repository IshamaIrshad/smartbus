package com.smartbus.backend.controller;

import com.smartbus.backend.dto.AdminConductorRequest;
import com.smartbus.backend.dto.UserResponse;
import com.smartbus.backend.entity.User;
import com.smartbus.backend.service.AuthRegistrationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/conductors")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminConductorController {

    private final AuthRegistrationService authRegistrationService;

    public AdminConductorController(
            AuthRegistrationService authRegistrationService) {

        this.authRegistrationService = authRegistrationService;
    }

    @PostMapping
    public ResponseEntity<UserResponse> createConductor(
            @RequestBody AdminConductorRequest request) {

        User user = authRegistrationService.createConductor(
                request.getName(),
                request.getEmail(),
                request.getPassword(),
                request.getPhone(),
                request.getGender(),
                request.getEmployeeId(),
                request.getLicenseNo()
        );

        UserResponse response = new UserResponse(
                user.getUserId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getGender(),
                user.getRole().getRoleName()
        );

        return ResponseEntity.ok(response);
    }
}