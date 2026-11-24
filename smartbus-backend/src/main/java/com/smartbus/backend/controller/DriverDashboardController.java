
package com.smartbus.backend.controller;

import com.smartbus.backend.dto.DriverDashboardResponse;
import com.smartbus.backend.service.DriverDashboardService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/driver")
public class DriverDashboardController {

    private final DriverDashboardService driverDashboardService;

    public DriverDashboardController(
            DriverDashboardService driverDashboardService) {
        this.driverDashboardService = driverDashboardService;
    }

    @GetMapping("/dashboard")
    public DriverDashboardResponse getDashboard(
            Authentication authentication) {

        return driverDashboardService.getDashboard(
                authentication.getName()
        );
    }
}