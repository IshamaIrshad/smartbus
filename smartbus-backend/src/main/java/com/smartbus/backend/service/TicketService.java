package com.smartbus.backend.service;

import com.smartbus.backend.dto.TicketResponse;
import com.smartbus.backend.entity.Booking;
import com.smartbus.backend.entity.Ticket;
import com.smartbus.backend.repository.BookingRepository;
import com.smartbus.backend.repository.TicketRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final BookingRepository bookingRepository;
    private final QrCodeService qrCodeService;

    public TicketService(
            TicketRepository ticketRepository,
            BookingRepository bookingRepository,
            QrCodeService qrCodeService) {

        this.ticketRepository = ticketRepository;
        this.bookingRepository = bookingRepository;
        this.qrCodeService = qrCodeService;
    }

    public Ticket saveTicket(Ticket ticket) {
        return ticketRepository.save(ticket);
    }

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    public Optional<Ticket> getTicketById(Integer ticketId) {
        return ticketRepository.findById(ticketId);
    }

    public void deleteTicket(Integer ticketId) {
        ticketRepository.deleteById(ticketId);
    }

    @Transactional
    public TicketResponse generateTicket(
            Integer bookingId,
            String email) {

        Booking booking = bookingRepository
                .findById(bookingId)
                .orElseThrow(() ->
                        new RuntimeException("Booking not found"));

        if (!booking.getUser()
                .getEmail()
                .equalsIgnoreCase(email)) {

            throw new RuntimeException(
                    "You can only generate a ticket for your own booking");
        }

        if (!"BOOKED".equalsIgnoreCase(
                booking.getStatus())) {

            throw new RuntimeException(
                    "Ticket can only be generated for a booked reservation");
        }

        Optional<Ticket> existingTicket =
                ticketRepository
                        .findByBooking_BookingId(bookingId);

        if (existingTicket.isPresent()) {
            return convertToResponse(existingTicket.get());
        }

        Ticket ticket = new Ticket();

        ticket.setBooking(booking);

        String ticketNumber =
                "SB-" +
                        UUID.randomUUID()
                                .toString()
                                .substring(0, 8)
                                .toUpperCase();

        ticket.setTicketNumber(ticketNumber);

        String qrCodeData =
                "SMARTBUS|" +
                        "TICKET=" +
                        ticketNumber +
                        "|BOOKING=" +
                        booking.getBookingId();

        ticket.setQrCode(qrCodeData);

        ticket.setIssuedDate(
                LocalDateTime.now()
        );

        ticket.setStatus("ACTIVE");

        Ticket savedTicket =
                ticketRepository.save(ticket);

        return convertToResponse(savedTicket);
    }

    public Optional<TicketResponse> getMyTicket(
            Integer bookingId,
            String email) {

        Booking booking = bookingRepository
                .findById(bookingId)
                .orElseThrow(() ->
                        new RuntimeException("Booking not found"));

        if (!booking.getUser()
                .getEmail()
                .equalsIgnoreCase(email)) {

            throw new RuntimeException(
                    "You can only view your own ticket");
        }

        return ticketRepository
                .findByBooking_BookingId(bookingId)
                .map(this::convertToResponse);
    }

    private TicketResponse convertToResponse(
            Ticket ticket) {

        Booking booking = ticket.getBooking();

        String qrCodeImage =
                qrCodeService.generateQrCodeBase64(
                        ticket.getQrCode()
                );

        return new TicketResponse(
                ticket.getTicketId(),
                booking.getBookingId(),
                booking.getUser().getName(),
                booking.getUser().getEmail(),

                booking.getSchedule()
                        .getBus()
                        .getBusName(),

                booking.getSchedule()
                        .getBus()
                        .getRegistrationNumber(),

                booking.getSchedule()
                        .getRoute()
                        .getRouteName(),

                booking.getSeat()
                        .getSeatNumber(),

                booking.getPickupPoint()
                        .getPointName(),

                booking.getDropPoint()
                        .getPointName(),

                booking.getSchedule()
                        .getTravelDate(),

                booking.getSchedule()
                        .getDepartureTime(),

                booking.getSchedule()
                        .getArrivalTime(),

                booking.getTotalPrice(),

                ticket.getTicketNumber(),

                ticket.getQrCode(),

                qrCodeImage,

                ticket.getStatus(),

                ticket.getIssuedDate()
        );
    }
}