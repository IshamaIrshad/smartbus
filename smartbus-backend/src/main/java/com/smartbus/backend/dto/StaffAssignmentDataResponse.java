
package com.smartbus.backend.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

public record StaffAssignmentDataResponse(
        List<ScheduleOption> schedules,
        List<StaffOption> drivers,
        List<StaffOption> conductors,
        List<AssignmentRow> driverAssignments,
        List<AssignmentRow> conductorAssignments
) {
    public record ScheduleOption(
            Integer scheduleId,
            LocalDate travelDate,
            LocalTime departureTime,
            LocalTime arrivalTime,
            Integer busId,
            String busName,
            String registrationNumber,
            Integer routeId,
            String routeName
    ) {}

    public record StaffOption(
            Integer userId,
            String name,
            String email,
            String employeeId,
            String licenseNo
    ) {}

    public record AssignmentRequest(
            Integer scheduleId,
            Integer staffId
    ) {}

    public record AssignmentRow(
            Integer assignmentId,
            Integer scheduleId,
            Integer staffId,
            String staffName,
            String employeeId,
            LocalDate travelDate,
            LocalTime departureTime,
            LocalTime arrivalTime,
            String busName,
            String registrationNumber,
            String routeName,
            LocalDateTime assignedAt
    ) {}
}

