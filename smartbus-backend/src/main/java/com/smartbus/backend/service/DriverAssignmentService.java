package com.smartbus.backend.service;

import com.smartbus.backend.entity.Driver;
import com.smartbus.backend.entity.DriverAssignment;
import com.smartbus.backend.entity.User;
import com.smartbus.backend.repository.DriverAssignmentRepository;
import com.smartbus.backend.repository.DriverRepository;
import com.smartbus.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DriverAssignmentService {

    private final DriverAssignmentRepository driverAssignmentRepository;
    private final UserRepository userRepository;
    private final DriverRepository driverRepository;

    public DriverAssignmentService(
            DriverAssignmentRepository driverAssignmentRepository,
            UserRepository userRepository,
            DriverRepository driverRepository) {

        this.driverAssignmentRepository = driverAssignmentRepository;
        this.userRepository = userRepository;
        this.driverRepository = driverRepository;
    }

    public DriverAssignment saveDriverAssignment(DriverAssignment driverAssignment) {
        return driverAssignmentRepository.save(driverAssignment);
    }

    public List<DriverAssignment> getAllDriverAssignments() {
        return driverAssignmentRepository.findAll();
    }

    public Optional<DriverAssignment> getDriverAssignmentById(Integer driverAssignmentId) {
        return driverAssignmentRepository.findById(driverAssignmentId);
    }

    public void deleteDriverAssignment(Integer driverAssignmentId) {
        driverAssignmentRepository.deleteById(driverAssignmentId);
    }

    // Get all schedules assigned to the logged-in driver
    public List<DriverAssignment> getMyAssignments(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found with email: " + email
                        )
                );

        Driver driver = driverRepository.findById(user.getUserId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Driver profile not found"
                        )
                );

        return driverAssignmentRepository.findByDriver_UserId(
                driver.getUserId()
        );
    }
}