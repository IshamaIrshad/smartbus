package com.smartbus.backend.repository;

import com.smartbus.backend.entity.TicketPrice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TicketPriceRepository
        extends JpaRepository<TicketPrice, Integer> {

    Optional<TicketPrice>
    findByRoute_RouteIdAndPickupPoint_PointIdAndDropPoint_PointIdAndStatus(
            Integer routeId,
            Integer pickupPointId,
            Integer dropPointId,
            String status
    );
}