package com.smartbus.backend.repository;

import com.smartbus.backend.entity.CancelBooking;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CancelBookingRepository extends JpaRepository<CancelBooking, Integer> {
}