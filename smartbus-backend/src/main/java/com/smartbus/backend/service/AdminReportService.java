
package com.smartbus.backend.service;

import com.smartbus.backend.entity.Booking;
import com.smartbus.backend.repository.BookingRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminReportService {

    private final BookingRepository bookingRepository;

    public AdminReportService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    public Map<String, Object> getReports(String period) {
        List<Booking> allBookings = bookingRepository.findAll();

        LocalDate today = LocalDate.now();
        LocalDate startDate;

        if (period == null) {
            period = "thisMonth";
        }

        switch (period) {
            case "thisWeek":
                startDate = today.with(
                        java.time.DayOfWeek.MONDAY
                );
                break;
            case "lastMonth":
                startDate = today.minusMonths(1)
                        .withDayOfMonth(1);
                break;
            case "thisYear":
                startDate = today.withDayOfYear(1);
                break;
            case "thisMonth":
            default:
                startDate = today.withDayOfMonth(1);
                break;
        }

        LocalDate endDate;

        if ("lastMonth".equals(period)) {
            endDate = today.withDayOfMonth(1).minusDays(1);
        } else {
            endDate = today;
        }

        List<Booking> filteredBookings = allBookings.stream()
                .filter(b -> b.getBookingDate() != null)
                .filter(b -> {
                    LocalDate date = b.getBookingDate().toLocalDate();
                    return !date.isBefore(startDate)
                            && !date.isAfter(endDate);
                })
                .toList();

        long total = filteredBookings.size();

        long confirmed = countStatus(filteredBookings, "confirmed");
        long cancelled = countStatus(filteredBookings, "cancelled");
        long pending = countStatus(filteredBookings, "pending");

        BigDecimal revenue = filteredBookings.stream()
                .filter(b -> isRevenueBooking(b.getStatus()))
                .map(Booking::getTotalPrice)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> result = new LinkedHashMap<>();

        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("totalBookings", total);
        summary.put("confirmedBookings", confirmed);
        summary.put("cancelledBookings", cancelled);
        summary.put("pendingBookings", pending);
        summary.put("totalRevenue", revenue);

        result.put("summary", summary);
        result.put("monthlyBookings", getMonthlyBookings(allBookings));
        result.put("popularRoutes", getPopularRoutes(filteredBookings));
        result.put("busPerformance", getBusPerformance(filteredBookings));
        result.put("recentBookings", getRecentBookings(filteredBookings));

        // Booking currently has no payment-method field.
        result.put("paymentMethods", Collections.emptyList());

        return result;
    }

    private long countStatus(List<Booking> bookings, String status) {
        return bookings.stream()
                .filter(b -> b.getStatus() != null)
                .filter(b -> b.getStatus().equalsIgnoreCase(status))
                .count();
    }

    private boolean isRevenueBooking(String status) {
        if (status == null) {
            return false;
        }

        return status.equalsIgnoreCase("confirmed")
                || status.equalsIgnoreCase("completed");
    }

    private List<Map<String, Object>> getMonthlyBookings(
            List<Booking> bookings) {

        List<Map<String, Object>> result = new ArrayList<>();
        YearMonth currentMonth = YearMonth.now();

        for (int i = 5; i >= 0; i--) {
            YearMonth month = currentMonth.minusMonths(i);

            long count = bookings.stream()
                    .filter(b -> b.getBookingDate() != null)
                    .filter(b -> YearMonth.from(
                            b.getBookingDate().toLocalDate()
                    ).equals(month))
                    .count();

            Map<String, Object> item = new LinkedHashMap<>();
            item.put("month", month.getMonth()
                    .getDisplayName(TextStyle.SHORT, Locale.ENGLISH));
            item.put("year", month.getYear());
            item.put("bookings", count);

            result.add(item);
        }

        return result;
    }

    private List<Map<String, Object>> getPopularRoutes(
            List<Booking> bookings) {

        Map<String, Long> counts = bookings.stream()
                .filter(b -> b.getSchedule() != null)
                .filter(b -> b.getSchedule().getRoute() != null)
                .collect(Collectors.groupingBy(
                        b -> b.getSchedule().getRoute().getRouteName(),
                        Collectors.counting()
                ));

        return counts.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(5)
                .map(entry -> {
                    Map<String, Object> item = new LinkedHashMap<>();
                    item.put("route", entry.getKey());
                    item.put("bookings", entry.getValue());
                    return item;
                })
                .toList();
    }

    private List<Map<String, Object>> getBusPerformance(
            List<Booking> bookings) {

        Map<String, List<Booking>> grouped = bookings.stream()
                .filter(b -> b.getSchedule() != null)
                .filter(b -> b.getSchedule().getBus() != null)
                .collect(Collectors.groupingBy(
                        b -> b.getSchedule().getBus().getRegistrationNumber()
                ));

        return grouped.entrySet().stream()
                .map(entry -> {
                    List<Booking> busBookings = entry.getValue();

                    BigDecimal busRevenue = busBookings.stream()
                            .filter(b -> isRevenueBooking(b.getStatus()))
                            .map(Booking::getTotalPrice)
                            .filter(Objects::nonNull)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);

                    Map<String, Object> item = new LinkedHashMap<>();
                    item.put("bus", entry.getKey());
                    item.put("bookings", busBookings.size());
                    item.put("revenue", busRevenue);

                    return item;
                })
                .sorted((a, b) -> Long.compare(
                        ((Number) b.get("bookings")).longValue(),
                        ((Number) a.get("bookings")).longValue()
                ))
                .limit(5)
                .toList();
    }

    private List<Map<String, Object>> getRecentBookings(
            List<Booking> bookings) {

        return bookings.stream()
                .sorted((a, b) -> b.getBookingDate()
                        .compareTo(a.getBookingDate()))
                .limit(10)
                .map(b -> {
                    Map<String, Object> item = new LinkedHashMap<>();

                    item.put("bookingId", b.getBookingId());
                    item.put("bookingDate", b.getBookingDate());
                    item.put("status", b.getStatus());
                    item.put("totalPrice", b.getTotalPrice());

                    item.put("passenger",
                            b.getUser() != null ? b.getUser().getName() : "Unknown");

                    item.put("route",
                            b.getSchedule() != null
                                    && b.getSchedule().getRoute() != null
                                    ? b.getSchedule().getRoute().getRouteName()
                                    : "Unknown");

                    item.put("bus",
                            b.getSchedule() != null
                                    && b.getSchedule().getBus() != null
                                    ? b.getSchedule().getBus().getRegistrationNumber()
                                    : "Unknown");

                    return item;
                })
                .toList();
    }
}