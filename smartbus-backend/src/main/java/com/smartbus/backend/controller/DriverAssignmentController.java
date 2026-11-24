package com.smartbus.backend.controller;

import com.smartbus.backend.entity.DriverAssignment;
import com.smartbus.backend.service.DriverAssignmentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/driver-assignments")
@CrossOrigin(origins = "http://localhost:3000")
public class DriverAssignmentController {

    private final DriverAssignmentService driverAssignmentService;

    public DriverAssignmentController(DriverAssignmentService driverAssignmentService) {
        this.driverAssignmentService = driverAssignmentService;
    }

    @PostMapping
    public DriverAssignment createDriverAssignment(
            @RequestBody DriverAssignment driverAssignment) {
        return driverAssignmentService.saveDriverAssignment(driverAssignment);
    }

    @GetMapping
    public List<DriverAssignment> getAllDriverAssignments() {
        return driverAssignmentService.getAllDriverAssignments();
    }

    @GetMapping("/{id}")
    public Optional<DriverAssignment> getDriverAssignmentById(
            @PathVariable Integer id) {
        return driverAssignmentService.getDriverAssignmentById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteDriverAssignment(@PathVariable Integer id) {
        driverAssignmentService.deleteDriverAssignment(id);
    }
}