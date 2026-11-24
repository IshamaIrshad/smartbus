
package com.smartbus.backend.controller;

import com.smartbus.backend.dto.StaffRequest;
import com.smartbus.backend.dto.StaffResponse;
import com.smartbus.backend.service.StaffService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/staff")
@CrossOrigin(origins = "http://localhost:3000")
public class StaffController {

    private final StaffService staffService;

    public StaffController(StaffService staffService) {
        this.staffService = staffService;
    }

    @GetMapping
    public ResponseEntity<List<StaffResponse>> getAllStaff() {
        return ResponseEntity.ok(staffService.getAllStaff());
    }

    // Supplies a preview of the next employee number for the Add form.
    @GetMapping("/next-employee-id")
    public ResponseEntity<Map<String, String>> getNextEmployeeId() {
        return ResponseEntity.ok(
                Map.of(
                        "employeeId",
                        staffService.getNextEmployeeId()
                )
        );
    }

    @PostMapping
    public ResponseEntity<StaffResponse> createStaff(
            @RequestBody StaffRequest request) {

        StaffResponse createdStaff =
                staffService.createStaff(request);

        return ResponseEntity.ok(createdStaff);
    }

    @PutMapping("/{userId}")
    public ResponseEntity<StaffResponse> updateStaff(
            @PathVariable Integer userId,
            @RequestBody StaffRequest request) {

        StaffResponse updatedStaff =
                staffService.updateStaff(userId, request);

        return ResponseEntity.ok(updatedStaff);
    }

    @PatchMapping("/{userId}/status")
    public ResponseEntity<StaffResponse> updateStatus(
            @PathVariable Integer userId,
            @RequestBody Map<String, String> request) {

        StaffResponse updatedStaff =
                staffService.updateStatus(
                        userId,
                        request.get("status")
                );

        return ResponseEntity.ok(updatedStaff);
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deactivateStaff(
            @PathVariable Integer userId) {

        staffService.deactivateStaff(userId);

        return ResponseEntity.noContent().build();
    }
}