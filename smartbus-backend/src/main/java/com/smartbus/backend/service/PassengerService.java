package com.smartbus.backend.service;

import com.smartbus.backend.dto.PassengerProfileRequest;
import com.smartbus.backend.entity.Passenger;
import com.smartbus.backend.repository.PassengerRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class PassengerService {

    private final PassengerRepository passengerRepository;

    public PassengerService(PassengerRepository passengerRepository) {
        this.passengerRepository = passengerRepository;
    }

    // Create passenger
    public Passenger savePassenger(Passenger passenger) {
        return passengerRepository.save(passenger);
    }

    // Get all passengers
    public List<Passenger> getAllPassengers() {
        return passengerRepository.findAll();
    }

    // Get passenger by ID
    public Optional<Passenger> getPassengerById(Integer id) {
        return passengerRepository.findById(id);
    }

    // Get logged-in passenger by email
    public Optional<Passenger> getPassengerByEmail(String email) {
        return passengerRepository.findByUser_Email(email);
    }

    // Update passenger profile
    public Passenger updatePassengerProfile(
            Integer userId,
            PassengerProfileRequest request) {

        Passenger passenger = passengerRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Passenger not found with user id: " + userId
                        )
                );

        passenger.setNic(request.getNic());

        if (request.getDateOfBirth() != null
                && !request.getDateOfBirth().isBlank()) {

            passenger.setDateOfBirth(
                    LocalDate.parse(request.getDateOfBirth())
            );

        } else {
            passenger.setDateOfBirth(null);
        }

        passenger.setAddress(request.getAddress());

        return passengerRepository.save(passenger);
    }

    // Delete passenger
    public void deletePassenger(Integer id) {
        passengerRepository.deleteById(id);
    }
}