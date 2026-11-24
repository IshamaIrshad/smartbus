
package com.smartbus.backend.controller;

import com.smartbus.backend.dto.ConductorTicketResponse;
import com.smartbus.backend.service.ConductorTicketsService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/conductor/tickets")
@CrossOrigin(origins = "http://localhost:3000")
public class ConductorTicketsController {

    private final ConductorTicketsService conductorTicketsService;

    public ConductorTicketsController(
            ConductorTicketsService conductorTicketsService) {
        this.conductorTicketsService = conductorTicketsService;
    }

    @GetMapping
    public List<ConductorTicketResponse> getTickets(
            Authentication authentication) {

        return conductorTicketsService.getTickets(
                authentication.getName());
    }

    @PutMapping("/{ticketId}/verify")
    public ConductorTicketResponse verifyTicket(
            @PathVariable Integer ticketId,
            Authentication authentication) {

        return conductorTicketsService.verifyTicket(
                ticketId,
                authentication.getName());
    }
}