package com.smartbus.backend.service;

import com.smartbus.backend.dto.ConductorProfileResponse;
import com.smartbus.backend.entity.Conductor;
import com.smartbus.backend.entity.User;
import com.smartbus.backend.repository.ConductorRepository;
import com.smartbus.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ConductorService {

    private final ConductorRepository conductorRepository;
    private final UserRepository userRepository;

    public ConductorService(
            ConductorRepository conductorRepository,
            UserRepository userRepository) {

        this.conductorRepository = conductorRepository;
        this.userRepository = userRepository;
    }

    // Create conductor
    public Conductor saveConductor(Conductor conductor) {
        return conductorRepository.save(conductor);
    }

    // Get all conductors
    public List<Conductor> getAllConductors() {
        return conductorRepository.findAll();
    }

    // Get conductor by user ID
    public Optional<Conductor> getConductorById(Integer userId) {
        return conductorRepository.findById(userId);
    }

    // Update conductor
    public Conductor updateConductor(
            Integer userId,
            Conductor conductorDetails) {

        Conductor existingConductor =
                conductorRepository.findById(userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Conductor not found with user id: "
                                                + userId
                                )
                        );

        existingConductor.setEmployeeId(
                conductorDetails.getEmployeeId()
        );

        existingConductor.setLicenseNo(
                conductorDetails.getLicenseNo()
        );

        return conductorRepository.save(existingConductor);
    }

    // Delete conductor
    public void deleteConductor(Integer userId) {
        conductorRepository.deleteById(userId);
    }

    // Get logged-in conductor profile
    public ConductorProfileResponse getMyProfile(String email) {

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

        return new ConductorProfileResponse(
                user.getUserId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getGender(),
                conductor.getEmployeeId(),
                conductor.getLicenseNo()
        );
    }
}