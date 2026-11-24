package com.smartbus.backend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "booking_id")
    private Integer bookingId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "schedule_id", nullable = false)
    private Schedule schedule;

    @ManyToOne
    @JoinColumn(name = "seat_id", nullable = false)
    private Seat seat;

    @ManyToOne
    @JoinColumn(name = "pickup_point_id", nullable = false)
    private PickupDropPoint pickupPoint;

    @ManyToOne
    @JoinColumn(name = "drop_point_id", nullable = false)
    private PickupDropPoint dropPoint;

    @Column(name = "booking_date")
    private LocalDateTime bookingDate;

    @Column(name = "passenger_gender")
    private String passengerGender;

    @Column(name = "booking_type")
    private String bookingType;

    private String status;

    @Column(name = "total_price")
    private BigDecimal totalPrice;

    // Default constructor
    public Booking() {
    }

    // Getters and Setters

    public Integer getBookingId() {
        return bookingId;
    }

    public void setBookingId(Integer bookingId) {
        this.bookingId = bookingId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Schedule getSchedule() {
        return schedule;
    }

    public void setSchedule(Schedule schedule) {
        this.schedule = schedule;
    }

    public Seat getSeat() {
        return seat;
    }

    public void setSeat(Seat seat) {
        this.seat = seat;
    }

    public PickupDropPoint getPickupPoint() {
        return pickupPoint;
    }

    public void setPickupPoint(PickupDropPoint pickupPoint) {
        this.pickupPoint = pickupPoint;
    }

    public PickupDropPoint getDropPoint() {
        return dropPoint;
    }

    public void setDropPoint(PickupDropPoint dropPoint) {
        this.dropPoint = dropPoint;
    }

    public LocalDateTime getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(LocalDateTime bookingDate) {
        this.bookingDate = bookingDate;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }
}