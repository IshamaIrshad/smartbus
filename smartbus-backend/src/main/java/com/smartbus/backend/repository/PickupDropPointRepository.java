package com.smartbus.backend.repository;

import com.smartbus.backend.entity.PickupDropPoint;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PickupDropPointRepository
        extends JpaRepository<PickupDropPoint, Integer> {

    List<PickupDropPoint> findByStatusIgnoreCase(String status);
}