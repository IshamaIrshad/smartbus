package com.smartbus.backend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "ticket_prices")
public class TicketPrice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "price_id")
    private Integer priceId;

    @ManyToOne
    @JoinColumn(name = "route_id", nullable = false)
    private Route route;

    @ManyToOne
    @JoinColumn(name = "pickup_point_id", nullable = false)
    private PickupDropPoint pickupPoint;

    @ManyToOne
    @JoinColumn(name = "drop_point_id", nullable = false)
    private PickupDropPoint dropPoint;

    @Column(nullable = false)
    private BigDecimal price;

    private String currency;

    @Column(name = "effective_date")
    private LocalDate effectiveDate;

    private String status;

    // Default constructor
    public TicketPrice() {
    }

    // Getters and Setters

    public Integer getPriceId() {
        return priceId;
    }

    public void setPriceId(Integer priceId) {
        this.priceId = priceId;
    }

    public Route getRoute() {
        return route;
    }

    public void setRoute(Route route) {
        this.route = route;
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

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public LocalDate getEffectiveDate() {
        return effectiveDate;
    }

    public void setEffectiveDate(LocalDate effectiveDate) {
        this.effectiveDate = effectiveDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}