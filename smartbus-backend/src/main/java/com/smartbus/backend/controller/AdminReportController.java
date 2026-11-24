package com.smartbus.backend.controller;

import com.smartbus.backend.service.AdminReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/reports")
public class AdminReportController {

    private final AdminReportService adminReportService;

    public AdminReportController(
            AdminReportService adminReportService) {
        this.adminReportService = adminReportService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getReports(
            @RequestParam(defaultValue = "thisMonth") String period) {

        System.out.println("ADMIN REPORT CONTROLLER REACHED");

        Map<String, Object> reports =
                adminReportService.getReports(period);

        return ResponseEntity.ok(reports);
    }
}

