package com.smartbus.backend.repository;

import com.smartbus.backend.entity.DriverAssignment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DriverAssignmentRepository
        extends JpaRepository<DriverAssignment, Integer> {

    // Find one assignment for a driver
    Optional<DriverAssignment> findFirstByDriver_UserId(Integer userId);

    // Find all assignments for a driver
    List<DriverAssignment> findByDriver_UserId(Integer userId);

    // Find the driver assigned to a specific schedule
    Optional<DriverAssignment> findFirstBySchedule_ScheduleId(Integer scheduleId);
}