package com.smartbus.backend.controller;

import com.smartbus.backend.entity.BusLocation;
import com.smartbus.backend.service.BusLocationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/bus-locations")
@CrossOrigin(origins = "http://localhost:3000")
public class BusLocationController {

    private final BusLocationService busLocationService;

    public BusLocationController(
            BusLocationService busLocationService) {

        this.busLocationService = busLocationService;
    }

    // Create bus location
    @PostMapping
    public BusLocation createBusLocation(
            @RequestBody BusLocation busLocation) {

        return busLocationService.saveBusLocation(busLocation);
    }

    // Get all bus locations
    @GetMapping
    public List<BusLocation> getAllBusLocations() {

        return busLocationService.getAllBusLocations();
    }

    // Get bus location by ID
    @GetMapping("/{id}")
    public Optional<BusLocation> getBusLocationById(
            @PathVariable Integer id) {

        return busLocationService.getBusLocationById(id);
    }

    // Get latest location for a schedule
    @GetMapping("/schedule/{scheduleId}/latest")
    public Optional<BusLocation> getLatestLocation(
            @PathVariable Integer scheduleId) {

        return busLocationService.getLatestLocation(scheduleId);
    }

    // Delete bus location
    @DeleteMapping("/{id}")
    public void deleteBusLocation(@PathVariable Integer id) {

        busLocationService.deleteBusLocation(id);
    }
}