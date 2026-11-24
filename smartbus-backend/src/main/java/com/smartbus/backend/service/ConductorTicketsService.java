
package com.smartbus.backend.service;

import com.smartbus.backend.dto.ConductorTicketResponse;
import com.smartbus.backend.entity.Booking;
import com.smartbus.backend.entity.ConductorAssignment;
import com.smartbus.backend.entity.Ticket;
import com.smartbus.backend.entity.User;
import com.smartbus.backend.repository.BookingRepository;
import com.smartbus.backend.repository.ConductorAssignmentRepository;
import com.smartbus.backend.repository.TicketRepository;
import com.smartbus.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ConductorTicketsService {

    private final TicketRepository ticketRepository;
    private final ConductorAssignmentRepository conductorAssignmentRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;

    public ConductorTicketsService(
            TicketRepository ticketRepository,
            ConductorAssignmentRepository conductorAssignmentRepository,
            UserRepository userRepository,
            BookingRepository bookingRepository) {

        this.ticketRepository = ticketRepository;
        this.conductorAssignmentRepository = conductorAssignmentRepository;
        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
    }

    @Transactional(readOnly = true)
    public List<ConductorTicketResponse> getTickets(String email) {

        Integer scheduleId = getAssignedScheduleId(email);

        return ticketRepository
                .findByBooking_Schedule_ScheduleId(scheduleId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public ConductorTicketResponse verifyTicket(
            Integer ticketId,
            String email) {

        Integer scheduleId = getAssignedScheduleId(email);

        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() ->
                        new RuntimeException("Ticket not found"));

        Booking booking = ticket.getBooking();

        if (!booking.getSchedule().getScheduleId().equals(scheduleId)) {
            throw new RuntimeException(
                    "This ticket does not belong to your assigned trip");
        }

        if (!"BOOKED".equalsIgnoreCase(booking.getStatus())) {
            throw new RuntimeException(
                    "Only tickets with an active booking can be verified");
        }

        if ("CHECKED".equalsIgnoreCase(ticket.getStatus())) {
            throw new RuntimeException("This ticket has already been verified");
        }

        if (!"ACTIVE".equalsIgnoreCase(ticket.getStatus())) {
            throw new RuntimeException("This ticket is not active");
        }

        ticket.setStatus("CHECKED");

        Ticket savedTicket = ticketRepository.save(ticket);

        return toResponse(savedTicket);
    }

    private Integer getAssignedScheduleId(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Conductor account not found"));

        List<ConductorAssignment> assignments =
                conductorAssignmentRepository
                        .findByConductor_UserId(user.getUserId());

        if (assignments.isEmpty()) {
            throw new RuntimeException(
                    "No schedule assigned to this conductor");
        }

        return assignments.get(0).getSchedule().getScheduleId();
    }

    private ConductorTicketResponse toResponse(Ticket ticket) {

        Booking booking = ticket.getBooking();

        return new ConductorTicketResponse(
                ticket.getTicketId(),
                booking.getBookingId(),
                ticket.getTicketNumber(),
                booking.getUser().getName(),
                booking.getSeat().getSeatNumber(),
                booking.getDropPoint().getPointName(),
                ticket.getStatus(),
                booking.getStatus()
        );
    }
}
