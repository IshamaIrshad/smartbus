package com.smartbus.backend.repository;

import com.smartbus.backend.entity.Route;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RouteRepository extends JpaRepository<Route, Integer> {
}