package com.smartbus.backend.controller;

import com.smartbus.backend.entity.Route;
import com.smartbus.backend.service.RouteService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/routes")
@CrossOrigin(origins = "http://localhost:3000")
public class RouteController {

    private final RouteService routeService;

    public RouteController(RouteService routeService) {
        this.routeService = routeService;
    }

    @PostMapping
    public Route createRoute(@RequestBody Route route) {
        return routeService.saveRoute(route);
    }

    @GetMapping
    public List<Route> getAllRoutes() {
        return routeService.getAllRoutes();
    }

    @GetMapping("/{id}")
    public Optional<Route> getRouteById(
            @PathVariable Integer id) {

        return routeService.getRouteById(id);
    }

    @PutMapping("/{id}")
    public Route updateRoute(
            @PathVariable Integer id,
            @RequestBody Route routeDetails) {

        return routeService.updateRoute(id, routeDetails);
    }

    @DeleteMapping("/{id}")
    public void deleteRoute(@PathVariable Integer id) {
        routeService.deleteRoute(id);
    }
}