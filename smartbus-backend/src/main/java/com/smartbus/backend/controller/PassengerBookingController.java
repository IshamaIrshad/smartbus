package com.smartbus.backend.controller;

import com.smartbus.backend.dto.BookingResponse;
import com.smartbus.backend.dto.CancelBookingRequest;
import com.smartbus.backend.service.BookingService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/passenger/bookings")
@CrossOrigin(origins = "http://localhost:3000")
public class PassengerBookingController {

    private final BookingService bookingService;

    public PassengerBookingController(
            BookingService bookingService) {

        this.bookingService = bookingService;
    }

    // VIEW MY BOOKINGS
    @GetMapping
    public List<BookingResponse> getMyBookings(
            Authentication authentication) {

        return bookingService.getMyBookings(
                authentication.getName()
        );
    }

    // CANCEL MY BOOKING
    @PutMapping("/{bookingId}/cancel")
    public BookingResponse cancelMyBooking(
            @PathVariable Integer bookingId,
            @RequestBody CancelBookingRequest request,
            Authentication authentication) {

        return bookingService.cancelMyBooking(
                bookingId,
                request,
                authentication.getName()
        );
    }
}
