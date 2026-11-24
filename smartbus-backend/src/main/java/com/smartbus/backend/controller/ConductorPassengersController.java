package com.smartbus.backend.controller;

import com.smartbus.backend.dto.ConductorPassengerResponse;
import com.smartbus.backend.service.ConductorPassengersService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/conductor")
@CrossOrigin(origins = "http://localhost:3000")
public class ConductorPassengersController {

    private final ConductorPassengersService conductorPassengersService;

    public ConductorPassengersController(
            ConductorPassengersService conductorPassengersService
    ) {
        this.conductorPassengersService = conductorPassengersService;
    }

    @GetMapping("/passengers")
    public List<ConductorPassengerResponse> getPassengers(
            Authentication authentication
    ) {
        String email = authentication.getName();

        return conductorPassengersService.getPassengers(email);
    }
}

