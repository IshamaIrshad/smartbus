package com.smartbus.backend.service;

import com.smartbus.backend.dto.DriverProfileResponse;
import com.smartbus.backend.entity.Bus;
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
public class DriverService {

    private final DriverRepository driverRepository;
    private final UserRepository userRepository;
    private final DriverAssignmentRepository driverAssignmentRepository;

    public DriverService(
            DriverRepository driverRepository,
            UserRepository userRepository,
            DriverAssignmentRepository driverAssignmentRepository) {

        this.driverRepository = driverRepository;
        this.userRepository = userRepository;
        this.driverAssignmentRepository = driverAssignmentRepository;
    }

    // Create driver
    public Driver saveDriver(Driver driver) {
        return driverRepository.save(driver);
    }

    // Get all drivers
    public List<Driver> getAllDrivers() {
        return driverRepository.findAll();
    }

    // Get driver by user ID
    public Optional<Driver> getDriverById(Integer userId) {
        return driverRepository.findById(userId);
    }

    // Update driver
    public Driver updateDriver(
            Integer userId,
            Driver driverDetails) {

        Driver existingDriver =
                driverRepository.findById(userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Driver not found with user id: "
                                                + userId
                                )
                        );

        existingDriver.setEmployeeId(
                driverDetails.getEmployeeId()
        );

        existingDriver.setLicenseNo(
                driverDetails.getLicenseNo()
        );

        return driverRepository.save(existingDriver);
    }

    // Delete driver
    public void deleteDriver(Integer userId) {
        driverRepository.deleteById(userId);
    }

    // Get logged-in driver's profile
    public DriverProfileResponse getMyProfile(String email) {

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

        return new DriverProfileResponse(
                user.getUserId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getGender(),
                driver.getEmployeeId(),
                driver.getLicenseNo()
        );
    }

    // Get bus assigned to logged-in driver
    public Bus getMyAssignedBus(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found with email: " + email
                        )
                );

        DriverAssignment assignment =
                driverAssignmentRepository
                        .findFirstByDriver_UserId(user.getUserId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "No bus assignment found for this driver"
                                )
                        );

        return assignment.getSchedule().getBus();
    }
}