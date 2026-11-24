
package com.smartbus.backend.service;

import com.smartbus.backend.dto.StaffRequest;
import com.smartbus.backend.dto.StaffResponse;
import com.smartbus.backend.entity.Conductor;
import com.smartbus.backend.entity.Driver;
import com.smartbus.backend.entity.Role;
import com.smartbus.backend.entity.User;
import com.smartbus.backend.repository.ConductorRepository;
import com.smartbus.backend.repository.DriverRepository;
import com.smartbus.backend.repository.RoleRepository;
import com.smartbus.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class StaffService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final DriverRepository driverRepository;
    private final ConductorRepository conductorRepository;
    private final PasswordEncoder passwordEncoder;

    public StaffService(
            UserRepository userRepository,
            RoleRepository roleRepository,
            DriverRepository driverRepository,
            ConductorRepository conductorRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.driverRepository = driverRepository;
        this.conductorRepository = conductorRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<StaffResponse> getAllStaff() {
        return userRepository.findAll()
                .stream()
                .filter(user -> {
                    String roleName = user.getRole().getRoleName();

                    return roleName.equals("ADMIN")
                            || roleName.equals("DRIVER")
                            || roleName.equals("CONDUCTOR");
                })
                .map(this::toResponse)
                .toList();
    }

    /*
     * Generates the next employee number by checking
     * the existing Driver and Conductor employee numbers.
     */
    public String getNextEmployeeId() {
        return generateEmployeeId();
    }

    private String generateEmployeeId() {
        int maxNumber = 0;

        Pattern pattern = Pattern.compile("^EMP(\\d+)$");

        for (Driver driver : driverRepository.findAll()) {
            String employeeId = driver.getEmployeeId();

            if (employeeId != null) {
                Matcher matcher = pattern.matcher(employeeId.trim());

                if (matcher.matches()) {
                    maxNumber = Math.max(
                            maxNumber,
                            Integer.parseInt(matcher.group(1))
                    );
                }
            }
        }

        for (Conductor conductor : conductorRepository.findAll()) {
            String employeeId = conductor.getEmployeeId();

            if (employeeId != null) {
                Matcher matcher = pattern.matcher(employeeId.trim());

                if (matcher.matches()) {
                    maxNumber = Math.max(
                            maxNumber,
                            Integer.parseInt(matcher.group(1))
                    );
                }
            }
        }

        return String.format("EMP%03d", maxNumber + 1);
    }

    @Transactional
    public StaffResponse createStaff(StaffRequest request) {
        validateRequired(request.getName(), "Name is required");
        validateRequired(request.getEmail(), "Email is required");
        validateRequired(request.getPassword(), "Password is required");

        String name = request.getName().trim();
        String email = request.getEmail().trim();
        String roleName = normalizeRole(request.getRole());

        if (request.getPassword().length() < 8) {
            throw new IllegalArgumentException(
                    "Password must contain at least 8 characters"
            );
        }

        if (!roleName.equals("DRIVER")
                && !roleName.equals("CONDUCTOR")) {
            throw new IllegalArgumentException(
                    "Only Driver or Conductor accounts can be created here"
            );
        }

        if (userRepository.findByEmail(email).isPresent()) {
            throw new IllegalArgumentException(
                    "Email is already registered"
            );
        }

        Role role = roleRepository.findByRoleName(roleName)
                .orElseThrow(() -> new IllegalArgumentException(
                        roleName + " role not found"
                ));

        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setGender(request.getGender());
        user.setRole(role);
        user.setStatus("Active");
        user.setCreatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);

        // Always generate the employee number in the backend.
        // Do not trust an employee number sent by the frontend.
        String employeeId = generateEmployeeId();

        if (roleName.equals("DRIVER")) {
            Driver driver = new Driver();
            driver.setUser(savedUser);
            driver.setEmployeeId(employeeId);
            driver.setLicenseNo(request.getLicenseNo());
            driverRepository.save(driver);
        } else {
            Conductor conductor = new Conductor();
            conductor.setUser(savedUser);
            conductor.setEmployeeId(employeeId);
            conductor.setLicenseNo(request.getLicenseNo());
            conductorRepository.save(conductor);
        }

        return toResponse(savedUser);
    }

    @Transactional
    public StaffResponse updateStaff(
            Integer userId,
            StaffRequest request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Staff member not found"
                ));

        String roleName = user.getRole().getRoleName();

        if (!roleName.equals("DRIVER")
                && !roleName.equals("CONDUCTOR")) {
            throw new IllegalArgumentException(
                    "Only Driver and Conductor details can be edited here"
            );
        }

        validateRequired(request.getName(), "Name is required");
        validateRequired(request.getEmail(), "Email is required");

        String name = request.getName().trim();
        String email = request.getEmail().trim();

        if (!email.equalsIgnoreCase(user.getEmail())) {
            if (userRepository.findByEmail(email).isPresent()) {
                throw new IllegalArgumentException(
                        "Email is already registered"
                );
            }

            user.setEmail(email);
        }

        user.setName(name);
        user.setPhone(request.getPhone());
        user.setGender(request.getGender());

        User savedUser = userRepository.save(user);

        if (roleName.equals("DRIVER")) {
            Driver driver = driverRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Driver profile not found"
                    ));

            driver.setLicenseNo(request.getLicenseNo());
            driverRepository.save(driver);

        } else {
            Conductor conductor = conductorRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Conductor profile not found"
                    ));

            conductor.setLicenseNo(request.getLicenseNo());
            conductorRepository.save(conductor);
        }

        // Employee number is generated once and is not changed during editing.
        return toResponse(savedUser);
    }

    @Transactional
    public StaffResponse updateStatus(
            Integer userId,
            String status) {

        if (status == null
                || (!status.equalsIgnoreCase("Active")
                && !status.equalsIgnoreCase("Inactive"))) {
            throw new IllegalArgumentException(
                    "Status must be Active or Inactive"
            );
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Staff member not found"
                ));

        String roleName = user.getRole().getRoleName();

        if (!roleName.equals("DRIVER")
                && !roleName.equals("CONDUCTOR")) {
            throw new IllegalArgumentException(
                    "Only Driver and Conductor status can be changed here"
            );
        }

        user.setStatus(
                status.equalsIgnoreCase("Active")
                        ? "Active"
                        : "Inactive"
        );

        User savedUser = userRepository.save(user);

        return toResponse(savedUser);
    }

    @Transactional
    public void deactivateStaff(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Staff member not found"
                ));

        String roleName = user.getRole().getRoleName();

        if (!roleName.equals("DRIVER")
                && !roleName.equals("CONDUCTOR")) {
            throw new IllegalArgumentException(
                    "Only Driver and Conductor accounts can be removed here"
            );
        }

        // Soft delete: retain records that may be linked to assignments.
        user.setStatus("Inactive");
        userRepository.save(user);
    }

    private StaffResponse toResponse(User user) {
        String roleName = user.getRole().getRoleName();

        String employeeId = null;
        String licenseNo = null;

        if (roleName.equals("DRIVER")) {
            Driver driver = driverRepository
                    .findById(user.getUserId())
                    .orElse(null);

            if (driver != null) {
                employeeId = driver.getEmployeeId();
                licenseNo = driver.getLicenseNo();
            }

        } else if (roleName.equals("CONDUCTOR")) {
            Conductor conductor = conductorRepository
                    .findById(user.getUserId())
                    .orElse(null);

            if (conductor != null) {
                employeeId = conductor.getEmployeeId();
                licenseNo = conductor.getLicenseNo();
            }
        }

        return new StaffResponse(
                user.getUserId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getGender(),
                roleName,
                employeeId,
                licenseNo,
                user.getStatus() == null
                        ? "Active"
                        : user.getStatus()
        );
    }

    private String normalizeRole(String role) {
        return role == null
                ? ""
                : role.trim().toUpperCase();
    }

    private void validateRequired(String value, String message) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(message);
        }
    }
}