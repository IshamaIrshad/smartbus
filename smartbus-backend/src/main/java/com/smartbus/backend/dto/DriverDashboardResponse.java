
package com.smartbus.backend.dto;

public class DriverDashboardResponse {

    private String driverName;
    private String employeeId;
    private String routeName;
    private String busName;
    private String registrationNumber;
    private String departureTime;
    private String arrivalTime;
    private Integer totalPassengers;
    private Integer busCapacity;
    private Integer totalTrips;

    public DriverDashboardResponse() {
    }

    public DriverDashboardResponse(
            String driverName,
            String employeeId,
            String routeName,
            String busName,
            String registrationNumber,
            String departureTime,
            String arrivalTime,
            Integer totalPassengers,
            Integer busCapacity,
            Integer totalTrips) {

        this.driverName = driverName;
        this.employeeId = employeeId;
        this.routeName = routeName;
        this.busName = busName;
        this.registrationNumber = registrationNumber;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
        this.totalPassengers = totalPassengers;
        this.busCapacity = busCapacity;
        this.totalTrips = totalTrips;
    }

    public String getDriverName() {
        return driverName;
    }

    public void setDriverName(String driverName) {
        this.driverName = driverName;
    }

    public String getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(String employeeId) {
        this.employeeId = employeeId;
    }

    public String getRouteName() {
        return routeName;
    }

    public void setRouteName(String routeName) {
        this.routeName = routeName;
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

    public Integer getTotalTrips() {
        return totalTrips;
    }

    public void setTotalTrips(Integer totalTrips) {
        this.totalTrips = totalTrips;
    }
}