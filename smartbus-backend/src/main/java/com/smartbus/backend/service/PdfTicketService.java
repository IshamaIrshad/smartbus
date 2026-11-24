package com.smartbus.backend.service;

import com.smartbus.backend.entity.Booking;
import com.smartbus.backend.entity.Ticket;
import com.smartbus.backend.repository.BookingRepository;
import com.smartbus.backend.repository.TicketRepository;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.Base64;

@Service
public class PdfTicketService {

    private final TicketRepository ticketRepository;
    private final BookingRepository bookingRepository;
    private final QrCodeService qrCodeService;

    public PdfTicketService(
            TicketRepository ticketRepository,
            BookingRepository bookingRepository,
            QrCodeService qrCodeService) {

        this.ticketRepository = ticketRepository;
        this.bookingRepository = bookingRepository;
        this.qrCodeService = qrCodeService;
    }

    public byte[] generateTicketPdf(
            Integer bookingId,
            String email) {

        Booking booking = bookingRepository
                .findById(bookingId)
                .orElseThrow(() ->
                        new RuntimeException("Booking not found"));

        if (!booking.getUser()
                .getEmail()
                .equalsIgnoreCase(email)) {

            throw new RuntimeException(
                    "You can only download your own ticket");
        }

        Ticket ticket = ticketRepository
                .findByBooking_BookingId(bookingId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Ticket not found. Please generate the ticket first."));

        try (PDDocument document = new PDDocument()) {

            PDPage page = new PDPage(PDRectangle.A4);
            document.addPage(page);

            PDPageContentStream content =
                    new PDPageContentStream(document, page);

            float margin = 50;
            float y = 760;

            // Title
            content.beginText();
            content.setFont(
                    new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD),
                    24
            );
            content.newLineAtOffset(margin, y);
            content.showText("SMARTBUS");
            content.endText();

            y -= 35;

            content.beginText();
            content.setFont(
                    new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD),
                    16
            );
            content.newLineAtOffset(margin, y);
            content.showText("BUS TICKET");
            content.endText();

            // Ticket number
            y -= 45;

            content.beginText();
            content.setFont(
                    new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD),
                    12
            );
            content.newLineAtOffset(margin, y);
            content.showText(
                    "Ticket Number: " + ticket.getTicketNumber()
            );
            content.endText();

            // Passenger
            y -= 35;
            y = writeLine(
                    content,
                    "Passenger: " + booking.getUser().getName(),
                    margin,
                    y
            );

            y = writeLine(
                    content,
                    "Email: " + booking.getUser().getEmail(),
                    margin,
                    y
            );

            // Bus details
            y -= 15;

            content.beginText();
            content.setFont(
                    new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD),
                    13
            );
            content.newLineAtOffset(margin, y);
            content.showText("Journey Details");
            content.endText();

            y -= 25;

            y = writeLine(
                    content,
                    "Bus: " +
                            booking.getSchedule()
                                    .getBus()
                                    .getBusName(),
                    margin,
                    y
            );

            y = writeLine(
                    content,
                    "Registration: " +
                            booking.getSchedule()
                                    .getBus()
                                    .getRegistrationNumber(),
                    margin,
                    y
            );

            y = writeLine(
                    content,
                    "Route: " +
                            booking.getSchedule()
                                    .getRoute()
                                    .getRouteName(),
                    margin,
                    y
            );

            y = writeLine(
                    content,
                    "Seat: " +
                            booking.getSeat()
                                    .getSeatNumber(),
                    margin,
                    y
            );

            y = writeLine(
                    content,
                    "Pickup: " +
                            booking.getPickupPoint()
                                    .getPointName(),
                    margin,
                    y
            );

            y = writeLine(
                    content,
                    "Drop: " +
                            booking.getDropPoint()
                                    .getPointName(),
                    margin,
                    y
            );

            y = writeLine(
                    content,
                    "Travel Date: " +
                            booking.getSchedule()
                                    .getTravelDate(),
                    margin,
                    y
            );

            y = writeLine(
                    content,
                    "Departure: " +
                            booking.getSchedule()
                                    .getDepartureTime(),
                    margin,
                    y
            );

            y = writeLine(
                    content,
                    "Arrival: " +
                            booking.getSchedule()
                                    .getArrivalTime(),
                    margin,
                    y
            );

            y = writeLine(
                    content,
                    "Passenger Gender: " +
                            booking.getPassengerGender(),
                    margin,
                    y
            );

            y = writeLine(
                    content,
                    "Booking Type: " +
                            booking.getBookingType(),
                    margin,
                    y
            );

            // Price
            y -= 15;

            content.beginText();
            content.setFont(
                    new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD),
                    14
            );
            content.newLineAtOffset(margin, y);
            content.showText(
                    "Total Price: LKR " +
                            booking.getTotalPrice()
            );
            content.endText();

            // QR Code
            String qrBase64 =
                    qrCodeService.generateQrCodeBase64(
                            ticket.getQrCode()
                    );

            byte[] qrBytes =
                    Base64.getDecoder().decode(qrBase64);

            PDImageXObject qrImage =
                    PDImageXObject.createFromByteArray(
                            document,
                            qrBytes,
                            "smartbus-qr"
                    );

            content.drawImage(
                    qrImage,
                    390,
                    500,
                    150,
                    150
            );

            // Footer
            content.beginText();
            content.setFont(
                    new PDType1Font(Standard14Fonts.FontName.HELVETICA),
                    10
            );
            content.newLineAtOffset(
                    margin,
                    80
            );
            content.showText(
                    "Please present this ticket and QR code when boarding."
            );
            content.endText();

            content.close();

            ByteArrayOutputStream outputStream =
                    new ByteArrayOutputStream();

            document.save(outputStream);

            return outputStream.toByteArray();

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to generate PDF ticket",
                    e
            );
        }
    }

    private float writeLine(
            PDPageContentStream content,
            String text,
            float x,
            float y) throws Exception {

        content.beginText();

        content.setFont(
                new PDType1Font(
                        Standard14Fonts.FontName.HELVETICA
                ),
                11
        );

        content.newLineAtOffset(x, y);

        content.showText(text);

        content.endText();

        return y - 20;
    }
}