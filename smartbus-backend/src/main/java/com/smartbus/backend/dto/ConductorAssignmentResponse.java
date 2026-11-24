package com.smartbus.backend.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class ConductorAssignmentResponse {

    private Integer conductorAssignmentId;

    private Integer conductorId;
    private String employeeId;

    private Integer scheduleId;

    private Integer busId;
    private String busName;
    private String registrationNumber;
    private String busType;

    private Integer routeId;
    private String routeName;

    private LocalTime departureTime;
    private LocalTime arrivalTime;
    private LocalDate travelDate;

    private LocalDateTime assignedAt;

    public ConductorAssignmentResponse() {
    }

    public ConductorAssignmentResponse(
            Integer conductorAssignmentId,
            Integer conductorId,
            String employeeId,
            Integer scheduleId,
            Integer busId,
            String busName,
            String registrationNumber,
            String busType,
            Integer routeId,
            String routeName,
            LocalTime departureTime,
            LocalTime arrivalTime,
            LocalDate travelDate,
            LocalDateTime assignedAt) {

        this.conductorAssignmentId = conductorAssignmentId;
        this.conductorId = conductorId;
        this.employeeId = employeeId;
        this.scheduleId = scheduleId;
        this.busId = busId;
        this.busName = busName;
        this.registrationNumber = registrationNumber;
        this.busType = busType;
        this.routeId = routeId;
        this.routeName = routeName;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
        this.travelDate = travelDate;
        this.assignedAt = assignedAt;
    }

    public Integer getConductorAssignmentId() {
        return conductorAssignmentId;
    }

    public void setConductorAssignmentId(Integer conductorAssignmentId) {
        this.conductorAssignmentId = conductorAssignmentId;
    }

    public Integer getConductorId() {
        return conductorId;
    }

    public void setConductorId(Integer conductorId) {
        this.conductorId = conductorId;
    }

    public String getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(String employeeId) {
        this.employeeId = employeeId;
    }

    public Integer getScheduleId() {
        return scheduleId;
    }

    public void setScheduleId(Integer scheduleId) {
        this.scheduleId = scheduleId;
    }

    public Integer getBusId() {
        return busId;
    }

    public void setBusId(Integer busId) {
        this.busId = busId;
    }

    public String getBusName() {
        return busName;
    }

    public void setBusName(String busName) {
        this.busName = busName;
    }

    public String getRegistrationNumber() {
        return registrationNumber;
    }

    public void setRegistrationNumber(String registrationNumber) {
        this.registrationNumber = registrationNumber;
    }

    public String getBusType() {
        return busType;
    }

    public void setBusType(String busType) {
        this.busType = busType;
    }

    public Integer getRouteId() {
        return routeId;
    }

    public void setRouteId(Integer routeId) {
        this.routeId = routeId;
    }

    public String getRouteName() {
        return routeName;
    }

    public void setRouteName(String routeName) {
        this.routeName = routeName;
    }

    public LocalTime getDepartureTime() {
        return departureTime;
    }

    public void setDepartureTime(LocalTime departureTime) {
        this.departureTime = departureTime;
    }

    public LocalTime getArrivalTime() {
        return arrivalTime;
    }

    public void setArrivalTime(LocalTime arrivalTime) {
        this.arrivalTime = arrivalTime;
    }

    public LocalDate getTravelDate() {
        return travelDate;
    }

    public void setTravelDate(LocalDate travelDate) {
        this.travelDate = travelDate;
    }

    public LocalDateTime getAssignedAt() {
        return assignedAt;
    }

    public void setAssignedAt(LocalDateTime assignedAt) {
        this.assignedAt = assignedAt;
    }
}