package com.smartbus.backend.controller;

import com.smartbus.backend.entity.Conductor;
import com.smartbus.backend.service.ConductorService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/conductors")
@CrossOrigin(origins = "http://localhost:3000")
public class ConductorController {

    private final ConductorService conductorService;

    public ConductorController(ConductorService conductorService) {
        this.conductorService = conductorService;
    }

    // Create conductor
    @PostMapping
    public Conductor createConductor(
            @RequestBody Conductor conductor) {

        return conductorService.saveConductor(conductor);
    }

    // Get all conductors
    @GetMapping
    public List<Conductor> getAllConductors() {

        return conductorService.getAllConductors();
    }

    // Get conductor by user ID
    @GetMapping("/{id}")
    public Optional<Conductor> getConductorById(
            @PathVariable Integer id) {

        return conductorService.getConductorById(id);
    }

    // Update conductor
    @PutMapping("/{id}")
    public Conductor updateConductor(
            @PathVariable Integer id,
            @RequestBody Conductor conductorDetails) {

        return conductorService.updateConductor(
                id,
                conductorDetails
        );
    }

    // Delete conductor
    @DeleteMapping("/{id}")
    public void deleteConductor(
            @PathVariable Integer id) {

        conductorService.deleteConductor(id);
    }
}