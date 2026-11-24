package com.smartbus.backend.controller;

import com.smartbus.backend.entity.Seat;
import com.smartbus.backend.service.SeatService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/seats")
@CrossOrigin(origins = "http://localhost:3000")
public class SeatController {

    private final SeatService seatService;

    public SeatController(SeatService seatService) {
        this.seatService = seatService;
    }

    // Create seat
    @PostMapping
    public Seat createSeat(@RequestBody Seat seat) {
        return seatService.saveSeat(seat);
    }

    // Get all seats
    @GetMapping
    public List<Seat> getAllSeats() {
        return seatService.getAllSeats();
    }

    // Get seat by ID
    @GetMapping("/{id}")
    public Optional<Seat> getSeatById(@PathVariable Integer id) {
        return seatService.getSeatById(id);
    }

    // Update seat
    @PutMapping("/{id}")
    public Seat updateSeat(
            @PathVariable Integer id,
            @RequestBody Seat seatDetails) {

        return seatService.updateSeat(
                id,
                seatDetails
        );
    }

    // Delete seat
    @DeleteMapping("/{id}")
    public void deleteSeat(@PathVariable Integer id) {
        seatService.deleteSeat(id);
    }
}