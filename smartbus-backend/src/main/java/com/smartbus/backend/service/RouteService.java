package com.smartbus.backend.service;

import com.smartbus.backend.entity.Route;
import com.smartbus.backend.repository.RouteRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RouteService {

    private final RouteRepository routeRepository;

    public RouteService(RouteRepository routeRepository) {
        this.routeRepository = routeRepository;
    }

    public Route saveRoute(Route route) {
        return routeRepository.save(route);
    }

    public List<Route> getAllRoutes() {
        return routeRepository.findAll();
    }

    public Optional<Route> getRouteById(Integer routeId) {
        return routeRepository.findById(routeId);
    }

    public Route updateRoute(Integer routeId, Route routeDetails) {

        Route existingRoute = routeRepository.findById(routeId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Route not found with id: " + routeId
                        )
                );

        existingRoute.setRouteName(
                routeDetails.getRouteName()
        );

        existingRoute.setDistance(
                routeDetails.getDistance()
        );

        existingRoute.setStatus(
                routeDetails.getStatus()
        );

        return routeRepository.save(existingRoute);
    }

    public void deleteRoute(Integer routeId) {
        routeRepository.deleteById(routeId);
    }
}