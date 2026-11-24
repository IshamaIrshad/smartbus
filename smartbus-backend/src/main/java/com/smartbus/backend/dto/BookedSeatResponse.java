package com.smartbus.backend.dto;

public class BookedSeatResponse {

    private Integer seatId;
    private String seatNumber;
    private String passengerGender;
    private String bookingType;

    public BookedSeatResponse() {
    }

    public BookedSeatResponse(
            Integer seatId,
            String seatNumber,
            String passengerGender,
            String bookingType) {

        this.seatId = seatId;
        this.seatNumber = seatNumber;
        this.passengerGender = passengerGender;
        this.bookingType = bookingType;
    }

    public Integer getSeatId() {
        return seatId;
    }

    public void setSeatId(Integer seatId) {
        this.seatId = seatId;
    }

    public String getSeatNumber() {
        return seatNumber;
    }

    public void setSeatNumber(String seatNumber) {
        this.seatNumber = seatNumber;
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