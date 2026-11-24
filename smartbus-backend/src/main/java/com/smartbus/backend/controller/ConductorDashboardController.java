package com.smartbus.backend.controller;

import com.smartbus.backend.dto.ConductorDashboardResponse;
import com.smartbus.backend.service.ConductorDashboardService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/conductor")
@CrossOrigin(origins = "http://localhost:3000")
public class ConductorDashboardController {

    private final ConductorDashboardService conductorDashboardService;

    public ConductorDashboardController(
            ConductorDashboardService conductorDashboardService) {

        this.conductorDashboardService = conductorDashboardService;
    }

    @GetMapping("/dashboard")
    public ConductorDashboardResponse getDashboard(
            Authentication authentication) {

        String email = authentication.getName();

        return conductorDashboardService.getDashboard(email);
    }
}