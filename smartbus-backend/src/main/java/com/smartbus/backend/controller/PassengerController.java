package com.smartbus.backend.controller;

import com.smartbus.backend.dto.PassengerProfileRequest;
import com.smartbus.backend.dto.PassengerResponse;
import com.smartbus.backend.entity.Passenger;
import com.smartbus.backend.service.PassengerService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/passengers")
@CrossOrigin(origins = "http://localhost:3000")
public class PassengerController {

    private final PassengerService passengerService;

    public PassengerController(PassengerService passengerService) {
        this.passengerService = passengerService;
    }

    // Create passenger
    @PostMapping
    public Passenger createPassenger(@RequestBody Passenger passenger) {
        return passengerService.savePassenger(passenger);
    }

    // Get all passengers
    @GetMapping
    public List<PassengerResponse> getAllPassengers() {

        return passengerService.getAllPassengers()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    // Get logged-in passenger profile
    @GetMapping("/profile")
    public PassengerResponse getMyProfile(
            Authentication authentication) {

        Passenger passenger =
                passengerService.getPassengerByEmail(
                        authentication.getName()
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Passenger profile not found"
                        )
                );

        return convertToResponse(passenger);
    }

    // Get passenger by ID
    @GetMapping("/{id}")
    public PassengerResponse getPassengerById(
            @PathVariable Integer id) {

        Passenger passenger =
                passengerService.getPassengerById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Passenger not found with id: " + id
                                )
                        );

        return convertToResponse(passenger);
    }

    // Update passenger profile
    @PutMapping("/{id}")
    public PassengerResponse updatePassengerProfile(
            @PathVariable Integer id,
            @RequestBody PassengerProfileRequest request) {

        Passenger updatedPassenger =
                passengerService.updatePassengerProfile(
                        id,
                        request
                );

        return convertToResponse(updatedPassenger);
    }

    // Delete passenger
    @DeleteMapping("/{id}")
    public void deletePassenger(
            @PathVariable Integer id) {

        passengerService.deletePassenger(id);
    }

    // Convert Passenger entity to safe response
    private PassengerResponse convertToResponse(
            Passenger passenger) {

        return new PassengerResponse(
                passenger.getUserId(),
                passenger.getUser().getName(),
                passenger.getUser().getEmail(),
                passenger.getUser().getPhone(),
                passenger.getUser().getGender(),
                passenger.getUser().getRole() != null
                        ? passenger.getUser()
                        .getRole()
                        .getRoleName()
                        : null,
                passenger.getNic(),
                passenger.getDateOfBirth() != null
                        ? passenger.getDateOfBirth().toString()
                        : null,
                passenger.getAddress()
        );
    }
}