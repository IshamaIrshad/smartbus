package com.smartbus.backend.service;

import com.smartbus.backend.dto.ConductorPassengerResponse;
import com.smartbus.backend.entity.Booking;
import com.smartbus.backend.entity.ConductorAssignment;
import com.smartbus.backend.entity.User;
import com.smartbus.backend.repository.BookingRepository;
import com.smartbus.backend.repository.ConductorAssignmentRepository;
import com.smartbus.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ConductorPassengersService {

    private final BookingRepository bookingRepository;
    private final ConductorAssignmentRepository conductorAssignmentRepository;
    private final UserRepository userRepository;

    public ConductorPassengersService(
            BookingRepository bookingRepository,
            ConductorAssignmentRepository conductorAssignmentRepository,
            UserRepository userRepository
    ) {
        this.bookingRepository = bookingRepository;
        this.conductorAssignmentRepository = conductorAssignmentRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<ConductorPassengerResponse> getPassengers(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Conductor account not found"));

        List<ConductorAssignment> assignments =
                conductorAssignmentRepository.findByConductor_UserId(
                        user.getUserId()
                );

        if (assignments.isEmpty()) {
            throw new RuntimeException(
                    "No schedule assigned to this conductor"
            );
        }

        // Use the conductor's assigned schedule.
        Integer scheduleId = assignments.get(0)
                .getSchedule()
                .getScheduleId();

        List<Booking> bookings =
                bookingRepository.findBySchedule_ScheduleId(scheduleId);

        return bookings.stream()
                .map(booking -> new ConductorPassengerResponse(
                        booking.getBookingId(),
                        booking.getUser().getName(),
                        booking.getSeat().getSeatNumber(),
                        booking.getPickupPoint().getPointName(),
                        booking.getDropPoint().getPointName(),
                        booking.getPassengerGender(),
                        booking.getStatus()
                ))
                .toList();
    }
}


