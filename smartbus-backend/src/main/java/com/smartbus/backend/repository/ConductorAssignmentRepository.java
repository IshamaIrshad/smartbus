package com.smartbus.backend.repository;

import com.smartbus.backend.entity.ConductorAssignment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ConductorAssignmentRepository
        extends JpaRepository<ConductorAssignment, Integer> {

    List<ConductorAssignment> findByConductor_UserId(Integer userId);

    Optional<ConductorAssignment>
    findFirstBySchedule_ScheduleId(Integer scheduleId);
}
