package com.smartbus.backend.controller;

import com.smartbus.backend.entity.RouteStop;
import com.smartbus.backend.service.RouteStopService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/route-stops")
@CrossOrigin(origins = "http://localhost:3000")
public class RouteStopController {

    private final RouteStopService routeStopService;

    public RouteStopController(RouteStopService routeStopService) {
        this.routeStopService = routeStopService;
    }

    @PostMapping
    public RouteStop createRouteStop(
            @RequestBody RouteStop routeStop) {

        return routeStopService.saveRouteStop(routeStop);
    }

    @GetMapping
    public List<RouteStop> getAllRouteStops() {

        return routeStopService.getAllRouteStops();
    }

    @GetMapping("/{id}")
    public Optional<RouteStop> getRouteStopById(
            @PathVariable Integer id) {

        return routeStopService.getRouteStopById(id);
    }

    @PutMapping("/{id}")
    public RouteStop updateRouteStop(
            @PathVariable Integer id,
            @RequestBody RouteStop routeStopDetails) {

        return routeStopService.updateRouteStop(
                id,
                routeStopDetails
        );
    }

    @DeleteMapping("/{id}")
    public void deleteRouteStop(
            @PathVariable Integer id) {

        routeStopService.deleteRouteStop(id);
    }
}