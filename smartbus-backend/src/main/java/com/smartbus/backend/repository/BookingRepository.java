package com.smartbus.backend.repository;

import com.smartbus.backend.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BookingRepository
        extends JpaRepository<Booking, Integer> {

    Optional<Booking> findBySchedule_ScheduleIdAndSeat_SeatIdAndStatus(
            Integer scheduleId,
            Integer seatId,
            String status
    );

    List<Booking> findByUser_Email(String email);

    List<Booking> findBySchedule_ScheduleIdAndStatus(
            Integer scheduleId,
            String status
    );

    // Get all bookings for a particular schedule
    List<Booking> findBySchedule_ScheduleId(Integer scheduleId);
}

