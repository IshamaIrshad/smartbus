package com.smartbus.backend.service;

import com.smartbus.backend.dto.BookedSeatResponse;
import com.smartbus.backend.dto.BookingRequest;
import com.smartbus.backend.dto.BookingResponse;
import com.smartbus.backend.dto.CancelBookingRequest;
import com.smartbus.backend.entity.Booking;
import com.smartbus.backend.entity.CancelBooking;
import com.smartbus.backend.entity.PickupDropPoint;
import com.smartbus.backend.entity.Schedule;
import com.smartbus.backend.entity.Seat;
import com.smartbus.backend.entity.TicketPrice;
import com.smartbus.backend.entity.User;
import com.smartbus.backend.repository.BookingRepository;
import com.smartbus.backend.repository.CancelBookingRepository;
import com.smartbus.backend.repository.PickupDropPointRepository;
import com.smartbus.backend.repository.ScheduleRepository;
import com.smartbus.backend.repository.SeatRepository;
import com.smartbus.backend.repository.TicketPriceRepository;
import com.smartbus.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final ScheduleRepository scheduleRepository;
    private final SeatRepository seatRepository;
    private final PickupDropPointRepository pickupDropPointRepository;
    private final TicketPriceRepository ticketPriceRepository;
    private final CancelBookingRepository cancelBookingRepository;

    public BookingService(
            BookingRepository bookingRepository,
            UserRepository userRepository,
            ScheduleRepository scheduleRepository,
            SeatRepository seatRepository,
            PickupDropPointRepository pickupDropPointRepository,
            TicketPriceRepository ticketPriceRepository,
            CancelBookingRepository cancelBookingRepository) {

        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.scheduleRepository = scheduleRepository;
        this.seatRepository = seatRepository;
        this.pickupDropPointRepository = pickupDropPointRepository;
        this.ticketPriceRepository = ticketPriceRepository;
        this.cancelBookingRepository = cancelBookingRepository;
    }

    // ============================================================
    // CREATE BOOKING
    // ============================================================

    @Transactional
    public BookingResponse createBooking(
            BookingRequest request,
            String email) {

        // Find logged-in user
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found with email: " + email
                        )
                );

        // Find schedule
        Schedule schedule = scheduleRepository
                .findById(request.getScheduleId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Schedule not found with id: "
                                        + request.getScheduleId()
                        )
                );

        // Check schedule status
        if (!"ACTIVE".equalsIgnoreCase(schedule.getStatus())) {
            throw new RuntimeException(
                    "This schedule is not available for booking."
            );
        }

        // Check available seats
        if (schedule.getAvailableSeats() == null
                || schedule.getAvailableSeats() <= 0) {

            throw new RuntimeException(
                    "No available seats for this schedule."
            );
        }

        // Find selected seat
        Seat seat = seatRepository
                .findById(request.getSeatId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Seat not found with id: "
                                        + request.getSeatId()
                        )
                );

        // Check seat belongs to schedule bus
        if (seat.getBus() == null
                || schedule.getBus() == null
                || !seat.getBus().getBusId()
                .equals(schedule.getBus().getBusId())) {

            throw new RuntimeException(
                    "Selected seat does not belong to this bus."
            );
        }

        // Check seat status
        if (!"AVAILABLE".equalsIgnoreCase(seat.getStatus())) {
            throw new RuntimeException(
                    "Selected seat is not available."
            );
        }

        // Check double booking
        if (isSeatBooked(
                request.getScheduleId(),
                request.getSeatId())) {

            throw new RuntimeException(
                    "This seat has already been booked."
            );
        }

        // Find pickup point
        PickupDropPoint pickupPoint =
                pickupDropPointRepository
                        .findById(request.getPickupPointId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Pickup point not found with id: "
                                                + request.getPickupPointId()
                                )
                        );

        // Find drop point
        PickupDropPoint dropPoint =
                pickupDropPointRepository
                        .findById(request.getDropPointId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Drop point not found with id: "
                                                + request.getDropPointId()
                                )
                        );

        // Check pickup point belongs to route
        if (pickupPoint.getRoute() == null
                || schedule.getRoute() == null
                || !pickupPoint.getRoute().getRouteId()
                .equals(schedule.getRoute().getRouteId())) {

            throw new RuntimeException(
                    "Pickup point does not belong to this route."
            );
        }

        // Check drop point belongs to route
        if (dropPoint.getRoute() == null
                || schedule.getRoute() == null
                || !dropPoint.getRoute().getRouteId()
                .equals(schedule.getRoute().getRouteId())) {

            throw new RuntimeException(
                    "Drop point does not belong to this route."
            );
        }

        // Find active ticket price
        List<TicketPrice> prices =
                ticketPriceRepository.findAll();

        TicketPrice ticketPrice = prices.stream()
                .filter(price ->
                        price.getRoute() != null
                                && schedule.getRoute() != null
                                && price.getRoute().getRouteId()
                                .equals(schedule.getRoute().getRouteId())
                )
                .filter(price ->
                        price.getPickupPoint() != null
                                && price.getPickupPoint().getPointId()
                                .equals(request.getPickupPointId())
                )
                .filter(price ->
                        price.getDropPoint() != null
                                && price.getDropPoint().getPointId()
                                .equals(request.getDropPointId())
                )
                .filter(price ->
                        "ACTIVE".equalsIgnoreCase(price.getStatus())
                )
                .filter(price ->
                        price.getEffectiveDate() == null
                                || !price.getEffectiveDate()
                                .isAfter(schedule.getTravelDate())
                )
                .findFirst()
                .orElseThrow(() ->
                        new RuntimeException(
                                "No active ticket price found for this journey."
                        )
                );

        // Create booking
        Booking booking = new Booking();

        booking.setUser(user);
        booking.setSchedule(schedule);
        booking.setSeat(seat);
        booking.setPickupPoint(pickupPoint);
        booking.setDropPoint(dropPoint);

        booking.setBookingDate(LocalDateTime.now());

        booking.setPassengerGender(
                request.getPassengerGender()
        );

        booking.setBookingType(
                request.getBookingType()
        );

        booking.setStatus("BOOKED");

        booking.setTotalPrice(
                ticketPrice.getPrice()
        );

        // Reduce available seats
        schedule.setAvailableSeats(
                schedule.getAvailableSeats() - 1
        );

        scheduleRepository.save(schedule);

        // Save booking
        Booking savedBooking =
                bookingRepository.save(booking);

        return convertToResponse(savedBooking);
    }

    // ============================================================
    // GET ALL BOOKINGS
    // ============================================================

    public List<BookingResponse> getAllBookings() {

        return bookingRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // ============================================================
    // GET BOOKING BY ID
    // ============================================================

    public Optional<BookingResponse> getBookingById(
            Integer id) {

        return bookingRepository.findById(id)
                .map(this::convertToResponse);
    }

    // ============================================================
    // GET MY BOOKINGS
    // ============================================================

    public List<BookingResponse> getMyBookings(
            String email) {

        return bookingRepository
                .findByUser_Email(email)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // ============================================================
    // GET BOOKED SEATS FOR A SCHEDULE
    // ============================================================

    public List<BookedSeatResponse> getBookedSeatIds(
            Integer scheduleId) {

        List<Booking> bookings =
                bookingRepository
                        .findBySchedule_ScheduleIdAndStatus(
                                scheduleId,
                                "BOOKED"
                        );

        return bookings.stream()
                .map(booking ->
                        new BookedSeatResponse(
                                booking.getSeat().getSeatId(),
                                booking.getSeat().getSeatNumber(),
                                booking.getPassengerGender(),
                                booking.getBookingType()
                        )
                )
                .collect(Collectors.toList());
    }

    // ============================================================
    // CANCEL MY BOOKING
    // ============================================================

    @Transactional
    public BookingResponse cancelMyBooking(
            Integer bookingId,
            CancelBookingRequest request,
            String email) {

        // Find booking
        Booking booking = bookingRepository
                .findById(bookingId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Booking not found with id: "
                                        + bookingId
                        )
                );

        // Check ownership
        if (booking.getUser() == null
                || !booking.getUser().getEmail()
                .equalsIgnoreCase(email)) {

            throw new RuntimeException(
                    "You are not allowed to cancel this booking."
            );
        }

        // Check status
        if (!"BOOKED".equalsIgnoreCase(
                booking.getStatus())) {

            throw new RuntimeException(
                    "Only booked tickets can be cancelled."
            );
        }

        // Refund amount
        BigDecimal refundAmount =
                booking.getTotalPrice();

        // Update booking status
        booking.setStatus("CANCELLED");

        // Create cancellation record
        CancelBooking cancelBooking =
                new CancelBooking();

        cancelBooking.setBooking(booking);
        cancelBooking.setCancelDate(
                LocalDateTime.now()
        );

        if (request != null
                && request.getReason() != null
                && !request.getReason().isBlank()) {

            cancelBooking.setReason(
                    request.getReason()
            );

        } else {

            cancelBooking.setReason(
                    "Cancelled by passenger"
            );
        }

        cancelBooking.setRefundAmount(
                refundAmount
        );

        cancelBookingRepository.save(cancelBooking);

        // Restore available seat
        Schedule schedule =
                booking.getSchedule();

        if (schedule != null) {

            Integer currentAvailable =
                    schedule.getAvailableSeats();

            if (currentAvailable == null) {
                currentAvailable = 0;
            }

            schedule.setAvailableSeats(
                    currentAvailable + 1
            );

            scheduleRepository.save(schedule);
        }

        // Save updated booking
        Booking updatedBooking =
                bookingRepository.save(booking);

        return convertToResponse(updatedBooking);
    }

    // ============================================================
    // DELETE BOOKING
    // ============================================================

    @Transactional
    public void deleteBooking(Integer id) {

        Booking booking =
                bookingRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Booking not found with id: "
                                                + id
                                )
                        );

        bookingRepository.delete(booking);
    }

    // ============================================================
    // CHECK WHETHER A SEAT IS BOOKED
    // ============================================================

    public boolean isSeatBooked(
            Integer scheduleId,
            Integer seatId) {

        Optional<Booking> booking =
                bookingRepository
                        .findBySchedule_ScheduleIdAndSeat_SeatIdAndStatus(
                                scheduleId,
                                seatId,
                                "BOOKED"
                        );

        return booking.isPresent();
    }

    // ============================================================
    // CONVERT BOOKING TO RESPONSE
    // ============================================================

    private BookingResponse convertToResponse(
            Booking booking) {

        String passengerName = null;

        if (booking.getUser() != null) {
            passengerName =
                    booking.getUser().getName();
        }

        Integer scheduleId = null;
        String busName = null;
        String registrationNumber = null;
        String routeName = null;
        LocalDate travelDate = null;
        LocalTime departureTime = null;
        LocalTime arrivalTime = null;

        if (booking.getSchedule() != null) {

            scheduleId =
                    booking.getSchedule().getScheduleId();

            travelDate =
                    booking.getSchedule().getTravelDate();

            departureTime =
                    booking.getSchedule().getDepartureTime();

            arrivalTime =
                    booking.getSchedule().getArrivalTime();

            if (booking.getSchedule().getBus() != null) {

                busName =
                        booking.getSchedule()
                                .getBus()
                                .getBusName();

                registrationNumber =
                        booking.getSchedule()
                                .getBus()
                                .getRegistrationNumber();
            }

            if (booking.getSchedule().getRoute() != null) {

                routeName =
                        booking.getSchedule()
                                .getRoute()
                                .getRouteName();
            }
        }

        Integer seatId = null;
        String seatNumber = null;

        if (booking.getSeat() != null) {

            seatId =
                    booking.getSeat().getSeatId();

            seatNumber =
                    booking.getSeat().getSeatNumber();
        }

        String pickupPoint = null;
        String dropPoint = null;

        if (booking.getPickupPoint() != null) {

            pickupPoint =
                    booking.getPickupPoint().getPointName();
        }

        if (booking.getDropPoint() != null) {

            dropPoint =
                    booking.getDropPoint().getPointName();
        }

        return new BookingResponse(
                booking.getBookingId(),
                passengerName,
                scheduleId,
                busName,
                registrationNumber,
                routeName,
                seatId,
                seatNumber,
                pickupPoint,
                dropPoint,
                travelDate,
                departureTime,
                arrivalTime,
                booking.getPassengerGender(),
                booking.getBookingType(),
                booking.getBookingDate(),
                booking.getTotalPrice(),
                booking.getStatus()
        );
    }
}