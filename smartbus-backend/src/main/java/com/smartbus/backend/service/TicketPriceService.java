package com.smartbus.backend.service;

import com.smartbus.backend.entity.TicketPrice;
import com.smartbus.backend.repository.TicketPriceRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TicketPriceService {

    private final TicketPriceRepository ticketPriceRepository;

    public TicketPriceService(TicketPriceRepository ticketPriceRepository) {
        this.ticketPriceRepository = ticketPriceRepository;
    }

    // Create
    public TicketPrice saveTicketPrice(TicketPrice ticketPrice) {
        return ticketPriceRepository.save(ticketPrice);
    }

    // Get all
    public List<TicketPrice> getAllTicketPrices() {
        return ticketPriceRepository.findAll();
    }

    // Get by ID
    public Optional<TicketPrice> getTicketPriceById(Integer priceId) {
        return ticketPriceRepository.findById(priceId);
    }

    // Update
    public TicketPrice updateTicketPrice(
            Integer priceId,
            TicketPrice ticketPriceDetails) {

        TicketPrice existingTicketPrice =
                ticketPriceRepository.findById(priceId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Ticket price not found with id: "
                                                + priceId
                                )
                        );

        existingTicketPrice.setRoute(
                ticketPriceDetails.getRoute()
        );

        existingTicketPrice.setPickupPoint(
                ticketPriceDetails.getPickupPoint()
        );

        existingTicketPrice.setDropPoint(
                ticketPriceDetails.getDropPoint()
        );

        existingTicketPrice.setPrice(
                ticketPriceDetails.getPrice()
        );

        existingTicketPrice.setCurrency(
                ticketPriceDetails.getCurrency()
        );

        existingTicketPrice.setEffectiveDate(
                ticketPriceDetails.getEffectiveDate()
        );

        existingTicketPrice.setStatus(
                ticketPriceDetails.getStatus()
        );

        return ticketPriceRepository.save(existingTicketPrice);
    }

    // Delete
    public void deleteTicketPrice(Integer priceId) {
        ticketPriceRepository.deleteById(priceId);
    }
}