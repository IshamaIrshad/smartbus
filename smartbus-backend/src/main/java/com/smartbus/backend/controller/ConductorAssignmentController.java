package com.smartbus.backend.controller;

import com.smartbus.backend.dto.ConductorAssignmentResponse;
import com.smartbus.backend.entity.ConductorAssignment;
import com.smartbus.backend.service.ConductorAssignmentService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/conductor-assignments")
@CrossOrigin(origins = "http://localhost:3000")
public class ConductorAssignmentController {

    private final ConductorAssignmentService conductorAssignmentService;

    public ConductorAssignmentController(
            ConductorAssignmentService conductorAssignmentService) {

        this.conductorAssignmentService = conductorAssignmentService;
    }

    // =========================================================
    // CREATE ASSIGNMENT
    // Admin only
    // =========================================================

    @PostMapping
    public ConductorAssignment createConductorAssignment(
            @RequestBody ConductorAssignment conductorAssignment) {

        return conductorAssignmentService
                .saveConductorAssignment(conductorAssignment);
    }


    // =========================================================
    // GET ALL ASSIGNMENTS
    // Admin only
    // =========================================================

    @GetMapping
    public List<ConductorAssignment> getAllConductorAssignments() {

        return conductorAssignmentService
                .getAllConductorAssignments();
    }


    // =========================================================
    // GET ASSIGNMENT BY ID
    // Admin only
    // =========================================================

    @GetMapping("/{id}")
    public Optional<ConductorAssignment> getConductorAssignmentById(
            @PathVariable Integer id) {

        return conductorAssignmentService
                .getConductorAssignmentById(id);
    }


    // =========================================================
    // DELETE ASSIGNMENT
    // Admin only
    // =========================================================

    @DeleteMapping("/{id}")
    public void deleteConductorAssignment(
            @PathVariable Integer id) {

        conductorAssignmentService
                .deleteConductorAssignment(id);
    }


    // =========================================================
    // GET LOGGED-IN CONDUCTOR'S SCHEDULES
    // Conductor only
    // =========================================================

    @GetMapping("/my-schedules")
    public List<ConductorAssignmentResponse> getMySchedules(
            Authentication authentication) {

        String email = authentication.getName();

        return conductorAssignmentService
                .getMyAssignments(email);
    }
}