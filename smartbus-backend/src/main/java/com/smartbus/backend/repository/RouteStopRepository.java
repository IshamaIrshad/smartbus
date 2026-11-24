package com.smartbus.backend.repository;

import com.smartbus.backend.entity.RouteStop;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RouteStopRepository extends JpaRepository<RouteStop, Integer> {
}