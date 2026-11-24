package com.smartbus.backend.service;

import com.smartbus.backend.dto.BusLocationRequest;
import com.smartbus.backend.entity.BusLocation;
import com.smartbus.backend.entity.Driver;
import com.smartbus.backend.entity.DriverAssignment;
import com.smartbus.backend.entity.Schedule;
import com.smartbus.backend.entity.User;
import com.smartbus.backend.repository.BusLocationRepository;
import com.smartbus.backend.repository.DriverAssignmentRepository;
import com.smartbus.backend.repository.DriverRepository;
import com.smartbus.backend.repository.ScheduleRepository;
import com.smartbus.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class BusLocationService {

    private final BusLocationRepository busLocationRepository;
    private final UserRepository userRepository;
    private final DriverRepository driverRepository;
    private final DriverAssignmentRepository driverAssignmentRepository;
    private final ScheduleRepository scheduleRepository;

    public BusLocationService(
            BusLocationRepository busLocationRepository,
            UserRepository userRepository,
            DriverRepository driverRepository,
            DriverAssignmentRepository driverAssignmentRepository,
            ScheduleRepository scheduleRepository) {

        this.busLocationRepository = busLocationRepository;
        this.userRepository = userRepository;
        this.driverRepository = driverRepository;
        this.driverAssignmentRepository = driverAssignmentRepository;
        this.scheduleRepository = scheduleRepository;
    }

    // Driver updates bus location
    public BusLocation updateDriverLocation(
            String email,
            BusLocationRequest request) {

        // Find logged-in user
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found with email: " + email
                        )
                );

        // Find driver profile
        Driver driver = driverRepository.findById(user.getUserId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Driver profile not found"
                        )
                );

        // Check whether this driver is assigned to the schedule
        DriverAssignment assignment =
                driverAssignmentRepository
                        .findByDriver_UserId(driver.getUserId())
                        .stream()
                        .filter(a ->
                                a.getSchedule()
                                        .getScheduleId()
                                        .equals(request.getScheduleId())
                        )
                        .findFirst()
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "This driver is not assigned to the selected schedule"
                                )
                        );

        // Get schedule
        Schedule schedule = scheduleRepository
                .findById(request.getScheduleId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Schedule not found with id: "
                                        + request.getScheduleId()
                        )
                );

        // Create location record
        BusLocation busLocation = new BusLocation();

        busLocation.setSchedule(schedule);
        busLocation.setLatitude(request.getLatitude());
        busLocation.setLongitude(request.getLongitude());
        busLocation.setSpeed(request.getSpeed());
        busLocation.setCurrentLocation(request.getCurrentLocation());

        // Set current date and time automatically
        busLocation.setRecordedAt(LocalDateTime.now());

        return busLocationRepository.save(busLocation);
    }

    // Save bus location
    public BusLocation saveBusLocation(BusLocation busLocation) {

        busLocation.setRecordedAt(LocalDateTime.now());

        return busLocationRepository.save(busLocation);
    }

    // Get all bus locations
    public List<BusLocation> getAllBusLocations() {
        return busLocationRepository.findAll();
    }

    // Get bus location by ID
    public Optional<BusLocation> getBusLocationById(Integer locationId) {
        return busLocationRepository.findById(locationId);
    }

    // Get latest location for a schedule
    public Optional<BusLocation> getLatestLocation(Integer scheduleId) {

        return busLocationRepository
                .findFirstBySchedule_ScheduleIdOrderByRecordedAtDesc(
                        scheduleId
                );
    }

    // Delete bus location
    public void deleteBusLocation(Integer locationId) {
        busLocationRepository.deleteById(locationId);
    }
}