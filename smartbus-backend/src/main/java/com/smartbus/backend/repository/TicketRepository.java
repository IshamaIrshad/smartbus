
package com.smartbus.backend.repository;

import com.smartbus.backend.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TicketRepository
        extends JpaRepository<Ticket, Integer> {

    Optional<Ticket> findByBooking_BookingId(Integer bookingId);

    Optional<Ticket> findByTicketNumber(String ticketNumber);

    List<Ticket> findByBooking_Schedule_ScheduleId(Integer scheduleId);
}