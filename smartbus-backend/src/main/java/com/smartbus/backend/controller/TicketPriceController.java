package com.smartbus.backend.controller;

import com.smartbus.backend.entity.TicketPrice;
import com.smartbus.backend.service.TicketPriceService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/ticket-prices")
@CrossOrigin(origins = "http://localhost:3000")
public class TicketPriceController {

    private final TicketPriceService ticketPriceService;

    public TicketPriceController(TicketPriceService ticketPriceService) {
        this.ticketPriceService = ticketPriceService;
    }

    // Create ticket price
    @PostMapping
    public TicketPrice createTicketPrice(@RequestBody TicketPrice ticketPrice) {
        return ticketPriceService.saveTicketPrice(ticketPrice);
    }

    // Get all ticket prices
    @GetMapping
    public List<TicketPrice> getAllTicketPrices() {
        return ticketPriceService.getAllTicketPrices();
    }

    // Get ticket price by ID
    @GetMapping("/{id}")
    public Optional<TicketPrice> getTicketPriceById(@PathVariable Integer id) {
        return ticketPriceService.getTicketPriceById(id);
    }

    // Update ticket price
    @PutMapping("/{id}")
    public TicketPrice updateTicketPrice(
            @PathVariable Integer id,
            @RequestBody TicketPrice ticketPriceDetails) {

        return ticketPriceService.updateTicketPrice(
                id,
                ticketPriceDetails
        );
    }

    // Delete ticket price
    @DeleteMapping("/{id}")
    public void deleteTicketPrice(@PathVariable Integer id) {
        ticketPriceService.deleteTicketPrice(id);
    }
}