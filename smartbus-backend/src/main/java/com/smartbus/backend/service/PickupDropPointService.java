package com.smartbus.backend.service;

import com.smartbus.backend.entity.PickupDropPoint;
import com.smartbus.backend.repository.PickupDropPointRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PickupDropPointService {

    private final PickupDropPointRepository pickupDropPointRepository;

    public PickupDropPointService(
            PickupDropPointRepository pickupDropPointRepository) {

        this.pickupDropPointRepository = pickupDropPointRepository;
    }

    // Create
    public PickupDropPoint savePickupDropPoint(
            PickupDropPoint pickupDropPoint) {

        return pickupDropPointRepository.save(pickupDropPoint);
    }

    // Get all
    public List<PickupDropPoint> getAllPickupDropPoints() {

        return pickupDropPointRepository.findAll();
    }

    // Get active pickup/drop points
    public List<PickupDropPoint> getActivePickupDropPoints() {

        return pickupDropPointRepository.findByStatusIgnoreCase("ACTIVE");
    }

    // Get by ID
    public Optional<PickupDropPoint> getPickupDropPointById(
            Integer pointId) {

        return pickupDropPointRepository.findById(pointId);
    }

    // Update
    public PickupDropPoint updatePickupDropPoint(
            Integer pointId,
            PickupDropPoint pointDetails) {

        PickupDropPoint existingPoint =
                pickupDropPointRepository.findById(pointId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Pickup/drop point not found with id: "
                                                + pointId
                                )
                        );

        existingPoint.setRoute(pointDetails.getRoute());
        existingPoint.setPointName(pointDetails.getPointName());
        existingPoint.setPointType(pointDetails.getPointType());
        existingPoint.setStopOrder(pointDetails.getStopOrder());
        existingPoint.setStatus(pointDetails.getStatus());

        return pickupDropPointRepository.save(existingPoint);
    }

    // Delete
    public void deletePickupDropPoint(Integer pointId) {

        pickupDropPointRepository.deleteById(pointId);
    }
}