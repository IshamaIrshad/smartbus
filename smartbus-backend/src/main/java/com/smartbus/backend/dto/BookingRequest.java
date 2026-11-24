package com.smartbus.backend.dto;

public class BookingRequest {

    private Integer scheduleId;
    private Integer seatId;
    private Integer pickupPointId;
    private Integer dropPointId;
    private String passengerGender;
    private String bookingType;

    public BookingRequest() {
    }

    public Integer getScheduleId() {
        return scheduleId;
    }

    public void setScheduleId(Integer scheduleId) {
        this.scheduleId = scheduleId;
    }

    public Integer getSeatId() {
        return seatId;
    }

    public void setSeatId(Integer seatId) {
        this.seatId = seatId;
    }

    public Integer getPickupPointId() {
        return pickupPointId;
    }

    public void setPickupPointId(Integer pickupPointId) {
        this.pickupPointId = pickupPointId;
    }

    public Integer getDropPointId() {
        return dropPointId;
    }

    public void setDropPointId(Integer dropPointId) {
        this.dropPointId = dropPointId;
    }

    public String getPassengerGender() {
        return passengerGender;
    }

    public void setPassengerGender(String passengerGender) {
        this.passengerGender = passengerGender;
    }

    public String getBookingType() {
        return bookingType;
    }

    public void setBookingType(String bookingType) {
        this.bookingType = bookingType;
    }
}