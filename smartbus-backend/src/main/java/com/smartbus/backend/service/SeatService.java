package com.smartbus.backend.service;

import com.smartbus.backend.entity.Seat;
import com.smartbus.backend.repository.SeatRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SeatService {

    private final SeatRepository seatRepository;

    public SeatService(SeatRepository seatRepository) {
        this.seatRepository = seatRepository;
    }

    // Create
    public Seat saveSeat(Seat seat) {
        return seatRepository.save(seat);
    }

    // Get all
    public List<Seat> getAllSeats() {
        return seatRepository.findAll();
    }

    // Get by ID
    public Optional<Seat> getSeatById(Integer seatId) {
        return seatRepository.findById(seatId);
    }

    // Update
    public Seat updateSeat(
            Integer seatId,
            Seat seatDetails) {

        Seat existingSeat =
                seatRepository.findById(seatId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Seat not found with id: "
                                                + seatId
                                )
                        );

        existingSeat.setBus(
                seatDetails.getBus()
        );

        existingSeat.setSeatNumber(
                seatDetails.getSeatNumber()
        );

        existingSeat.setSeatType(
                seatDetails.getSeatType()
        );

        existingSeat.setStatus(
                seatDetails.getStatus()
        );

        return seatRepository.save(existingSeat);
    }

    // Delete
    public void deleteSeat(Integer seatId) {
        seatRepository.deleteById(seatId);
    }
}