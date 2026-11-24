package com.smartbus.backend.service;

import com.smartbus.backend.entity.RouteStop;
import com.smartbus.backend.repository.RouteStopRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RouteStopService {

    private final RouteStopRepository routeStopRepository;

    public RouteStopService(RouteStopRepository routeStopRepository) {
        this.routeStopRepository = routeStopRepository;
    }

    public RouteStop saveRouteStop(RouteStop routeStop) {
        return routeStopRepository.save(routeStop);
    }

    public List<RouteStop> getAllRouteStops() {
        return routeStopRepository.findAll();
    }

    public Optional<RouteStop> getRouteStopById(Integer routeStopId) {
        return routeStopRepository.findById(routeStopId);
    }

    public RouteStop updateRouteStop(
            Integer routeStopId,
            RouteStop routeStopDetails) {

        RouteStop existingRouteStop =
                routeStopRepository.findById(routeStopId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Route stop not found with id: "
                                                + routeStopId
                                )
                        );

        existingRouteStop.setRoute(
                routeStopDetails.getRoute()
        );

        existingRouteStop.setStopName(
                routeStopDetails.getStopName()
        );

        existingRouteStop.setStopOrder(
                routeStopDetails.getStopOrder()
        );

        existingRouteStop.setEstimatedTime(
                routeStopDetails.getEstimatedTime()
        );

        return routeStopRepository.save(existingRouteStop);
    }

    public void deleteRouteStop(Integer routeStopId) {
        routeStopRepository.deleteById(routeStopId);
    }
}