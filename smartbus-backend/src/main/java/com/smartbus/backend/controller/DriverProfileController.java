package com.smartbus.backend.controller;

import com.smartbus.backend.dto.BusLocationRequest;
import com.smartbus.backend.dto.DriverProfileResponse;
import com.smartbus.backend.entity.Bus;
import com.smartbus.backend.entity.BusLocation;
import com.smartbus.backend.entity.DriverAssignment;
import com.smartbus.backend.service.BusLocationService;
import com.smartbus.backend.service.DriverAssignmentService;
import com.smartbus.backend.service.DriverService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/driver")
@CrossOrigin(origins = "http://localhost:3000")
public class DriverProfileController {

    private final DriverService driverService;
    private final DriverAssignmentService driverAssignmentService;
    private final BusLocationService busLocationService;

    public DriverProfileController(
            DriverService driverService,
            DriverAssignmentService driverAssignmentService,
            BusLocationService busLocationService) {

        this.driverService = driverService;
        this.driverAssignmentService = driverAssignmentService;
        this.busLocationService = busLocationService;
    }

    // Get logged-in driver's profile
    @GetMapping("/profile")
    public DriverProfileResponse getMyProfile(
            Authentication authentication) {

        String email = authentication.getName();

        return driverService.getMyProfile(email);
    }

    // Get bus assigned to logged-in driver
    @GetMapping("/bus")
    public Bus getMyAssignedBus(
            Authentication authentication) {

        String email = authentication.getName();

        return driverService.getMyAssignedBus(email);
    }

    // Get schedules assigned to logged-in driver
    @GetMapping("/schedules")
    public List<DriverAssignment> getMySchedules(
            Authentication authentication) {

        String email = authentication.getName();

        return driverAssignmentService.getMyAssignments(email);
    }

    // Update bus location
    @PostMapping("/location")
    public BusLocation updateLocation(
            Authentication authentication,
            @RequestBody BusLocationRequest request) {

        String email = authentication.getName();

        return busLocationService.updateDriverLocation(
                email,
                request
        );
    }
}