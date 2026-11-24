package com.smartbus.backend.controller;

import com.smartbus.backend.entity.Driver;
import com.smartbus.backend.service.DriverService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/drivers")
@CrossOrigin(origins = "http://localhost:3000")
public class DriverController {

    private final DriverService driverService;

    public DriverController(DriverService driverService) {
        this.driverService = driverService;
    }

    // Create driver
    @PostMapping
    public Driver createDriver(@RequestBody Driver driver) {
        return driverService.saveDriver(driver);
    }

    // Get all drivers
    @GetMapping
    public List<Driver> getAllDrivers() {
        return driverService.getAllDrivers();
    }

    // Get driver by user ID
    @GetMapping("/{id}")
    public Optional<Driver> getDriverById(@PathVariable Integer id) {
        return driverService.getDriverById(id);
    }

    // Update driver
    @PutMapping("/{id}")
    public Driver updateDriver(
            @PathVariable Integer id,
            @RequestBody Driver driverDetails) {

        return driverService.updateDriver(
                id,
                driverDetails
        );
    }

    // Delete driver
    @DeleteMapping("/{id}")
    public void deleteDriver(@PathVariable Integer id) {
        driverService.deleteDriver(id);
    }
}