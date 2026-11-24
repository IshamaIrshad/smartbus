package com.smartbus.backend.service;

import com.smartbus.backend.dto.RegisterRequest;
import com.smartbus.backend.entity.Conductor;
import com.smartbus.backend.entity.Driver;
import com.smartbus.backend.entity.Passenger;
import com.smartbus.backend.entity.Role;
import com.smartbus.backend.entity.User;
import com.smartbus.backend.repository.ConductorRepository;
import com.smartbus.backend.repository.DriverRepository;
import com.smartbus.backend.repository.PassengerRepository;
import com.smartbus.backend.repository.RoleRepository;
import com.smartbus.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthRegistrationService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PassengerRepository passengerRepository;
    private final DriverRepository driverRepository;
    private final ConductorRepository conductorRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthRegistrationService(
            UserRepository userRepository,
            RoleRepository roleRepository,
            PassengerRepository passengerRepository,
            DriverRepository driverRepository,
            ConductorRepository conductorRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passengerRepository = passengerRepository;
        this.driverRepository = driverRepository;
        this.conductorRepository = conductorRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // =========================================================
    // PASSENGER REGISTRATION
    // Passenger registers themselves
    // =========================================================

    @Transactional
    public User registerPassenger(RegisterRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email is already registered");
        }

        Role passengerRole = roleRepository.findByRoleName("PASSENGER")
                .orElseThrow(() ->
                        new RuntimeException("PASSENGER role not found")
                );

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());

        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        user.setPhone(request.getPhone());
        user.setGender(request.getGender());
        user.setRole(passengerRole);

        User savedUser = userRepository.save(user);

        Passenger passenger = new Passenger();
        passenger.setUser(savedUser);

        passengerRepository.save(passenger);

        return savedUser;
    }


    // =========================================================
    // CREATE ADMIN
    // Used to create an Admin account
    // =========================================================

    @Transactional
    public User createAdmin(
            String name,
            String email,
            String password,
            String phone,
            String gender) {

        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email is already registered");
        }

        Role adminRole = roleRepository.findByRoleName("ADMIN")
                .orElseThrow(() ->
                        new RuntimeException("ADMIN role not found")
                );

        User user = new User();

        user.setName(name);
        user.setEmail(email);

        user.setPassword(
                passwordEncoder.encode(password)
        );

        user.setPhone(phone);
        user.setGender(gender);
        user.setRole(adminRole);

        return userRepository.save(user);
    }


    // =========================================================
    // CREATE DRIVER
    // Admin creates the Driver
    // Driver does NOT register themselves
    // =========================================================

    @Transactional
    public User createDriver(
            String name,
            String email,
            String password,
            String phone,
            String gender,
            String employeeId,
            String licenseNo) {

        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email is already registered");
        }

        Role driverRole = roleRepository.findByRoleName("DRIVER")
                .orElseThrow(() ->
                        new RuntimeException("DRIVER role not found")
                );

        User user = new User();

        user.setName(name);
        user.setEmail(email);

        user.setPassword(
                passwordEncoder.encode(password)
        );

        user.setPhone(phone);
        user.setGender(gender);
        user.setRole(driverRole);

        User savedUser = userRepository.save(user);

        Driver driver = new Driver();

        driver.setUser(savedUser);

        driver.setEmployeeId(employeeId);
        driver.setLicenseNo(licenseNo);

        driverRepository.save(driver);

        return savedUser;
    }


    // =========================================================
    // CREATE CONDUCTOR
    // Admin creates the Conductor
    // Conductor does NOT register themselves
    // =========================================================

    @Transactional
    public User createConductor(
            String name,
            String email,
            String password,
            String phone,
            String gender,
            String employeeId,
            String licenseNo) {

        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email is already registered");
        }

        Role conductorRole = roleRepository.findByRoleName("CONDUCTOR")
                .orElseThrow(() ->
                        new RuntimeException("CONDUCTOR role not found")
                );

        User user = new User();

        user.setName(name);
        user.setEmail(email);

        user.setPassword(
                passwordEncoder.encode(password)
        );

        user.setPhone(phone);
        user.setGender(gender);
        user.setRole(conductorRole);

        User savedUser = userRepository.save(user);

        Conductor conductor = new Conductor();

        conductor.setUser(savedUser);

        conductor.setEmployeeId(employeeId);
        conductor.setLicenseNo(licenseNo);

        conductorRepository.save(conductor);

        return savedUser;
    }
}