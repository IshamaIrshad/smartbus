package com.smartbus.backend.dto;

public class ConductorPassengerResponse {

    private Integer bookingId;
    private String passengerName;
    private String seatNumber;
    private String pickupPoint;
    private String destination;
    private String passengerGender;
    private String status;

    public ConductorPassengerResponse() {
    }

    public ConductorPassengerResponse(
            Integer bookingId,
            String passengerName,
            String seatNumber,
            String pickupPoint,
            String destination,
            String passengerGender,
            String status
    ) {
        this.bookingId = bookingId;
        this.passengerName = passengerName;
        this.seatNumber = seatNumber;
        this.pickupPoint = pickupPoint;
        this.destination = destination;
        this.passengerGender = passengerGender;
        this.status = status;
    }

    public Integer getBookingId() {
        return bookingId;
    }

    public void setBookingId(Integer bookingId) {
        this.bookingId = bookingId;
    }

    public String getPassengerName() {
        return passengerName;
    }

    public void setPassengerName(String passengerName) {
        this.passengerName = passengerName;
    }

    public String getSeatNumber() {
        return seatNumber;
    }

    public void setSeatNumber(String seatNumber) {
        this.seatNumber = seatNumber;
    }

    public String getPickupPoint() {
        return pickupPoint;
    }

    public void setPickupPoint(String pickupPoint) {
        this.pickupPoint = pickupPoint;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public String getPassengerGender() {
        return passengerGender;
    }

    public void setPassengerGender(String passengerGender) {
        this.passengerGender = passengerGender;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}

