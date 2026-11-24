package com.smartbus.backend.controller;

import com.smartbus.backend.entity.Bus;
import com.smartbus.backend.service.BusService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/buses")
@CrossOrigin(origins = "http://localhost:3000")
public class BusController {

    private final BusService busService;

    public BusController(BusService busService) {
        this.busService = busService;
    }

    @PostMapping
    public Bus createBus(@RequestBody Bus bus) {
        return busService.saveBus(bus);
    }

    @GetMapping
    public List<Bus> getAllBuses() {
        return busService.getAllBuses();
    }

    @GetMapping("/{id}")
    public Optional<Bus> getBusById(@PathVariable Integer id) {
        return busService.getBusById(id);
    }

    @PutMapping("/{id}")
    public Bus updateBus(
            @PathVariable Integer id,
            @RequestBody Bus busDetails) {

        return busService.updateBus(id, busDetails);
    }

    @DeleteMapping("/{id}")
    public void deleteBus(@PathVariable Integer id) {
        busService.deleteBus(id);
    }
}