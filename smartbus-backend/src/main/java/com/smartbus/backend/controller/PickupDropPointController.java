package com.smartbus.backend.controller;

import com.smartbus.backend.entity.PickupDropPoint;
import com.smartbus.backend.service.PickupDropPointService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/pickup-drop-points")
@CrossOrigin(origins = "http://localhost:3000")
public class PickupDropPointController {

    private final PickupDropPointService pickupDropPointService;

    public PickupDropPointController(
            PickupDropPointService pickupDropPointService) {

        this.pickupDropPointService = pickupDropPointService;
    }

    // Create pickup/drop point
    @PostMapping
    public PickupDropPoint createPickupDropPoint(
            @RequestBody PickupDropPoint pickupDropPoint) {

        return pickupDropPointService.savePickupDropPoint(pickupDropPoint);
    }

    // Get all pickup/drop points
    @GetMapping
    public List<PickupDropPoint> getAllPickupDropPoints() {

        return pickupDropPointService.getAllPickupDropPoints();
    }

    // Get active pickup/drop points
    @GetMapping("/active")
    public List<PickupDropPoint> getActivePickupDropPoints() {

        return pickupDropPointService.getActivePickupDropPoints();
    }

    // Get pickup/drop point by ID
    @GetMapping("/{id}")
    public Optional<PickupDropPoint> getPickupDropPointById(
            @PathVariable Integer id) {

        return pickupDropPointService.getPickupDropPointById(id);
    }

    // Update pickup/drop point
    @PutMapping("/{id}")
    public PickupDropPoint updatePickupDropPoint(
            @PathVariable Integer id,
            @RequestBody PickupDropPoint pointDetails) {

        return pickupDropPointService.updatePickupDropPoint(
                id, pointDetails
        );
    }

    // Delete pickup/drop point
    @DeleteMapping("/{id}")
    public void deletePickupDropPoint(@PathVariable Integer id) {

        pickupDropPointService.deletePickupDropPoint(id);
    }
}