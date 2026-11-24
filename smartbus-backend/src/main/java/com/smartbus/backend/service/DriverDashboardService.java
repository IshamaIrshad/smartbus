
package com.smartbus.backend.service;

import com.smartbus.backend.dto.DriverDashboardResponse;
import com.smartbus.backend.entity.Driver;
import com.smartbus.backend.entity.DriverAssignment;
import com.smartbus.backend.entity.Schedule;
import com.smartbus.backend.repository.DriverAssignmentRepository;
import com.smartbus.backend.repository.DriverRepository;
import com.smartbus.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class DriverDashboardService {

    private final DriverAssignmentRepository driverAssignmentRepository;
    private final DriverRepository driverRepository;
    private final UserRepository userRepository;

    public DriverDashboardService(
            DriverAssignmentRepository driverAssignmentRepository,
            DriverRepository driverRepository,
            UserRepository userRepository) {
        this.driverAssignmentRepository = driverAssignmentRepository;
        this.driverRepository = driverRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public DriverDashboardResponse getDashboard(String email) {

        var user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Driver user account not found"));

        Driver driver = driverRepository.findById(user.getUserId())
                .orElseThrow(() ->
                        new RuntimeException("Driver profile not found"));

        List<DriverAssignment> assignments =
                driverAssignmentRepository.findByDriver_UserId(driver.getUserId());

        if (assignments.isEmpty()) {
            throw new RuntimeException(
                    "No trips have been assigned to this driver");
        }

        LocalDate today = LocalDate.now();

        DriverAssignment assignment = assignments.stream()
                .filter(a -> a.getSchedule().getTravelDate() != null
                        && a.getSchedule().getTravelDate().equals(today))
                .findFirst()
                .orElse(assignments.get(0));

        Schedule schedule = assignment.getSchedule();

        String driverName = driver.getUser().getName();
        String employeeId = driver.getEmployeeId();

        String routeName = schedule.getRoute() != null
                ? schedule.getRoute().getRouteName()
                : "Not available";

        String busName = schedule.getBus() != null
                ? schedule.getBus().getBusName()
                : "Not available";

        String registrationNumber = schedule.getBus() != null
                ? schedule.getBus().getRegistrationNumber()
                : "Not available";

        String departureTime = formatTime(schedule.getDepartureTime());
        String arrivalTime = formatTime(schedule.getArrivalTime());

        Integer busCapacity = schedule.getBus() != null
                ? schedule.getBus().getCapacity()
                : null;

        return new DriverDashboardResponse(
                driverName,
                employeeId,
                routeName,
                busName,
                registrationNumber,
                departureTime,
                arrivalTime,
                null,
                busCapacity,
                assignments.size()
        );
    }

    private String formatTime(LocalTime time) {
        if (time == null) {
            return "Not available";
        }

        return time.format(DateTimeFormatter.ofPattern("HH:mm"));
    }
}