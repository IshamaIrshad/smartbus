package com.smartbus.backend.service;

import com.smartbus.backend.dto.ConductorAssignmentResponse;
import com.smartbus.backend.entity.Conductor;
import com.smartbus.backend.entity.ConductorAssignment;
import com.smartbus.backend.entity.User;
import com.smartbus.backend.repository.ConductorAssignmentRepository;
import com.smartbus.backend.repository.ConductorRepository;
import com.smartbus.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ConductorAssignmentService {

    private final ConductorAssignmentRepository conductorAssignmentRepository;
    private final UserRepository userRepository;
    private final ConductorRepository conductorRepository;

    public ConductorAssignmentService(
            ConductorAssignmentRepository conductorAssignmentRepository,
            UserRepository userRepository,
            ConductorRepository conductorRepository) {

        this.conductorAssignmentRepository = conductorAssignmentRepository;
        this.userRepository = userRepository;
        this.conductorRepository = conductorRepository;
    }

    // =========================================================
    // CREATE ASSIGNMENT
    // =========================================================

    public ConductorAssignment saveConductorAssignment(
            ConductorAssignment conductorAssignment) {

        return conductorAssignmentRepository.save(conductorAssignment);
    }


    // =========================================================
    // GET ALL ASSIGNMENTS
    // Used by Admin
    // =========================================================

    public List<ConductorAssignment> getAllConductorAssignments() {

        return conductorAssignmentRepository.findAll();
    }


    // =========================================================
    // GET ASSIGNMENT BY ID
    // Used by Admin
    // =========================================================

    public Optional<ConductorAssignment> getConductorAssignmentById(
            Integer conductorAssignmentId) {

        return conductorAssignmentRepository
                .findById(conductorAssignmentId);
    }


    // =========================================================
    // DELETE ASSIGNMENT
    // =========================================================

    public void deleteConductorAssignment(
            Integer conductorAssignmentId) {

        conductorAssignmentRepository.deleteById(
                conductorAssignmentId
        );
    }


    // =========================================================
    // GET LOGGED-IN CONDUCTOR'S ASSIGNMENTS
    // =========================================================

    public List<ConductorAssignmentResponse> getMyAssignments(
            String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found with email: " + email
                        )
                );

        Conductor conductor =
                conductorRepository.findById(user.getUserId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Conductor profile not found"
                                )
                        );

        List<ConductorAssignment> assignments =
                conductorAssignmentRepository
                        .findByConductor_UserId(
                                conductor.getUserId()
                        );

        return assignments.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }


    // =========================================================
    // CONVERT ENTITY TO SAFE DTO
    // =========================================================

    private ConductorAssignmentResponse convertToResponse(
            ConductorAssignment assignment) {

        Integer conductorId =
                assignment.getConductor().getUserId();

        String employeeId =
                assignment.getConductor().getEmployeeId();

        Integer scheduleId =
                assignment.getSchedule().getScheduleId();

        Integer busId =
                assignment.getSchedule().getBus().getBusId();

        String busName =
                assignment.getSchedule().getBus().getBusName();

        String registrationNumber =
                assignment.getSchedule()
                        .getBus()
                        .getRegistrationNumber();

        String busType =
                assignment.getSchedule()
                        .getBus()
                        .getBusType();

        Integer routeId =
                assignment.getSchedule()
                        .getRoute()
                        .getRouteId();

        String routeName =
                assignment.getSchedule()
                        .getRoute()
                        .getRouteName();

        return new ConductorAssignmentResponse(
                assignment.getConductorAssignmentId(),
                conductorId,
                employeeId,
                scheduleId,
                busId,
                busName,
                registrationNumber,
                busType,
                routeId,
                routeName,
                assignment.getSchedule().getDepartureTime(),
                assignment.getSchedule().getArrivalTime(),
                assignment.getSchedule().getTravelDate(),
                assignment.getAssignedAt()
        );
    }
}