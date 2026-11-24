package com.smartbus.backend.controller;

import com.smartbus.backend.dto.TicketResponse;
import com.smartbus.backend.entity.Ticket;
import com.smartbus.backend.service.PdfTicketService;
import com.smartbus.backend.service.TicketService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "http://localhost:3000")
public class TicketController {

    private final TicketService ticketService;
    private final PdfTicketService pdfTicketService;

    public TicketController(
            TicketService ticketService,
            PdfTicketService pdfTicketService) {

        this.ticketService = ticketService;
        this.pdfTicketService = pdfTicketService;
    }

    @PostMapping("/booking/{bookingId}")
    public TicketResponse generateTicket(
            @PathVariable Integer bookingId,
            Authentication authentication) {

        return ticketService.generateTicket(
                bookingId,
                authentication.getName()
        );
    }

    @GetMapping("/booking/{bookingId}")
    public Optional<TicketResponse> getMyTicket(
            @PathVariable Integer bookingId,
            Authentication authentication) {

        return ticketService.getMyTicket(
                bookingId,
                authentication.getName()
        );
    }

    // DOWNLOAD PDF TICKET
    @GetMapping("/booking/{bookingId}/pdf")
    public ResponseEntity<byte[]> downloadTicketPdf(
            @PathVariable Integer bookingId,
            Authentication authentication) {

        byte[] pdf =
                pdfTicketService.generateTicketPdf(
                        bookingId,
                        authentication.getName()
                );

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=SmartBus-Ticket-"
                                + bookingId
                                + ".pdf"
                )
                .contentType(
                        MediaType.APPLICATION_PDF
                )
                .body(pdf);
    }

    @GetMapping
    public List<Ticket> getAllTickets() {
        return ticketService.getAllTickets();
    }

    @GetMapping("/{id}")
    public Optional<Ticket> getTicketById(
            @PathVariable Integer id) {

        return ticketService.getTicketById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteTicket(
            @PathVariable Integer id) {

        ticketService.deleteTicket(id);
    }
}