package com.smartbus.backend.controller;

import com.smartbus.backend.entity.CancelBooking;
import com.smartbus.backend.service.CancelBookingService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/cancel-bookings")
@CrossOrigin(origins = "http://localhost:3000")
public class CancelBookingController {

    private final CancelBookingService cancelBookingService;

    public CancelBookingController(CancelBookingService cancelBookingService) {
        this.cancelBookingService = cancelBookingService;
    }

    @PostMapping
    public CancelBooking createCancelBooking(
            @RequestBody CancelBooking cancelBooking) {
        return cancelBookingService.saveCancelBooking(cancelBooking);
    }

    @GetMapping
    public List<CancelBooking> getAllCancelBookings() {
        return cancelBookingService.getAllCancelBookings();
    }

    @GetMapping("/{id}")
    public Optional<CancelBooking> getCancelBookingById(
            @PathVariable Integer id) {
        return cancelBookingService.getCancelBookingById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteCancelBooking(@PathVariable Integer id) {
        cancelBookingService.deleteCancelBooking(id);
    }
}