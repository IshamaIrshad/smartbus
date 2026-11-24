package com.smartbus.backend.controller;

import com.smartbus.backend.dto.ConductorProfileResponse;
import com.smartbus.backend.service.ConductorService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/conductor")
@CrossOrigin(origins = "http://localhost:3000")
public class ConductorProfileController {

    private final ConductorService conductorService;

    public ConductorProfileController(
            ConductorService conductorService) {

        this.conductorService = conductorService;
    }

    @GetMapping("/profile")
    public ConductorProfileResponse getMyProfile(
            Authentication authentication) {

        String email = authentication.getName();

        return conductorService.getMyProfile(email);
    }
}