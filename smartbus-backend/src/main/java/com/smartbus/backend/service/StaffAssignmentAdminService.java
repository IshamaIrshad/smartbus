
package com.smartbus.backend.service;

import com.smartbus.backend.dto.StaffAssignmentDataResponse;
import com.smartbus.backend.dto.StaffAssignmentDataResponse.AssignmentRequest;
import com.smartbus.backend.dto.StaffAssignmentDataResponse.AssignmentRow;
import com.smartbus.backend.dto.StaffAssignmentDataResponse.ScheduleOption;
import com.smartbus.backend.dto.StaffAssignmentDataResponse.StaffOption;

import com.smartbus.backend.entity.Conductor;
import com.smartbus.backend.entity.ConductorAssignment;
import com.smartbus.backend.entity.Driver;
import com.smartbus.backend.entity.DriverAssignment;
import com.smartbus.backend.entity.Schedule;

import com.smartbus.backend.repository.ConductorAssignmentRepository;
import com.smartbus.backend.repository.ConductorRepository;
import com.smartbus.backend.repository.DriverAssignmentRepository;
import com.smartbus.backend.repository.DriverRepository;
import com.smartbus.backend.repository.ScheduleRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class StaffAssignmentAdminService {

    private final ScheduleRepository scheduleRepository;
    private final DriverRepository driverRepository;
    private final ConductorRepository conductorRepository;
    private final DriverAssignmentRepository driverAssignmentRepository;
    private final ConductorAssignmentRepository conductorAssignmentRepository;

    public StaffAssignmentAdminService(
            ScheduleRepository scheduleRepository,
            DriverRepository driverRepository,
            ConductorRepository conductorRepository,
            DriverAssignmentRepository driverAssignmentRepository,
            ConductorAssignmentRepository conductorAssignmentRepository) {

        this.scheduleRepository = scheduleRepository;
        this.driverRepository = driverRepository;
        this.conductorRepository = conductorRepository;
        this.driverAssignmentRepository = driverAssignmentRepository;
        this.conductorAssignmentRepository = conductorAssignmentRepository;
    }

    @Transactional(readOnly = true)
    public StaffAssignmentDataResponse getAssignmentData() {

        List<ScheduleOption> schedules = scheduleRepository.findAll()
                .stream()
                .map(schedule -> new ScheduleOption(
                        schedule.getScheduleId(),
                        schedule.getTravelDate(),
                        schedule.getDepartureTime(),
                        schedule.getArrivalTime(),
                        schedule.getBus().getBusId(),
                        schedule.getBus().getBusName(),
                        schedule.getBus().getRegistrationNumber(),
                        schedule.getRoute().getRouteId(),
                        schedule.getRoute().getRouteName()
                ))
                .toList();

        List<StaffOption> drivers = driverRepository.findAll()
                .stream()
                .map(this::toDriverOption)
                .toList();

        List<StaffOption> conductors = conductorRepository.findAll()
                .stream()
                .map(this::toConductorOption)
                .toList();

        List<AssignmentRow> driverAssignments =
                driverAssignmentRepository.findAll()
                        .stream()
                        .map(this::toDriverAssignmentRow)
                        .toList();

        List<AssignmentRow> conductorAssignments =
                conductorAssignmentRepository.findAll()
                        .stream()
                        .map(this::toConductorAssignmentRow)
                        .toList();

        return new StaffAssignmentDataResponse(
                schedules,
                drivers,
                conductors,
                driverAssignments,
                conductorAssignments
        );
    }

    @Transactional
    public AssignmentRow assignDriver(AssignmentRequest request) {

        validateRequest(request);

        Schedule schedule = getSchedule(request.scheduleId());

        Driver driver = driverRepository.findById(request.staffId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Driver profile not found"));

        if (driverAssignmentRepository
                .findFirstBySchedule_ScheduleId(request.scheduleId())
                .isPresent()) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "This schedule already has a driver. Remove the existing assignment first."
            );
        }

        DriverAssignment assignment = new DriverAssignment();
        assignment.setSchedule(schedule);
        assignment.setDriver(driver);
        assignment.setAssignedAt(LocalDateTime.now());

        return toDriverAssignmentRow(
                driverAssignmentRepository.save(assignment)
        );
    }

    @Transactional
    public AssignmentRow assignConductor(AssignmentRequest request) {

        validateRequest(request);

        Schedule schedule = getSchedule(request.scheduleId());

        Conductor conductor = conductorRepository
                .findById(request.staffId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Conductor profile not found"));

        if (conductorAssignmentRepository
                .findFirstBySchedule_ScheduleId(request.scheduleId())
                .isPresent()) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "This schedule already has a conductor. Remove the existing assignment first."
            );
        }

        ConductorAssignment assignment = new ConductorAssignment();
        assignment.setSchedule(schedule);
        assignment.setConductor(conductor);
        assignment.setAssignedAt(LocalDateTime.now());

        return toConductorAssignmentRow(
                conductorAssignmentRepository.save(assignment)
        );
    }

    @Transactional
    public void removeDriverAssignment(Integer assignmentId) {

        if (!driverAssignmentRepository.existsById(assignmentId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Driver assignment not found");
        }

        driverAssignmentRepository.deleteById(assignmentId);
    }

    @Transactional
    public void removeConductorAssignment(Integer assignmentId) {

        if (!conductorAssignmentRepository.existsById(assignmentId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Conductor assignment not found");
        }

        conductorAssignmentRepository.deleteById(assignmentId);
    }

    private void validateRequest(AssignmentRequest request) {

        if (request == null
                || request.scheduleId() == null
                || request.staffId() == null) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Please select both a schedule and a staff member."
            );
        }
    }

    private Schedule getSchedule(Integer scheduleId) {

        return scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Schedule not found"));
    }

    private StaffOption toDriverOption(Driver driver) {

        return new StaffOption(
                driver.getUserId(),
                driver.getUser().getName(),
                driver.getUser().getEmail(),
                driver.getEmployeeId(),
                driver.getLicenseNo()
        );
    }

    private StaffOption toConductorOption(Conductor conductor) {

        return new StaffOption(
                conductor.getUserId(),
                conductor.getUser().getName(),
                conductor.getUser().getEmail(),
                conductor.getEmployeeId(),
                conductor.getLicenseNo()
        );
    }

    private AssignmentRow toDriverAssignmentRow(
            DriverAssignment assignment) {

        Schedule schedule = assignment.getSchedule();
        Driver driver = assignment.getDriver();

        return new AssignmentRow(
                assignment.getDriverAssignmentId(),
                schedule.getScheduleId(),
                driver.getUserId(),
                driver.getUser().getName(),
                driver.getEmployeeId(),
                schedule.getTravelDate(),
                schedule.getDepartureTime(),
                schedule.getArrivalTime(),
                schedule.getBus().getBusName(),
                schedule.getBus().getRegistrationNumber(),
                schedule.getRoute().getRouteName(),
                assignment.getAssignedAt()
        );
    }

    private AssignmentRow toConductorAssignmentRow(
            ConductorAssignment assignment) {

        Schedule schedule = assignment.getSchedule();
        Conductor conductor = assignment.getConductor();

        return new AssignmentRow(
                assignment.getConductorAssignmentId(),
                schedule.getScheduleId(),
                conductor.getUserId(),
                conductor.getUser().getName(),
                conductor.getEmployeeId(),
                schedule.getTravelDate(),
                schedule.getDepartureTime(),
                schedule.getArrivalTime(),
                schedule.getBus().getBusName(),
                schedule.getBus().getRegistrationNumber(),
                schedule.getRoute().getRouteName(),
                assignment.getAssignedAt()
        );
    }
}
