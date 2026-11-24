
package com.smartbus.backend.dto;

public class ConductorTicketResponse {

    private Integer ticketId;
    private Integer bookingId;
    private String ticketNumber;
    private String passengerName;
    private String seatNumber;
    private String destination;
    private String ticketStatus;
    private String bookingStatus;

    public ConductorTicketResponse() {
    }

    public ConductorTicketResponse(
            Integer ticketId,
            Integer bookingId,
            String ticketNumber,
            String passengerName,
            String seatNumber,
            String destination,
            String ticketStatus,
            String bookingStatus) {

        this.ticketId = ticketId;
        this.bookingId = bookingId;
        this.ticketNumber = ticketNumber;
        this.passengerName = passengerName;
        this.seatNumber = seatNumber;
        this.destination = destination;
        this.ticketStatus = ticketStatus;
        this.bookingStatus = bookingStatus;
    }

    public Integer getTicketId() {
        return ticketId;
    }

    public void setTicketId(Integer ticketId) {
        this.ticketId = ticketId;
    }

    public Integer getBookingId() {
        return bookingId;
    }

    public void setBookingId(Integer bookingId) {
        this.bookingId = bookingId;
    }

    public String getTicketNumber() {
        return ticketNumber;
    }

    public void setTicketNumber(String ticketNumber) {
        this.ticketNumber = ticketNumber;
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

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public String getTicketStatus() {
        return ticketStatus;
    }

    public void setTicketStatus(String ticketStatus) {
        this.ticketStatus = ticketStatus;
    }

    public String getBookingStatus() {
        return bookingStatus;
    }

    public void setBookingStatus(String bookingStatus) {
        this.bookingStatus = bookingStatus;
    }
}