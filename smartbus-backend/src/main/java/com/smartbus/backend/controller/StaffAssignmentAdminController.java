
package com.smartbus.backend.controller;

import com.smartbus.backend.dto.StaffAssignmentDataResponse;
import com.smartbus.backend.dto.StaffAssignmentDataResponse.AssignmentRequest;
import com.smartbus.backend.dto.StaffAssignmentDataResponse.AssignmentRow;
import com.smartbus.backend.service.StaffAssignmentAdminService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/staff-assignments")
@CrossOrigin(origins = "http://localhost:3000")
public class StaffAssignmentAdminController {

    private final StaffAssignmentAdminService assignmentService;

    public StaffAssignmentAdminController(
            StaffAssignmentAdminService assignmentService) {
        this.assignmentService = assignmentService;
    }

    @GetMapping
    public ResponseEntity<StaffAssignmentDataResponse> getAssignmentData() {

        return ResponseEntity.ok(
                assignmentService.getAssignmentData()
        );
    }

    @PostMapping("/drivers")
    public ResponseEntity<AssignmentRow> assignDriver(
            @RequestBody AssignmentRequest request) {

        AssignmentRow result = assignmentService.assignDriver(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @PostMapping("/conductors")
    public ResponseEntity<AssignmentRow> assignConductor(
            @RequestBody AssignmentRequest request) {

        AssignmentRow result = assignmentService.assignConductor(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @DeleteMapping("/drivers/{assignmentId}")
    public ResponseEntity<Void> removeDriverAssignment(
            @PathVariable Integer assignmentId) {

        assignmentService.removeDriverAssignment(assignmentId);

        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/conductors/{assignmentId}")
    public ResponseEntity<Void> removeConductorAssignment(
            @PathVariable Integer assignmentId) {

        assignmentService.removeConductorAssignment(assignmentId);

        return ResponseEntity.noContent().build();
    }
}

