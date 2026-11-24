package com.smartbus.backend.service;

import com.smartbus.backend.entity.CancelBooking;
import com.smartbus.backend.repository.CancelBookingRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CancelBookingService {

    private final CancelBookingRepository cancelBookingRepository;

    public CancelBookingService(CancelBookingRepository cancelBookingRepository) {
        this.cancelBookingRepository = cancelBookingRepository;
    }

    public CancelBooking saveCancelBooking(CancelBooking cancelBooking) {
        return cancelBookingRepository.save(cancelBooking);
    }

    public List<CancelBooking> getAllCancelBookings() {
        return cancelBookingRepository.findAll();
    }

    public Optional<CancelBooking> getCancelBookingById(Integer cancelId) {
        return cancelBookingRepository.findById(cancelId);
    }

    public void deleteCancelBooking(Integer cancelId) {
        cancelBookingRepository.deleteById(cancelId);
    }
}