package com.smartbus.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class TicketResponse {

    private Integer ticketId;
    private Integer bookingId;
    private String passengerName;
    private String passengerEmail;

    private String busName;
    private String registrationNumber;
    private String routeName;

    private String seatNumber;

    private String pickupPoint;
    private String dropPoint;

    private LocalDate travelDate;
    private LocalTime departureTime;
    private LocalTime arrivalTime;

    private BigDecimal totalPrice;

    private String ticketNumber;
    private String qrCode;
    private String qrCodeImage;
    private String status;

    private LocalDateTime issuedAt;

    public TicketResponse() {
    }

    public TicketResponse(
            Integer ticketId,
            Integer bookingId,
            String passengerName,
            String passengerEmail,
            String busName,
            String registrationNumber,
            String routeName,
            String seatNumber,
            String pickupPoint,
            String dropPoint,
            LocalDate travelDate,
            LocalTime departureTime,
            LocalTime arrivalTime,
            BigDecimal totalPrice,
            String ticketNumber,
            String qrCode,
            String qrCodeImage,
            String status,
            LocalDateTime issuedAt) {

        this.ticketId = ticketId;
        this.bookingId = bookingId;
        this.passengerName = passengerName;
        this.passengerEmail = passengerEmail;
        this.busName = busName;
        this.registrationNumber = registrationNumber;
        this.routeName = routeName;
        this.seatNumber = seatNumber;
        this.pickupPoint = pickupPoint;
        this.dropPoint = dropPoint;
        this.travelDate = travelDate;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
        this.totalPrice = totalPrice;
        this.ticketNumber = ticketNumber;
        this.qrCode = qrCode;
        this.qrCodeImage = qrCodeImage;
        this.status = status;
        this.issuedAt = issuedAt;
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

    public String getPassengerName() {
        return passengerName;
    }

    public void setPassengerName(String passengerName) {
        this.passengerName = passengerName;
    }

    public String getPassengerEmail() {
        return passengerEmail;
    }

    public void setPassengerEmail(String passengerEmail) {
        this.passengerEmail = passengerEmail;
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

    public String getDropPoint() {
        return dropPoint;
    }

    public void setDropPoint(String dropPoint) {
        this.dropPoint = dropPoint;
    }

    public LocalDate getTravelDate() {
        return travelDate;
    }

    public void setTravelDate(LocalDate travelDate) {
        this.travelDate = travelDate;
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

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }

    public String getTicketNumber() {
        return ticketNumber;
    }

    public void setTicketNumber(String ticketNumber) {
        this.ticketNumber = ticketNumber;
    }

    public String getQrCode() {
        return qrCode;
    }

    public void setQrCode(String qrCode) {
        this.qrCode = qrCode;
    }

    public String getQrCodeImage() {
        return qrCodeImage;
    }

    public void setQrCodeImage(String qrCodeImage) {
        this.qrCodeImage = qrCodeImage;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getIssuedAt() {
        return issuedAt;
    }

    public void setIssuedAt(LocalDateTime issuedAt) {
        this.issuedAt = issuedAt;
    }
}