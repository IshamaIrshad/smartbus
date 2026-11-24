package com.smartbus.backend.repository;

import com.smartbus.backend.entity.BusLocation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BusLocationRepository
        extends JpaRepository<BusLocation, Integer> {

    Optional<BusLocation> findFirstBySchedule_ScheduleIdOrderByRecordedAtDesc(
            Integer scheduleId
    );
}