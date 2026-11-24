package com.smartbus.backend.dto;

public class ConductorDashboardResponse {

    private String conductorName;
    private String busName;
    private String registrationNumber;
    private String routeName;
    private String departureTime;
    private String arrivalTime;
    private Integer totalPassengers;
    private Integer busCapacity;
    private String driverName;

    public ConductorDashboardResponse() {
    }

    public ConductorDashboardResponse(
            String conductorName,
            String busName,
            String registrationNumber,
            String routeName,
            String departureTime,
            String arrivalTime,
            Integer totalPassengers,
            Integer busCapacity,
            String driverName) {

        this.conductorName = conductorName;
        this.busName = busName;
        this.registrationNumber = registrationNumber;
        this.routeName = routeName;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
        this.totalPassengers = totalPassengers;
        this.busCapacity = busCapacity;
        this.driverName = driverName;
    }

    public String getConductorName() {
        return conductorName;
    }

    public void setConductorName(String conductorName) {
        this.conductorName = conductorName;
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

    public String getRouteName() {
        return routeName;
    }

    public void setRouteName(String routeName) {
        this.routeName = routeName;
    }

    public String getDepartureTime() {
        return departureTime;
    }

    public void setDepartureTime(String departureTime) {
        this.departureTime = departureTime;
    }

    public String getArrivalTime() {
        return arrivalTime;
    }

    public void setArrivalTime(String arrivalTime) {
        this.arrivalTime = arrivalTime;
    }

    public Integer getTotalPassengers() {
        return totalPassengers;
    }

    public void setTotalPassengers(Integer totalPassengers) {
        this.totalPassengers = totalPassengers;
    }

    public Integer getBusCapacity() {
        return busCapacity;
    }

    public void setBusCapacity(Integer busCapacity) {
        this.busCapacity = busCapacity;
    }

    public String getDriverName() {
        return driverName;
    }

    public void setDriverName(String driverName) {
        this.driverName = driverName;
    }
}