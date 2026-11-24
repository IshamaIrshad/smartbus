package com.smartbus.backend.service;

import com.smartbus.backend.dto.ConductorDashboardResponse;
import com.smartbus.backend.entity.Conductor;
import com.smartbus.backend.entity.ConductorAssignment;
import com.smartbus.backend.entity.DriverAssignment;
import com.smartbus.backend.entity.User;
import com.smartbus.backend.repository.ConductorAssignmentRepository;
import com.smartbus.backend.repository.DriverAssignmentRepository;
import com.smartbus.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ConductorDashboardService {

    private final UserRepository userRepository;
    private final ConductorAssignmentRepository conductorAssignmentRepository;
    private final DriverAssignmentRepository driverAssignmentRepository;

    public ConductorDashboardService(
            UserRepository userRepository,
            ConductorAssignmentRepository conductorAssignmentRepository,
            DriverAssignmentRepository driverAssignmentRepository) {

        this.userRepository = userRepository;
        this.conductorAssignmentRepository = conductorAssignmentRepository;
        this.driverAssignmentRepository = driverAssignmentRepository;
    }

    public ConductorDashboardResponse getDashboard(String email) {

        // Find logged-in user
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        // Find conductor assignments
        List<ConductorAssignment> assignments =
                conductorAssignmentRepository
                        .findByConductor_UserId(user.getUserId());

        if (assignments.isEmpty()) {
            throw new RuntimeException(
                    "No schedule assigned to this conductor");
        }

        // Use the first assigned schedule
        ConductorAssignment assignment = assignments.get(0);

        var schedule = assignment.getSchedule();
        Conductor conductor = assignment.getConductor();

        // Get conductor name
        String conductorName = conductor.getUser().getName();

        // Get bus information
        String busName = schedule.getBus().getBusName();
        String registrationNumber =
                schedule.getBus().getRegistrationNumber();

        // Get route
        String routeName = schedule.getRoute().getRouteName();

        // Get departure and arrival times
        String departureTime =
                schedule.getDepartureTime() != null
                        ? schedule.getDepartureTime().toString()
                        : "";

        String arrivalTime =
                schedule.getArrivalTime() != null
                        ? schedule.getArrivalTime().toString()
                        : "";

        // Get bus capacity
        Integer busCapacity = schedule.getBus().getCapacity();

        /*
         * Get driver assigned to the same schedule.
         */
        String driverName = "Not Assigned";

        var driverAssignment =
                driverAssignmentRepository
                        .findFirstBySchedule_ScheduleId(
                                schedule.getScheduleId());

        if (driverAssignment.isPresent()) {

            DriverAssignment assignmentDriver =
                    driverAssignment.get();

            if (assignmentDriver.getDriver() != null &&
                    assignmentDriver.getDriver().getUser() != null) {

                driverName =
                        assignmentDriver.getDriver()
                                .getUser()
                                .getName();
            }
        }

        /*
         * Passenger count will be connected in the next step.
         * For now we use the schedule's available seats
         * to calculate the number of booked passengers.
         */
        Integer totalPassengers = 0;

        if (schedule.getAvailableSeats() != null &&
                busCapacity != null) {

            totalPassengers =
                    busCapacity - schedule.getAvailableSeats();
        }

        return new ConductorDashboardResponse(
                conductorName,
                busName,
                registrationNumber,
                routeName,
                departureTime,
                arrivalTime,
                totalPassengers,
                busCapacity,
                driverName
        );
    }
}