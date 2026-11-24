package com.smartbus.backend.service;

import com.smartbus.backend.entity.Schedule;
import com.smartbus.backend.repository.ScheduleRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;

    public ScheduleService(ScheduleRepository scheduleRepository) {
        this.scheduleRepository = scheduleRepository;
    }

    public Schedule saveSchedule(Schedule schedule) {
        return scheduleRepository.save(schedule);
    }

    public List<Schedule> getAllSchedules() {
        return scheduleRepository.findAll();
    }

    public Optional<Schedule> getScheduleById(Integer scheduleId) {
        return scheduleRepository.findById(scheduleId);
    }

    public Schedule updateSchedule(
            Integer scheduleId,
            Schedule scheduleDetails) {

        Schedule existingSchedule =
                scheduleRepository.findById(scheduleId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Schedule not found with id: "
                                                + scheduleId
                                )
                        );

        existingSchedule.setBus(
                scheduleDetails.getBus()
        );

        existingSchedule.setRoute(
                scheduleDetails.getRoute()
        );

        existingSchedule.setDepartureTime(
                scheduleDetails.getDepartureTime()
        );

        existingSchedule.setArrivalTime(
                scheduleDetails.getArrivalTime()
        );

        existingSchedule.setTravelDate(
                scheduleDetails.getTravelDate()
        );

        existingSchedule.setAvailableSeats(
                scheduleDetails.getAvailableSeats()
        );

        existingSchedule.setStatus(
                scheduleDetails.getStatus()
        );

        return scheduleRepository.save(existingSchedule);
    }

    public void deleteSchedule(Integer scheduleId) {
        scheduleRepository.deleteById(scheduleId);
    }
}