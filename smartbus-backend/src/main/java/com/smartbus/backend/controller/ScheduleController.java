package com.smartbus.backend.controller;

import com.smartbus.backend.entity.Schedule;
import com.smartbus.backend.service.ScheduleService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/schedules")
@CrossOrigin(origins = "http://localhost:3000")
public class ScheduleController {

    private final ScheduleService scheduleService;

    public ScheduleController(ScheduleService scheduleService) {
        this.scheduleService = scheduleService;
    }

    @PostMapping
    public Schedule createSchedule(
            @RequestBody Schedule schedule) {

        return scheduleService.saveSchedule(schedule);
    }

    @GetMapping
    public List<Schedule> getAllSchedules() {

        return scheduleService.getAllSchedules();
    }

    @GetMapping("/{id}")
    public Optional<Schedule> getScheduleById(
            @PathVariable Integer id) {

        return scheduleService.getScheduleById(id);
    }

    @PutMapping("/{id}")
    public Schedule updateSchedule(
            @PathVariable Integer id,
            @RequestBody Schedule scheduleDetails) {

        return scheduleService.updateSchedule(
                id,
                scheduleDetails
        );
    }

    @DeleteMapping("/{id}")
    public void deleteSchedule(
            @PathVariable Integer id) {

        scheduleService.deleteSchedule(id);
    }
}