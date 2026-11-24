package com.smartbus.backend.service;

import com.smartbus.backend.entity.Bus;
import com.smartbus.backend.repository.BusRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BusService {

    private final BusRepository busRepository;

    public BusService(BusRepository busRepository) {
        this.busRepository = busRepository;
    }

    public Bus saveBus(Bus bus) {
        return busRepository.save(bus);
    }

    public List<Bus> getAllBuses() {
        return busRepository.findAll();
    }

    public Optional<Bus> getBusById(Integer busId) {
        return busRepository.findById(busId);
    }

    public Bus updateBus(Integer busId, Bus busDetails) {

        Bus existingBus = busRepository.findById(busId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Bus not found with id: " + busId
                        )
                );

        existingBus.setRegistrationNumber(
                busDetails.getRegistrationNumber()
        );

        existingBus.setBusName(
                busDetails.getBusName()
        );

        existingBus.setBusType(
                busDetails.getBusType()
        );

        existingBus.setCapacity(
                busDetails.getCapacity()
        );

        existingBus.setStatus(
                busDetails.getStatus()
        );

        return busRepository.save(existingBus);
    }

    public void deleteBus(Integer busId) {
        busRepository.deleteById(busId);
    }
}