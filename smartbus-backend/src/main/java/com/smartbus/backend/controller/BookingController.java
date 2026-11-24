package com.smartbus.backend.controller;

import com.smartbus.backend.dto.BookedSeatResponse;
import com.smartbus.backend.dto.BookingRequest;
import com.smartbus.backend.dto.BookingResponse;
import com.smartbus.backend.service.BookingService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(
            BookingService bookingService) {

        this.bookingService = bookingService;
    }

    // ============================================================
    // CREATE BOOKING
    // ============================================================

    @PostMapping
    public BookingResponse createBooking(
            @RequestBody BookingRequest request,
            Authentication authentication) {

        return bookingService.createBooking(
                request,
                authentication.getName()
        );
    }

    // ============================================================
    // GET ALL BOOKINGS - ADMIN
    // ============================================================

    @GetMapping
    public List<BookingResponse> getAllBookings() {

        return bookingService.getAllBookings();
    }

    // ============================================================
    // GET BOOKING BY ID - ADMIN
    // ============================================================

    @GetMapping("/{id}")
    public Optional<BookingResponse> getBookingById(
            @PathVariable Integer id) {

        return bookingService.getBookingById(id);
    }

    // ============================================================
    // GET BOOKED SEATS FOR A SCHEDULE
    // ============================================================

    @GetMapping("/schedule/{scheduleId}/booked-seats")
    public List<BookedSeatResponse> getBookedSeatIds(
            @PathVariable Integer scheduleId) {

        return bookingService.getBookedSeatIds(
                scheduleId
        );
    }

    // ============================================================
    // DELETE BOOKING - ADMIN
    // ============================================================

    @DeleteMapping("/{id}")
    public void deleteBooking(
            @PathVariable Integer id) {

        bookingService.deleteBooking(id);
    }
}