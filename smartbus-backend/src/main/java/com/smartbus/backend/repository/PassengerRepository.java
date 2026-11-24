package com.smartbus.backend.repository;

import com.smartbus.backend.entity.Passenger;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PassengerRepository
        extends JpaRepository<Passenger, Integer> {

    Optional<Passenger> findByUser_Email(String email);
}