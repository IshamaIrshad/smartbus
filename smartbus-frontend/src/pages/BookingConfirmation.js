import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/BookingConfirmation.css";

function BookingConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();

  const [booking, setBooking] = useState(null);
  const [payment, setPayment] = useState(null);
  const [ticket, setTicket] = useState(null);

  const [loading, setLoading] = useState(true);
  const [ticketLoading, setTicketLoading] = useState(false);
  const [error, setError] = useState("");

  const queryParams = new URLSearchParams(location.search);
  const bookingId = queryParams.get("bookingId");

  useEffect(() => {
    const loadConfirmationData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const savedBooking = localStorage.getItem("smartBusBooking");
      const savedPayment = localStorage.getItem("smartBusPayment");
      const savedCreatedBooking = localStorage.getItem(
        "smartBusCreatedBooking"
      );

      if (savedPayment) {
        setPayment(JSON.parse(savedPayment));
      }

      let realBookingId = bookingId;

      if (!realBookingId && savedCreatedBooking) {
        try {
          const createdBooking = JSON.parse(savedCreatedBooking);

          if (createdBooking?.bookingId) {
            realBookingId = createdBooking.bookingId;
          }
        } catch (err) {
          console.error(err);
        }
      }

      if (!realBookingId) {
        setError(
          "Booking reference was not found. Please check your bookings."
        );
        setLoading(false);
        return;
      }

      try {
        /*
         * IMPORTANT:
         * Use the passenger booking endpoint.
         *
         * /api/bookings/{id} is ADMIN only.
         * /api/passenger/bookings is available to passengers.
         */
        const bookingResponse = await fetch(
          "http://localhost:8080/api/passenger/bookings",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (
          bookingResponse.status === 401 ||
          bookingResponse.status === 403
        ) {
          localStorage.removeItem("token");
          localStorage.removeItem("smartBusUser");
          navigate("/login");
          return;
        }

        if (!bookingResponse.ok) {
          throw new Error(
            "Unable to load booking information."
          );
        }

        const passengerBookings =
          await bookingResponse.json();

        const realBooking =
          passengerBookings.find(
            (item) =>
              Number(item.bookingId) ===
              Number(realBookingId)
          );

        if (!realBooking) {
          throw new Error(
            "Booking could not be found."
          );
        }

        /*
         * Get the original booking information
         * from localStorage as a fallback for fields
         * that may not be returned by the API.
         */
        let savedBookingData = {};

        if (savedBooking) {
          try {
            savedBookingData =
              JSON.parse(savedBooking);
          } catch (err) {
            console.error(err);
          }
        }

        setBooking({
          ...savedBookingData,

          bookingId: realBooking.bookingId,

          from:
            realBooking.pickupPoint ||
            savedBookingData.from,

          to:
            realBooking.dropPoint ||
            savedBookingData.to,

          busName:
            realBooking.busName ||
            savedBookingData.busName,

          seat:
            realBooking.seatNumber ||
            savedBookingData.seat,

          gender:
            realBooking.passengerGender ||
            savedBookingData.gender,

          date:
            realBooking.travelDate ||
            savedBookingData.date,

          departure:
            realBooking.departureTime ||
            savedBookingData.departure,

          arrival:
            realBooking.arrivalTime ||
            savedBookingData.arrival,

          price:
            realBooking.totalPrice ||
            savedBookingData.price,

          status: realBooking.status,

          registrationNumber:
            realBooking.registrationNumber,

          routeName:
            realBooking.routeName,

          bookingDate:
            realBooking.bookingDate,
        });

        /*
         * Check whether a ticket already exists.
         */
        const ticketResponse = await fetch(
          `http://localhost:8080/api/tickets/booking/${realBookingId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (ticketResponse.ok) {
          const existingTicket =
            await ticketResponse.json();

          if (existingTicket) {
            setTicket(existingTicket);
          }
        }

      } catch (err) {
        console.error(
          "Confirmation error:",
          err
        );

        setError(
          err.message ||
            "Unable to load your booking information."
        );
      } finally {
        setLoading(false);
      }
    };

    loadConfirmationData();
  }, [bookingId, navigate]);

  /*
   * Generate real ticket
   */
  const handleGenerateTicket = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (!booking?.bookingId) {
      setError("Booking ID is missing.");
      return;
    }

    setTicketLoading(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:8080/api/tickets/booking/${booking.bookingId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        localStorage.removeItem("token");
        localStorage.removeItem("smartBusUser");
        navigate("/login");
        return;
      }

      const responseText =
        await response.text();

      if (!response.ok) {
        let errorMessage =
          "Unable to generate ticket.";

        try {
          const errorData =
            JSON.parse(responseText);

          if (errorData.message) {
            errorMessage =
              errorData.message;
          }
        } catch {
          if (responseText) {
            errorMessage =
              responseText;
          }
        }

        throw new Error(errorMessage);
      }

      const generatedTicket =
        JSON.parse(responseText);

      setTicket(generatedTicket);

      localStorage.setItem(
        "smartBusTicket",
        JSON.stringify(generatedTicket)
      );

    } catch (err) {
      console.error(
        "Ticket generation error:",
        err
      );

      setError(
        err.message ||
          "Unable to generate your ticket."
      );
    } finally {
      setTicketLoading(false);
    }
  };

  /*
   * Download real PDF ticket
   */
  const handleDownloadTicket = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (!booking?.bookingId) {
      setError("Booking ID is missing.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/tickets/booking/${booking.bookingId}/pdf`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        localStorage.removeItem("token");
        localStorage.removeItem("smartBusUser");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          "Unable to download ticket PDF."
        );
      }

      const blob =
        await response.blob();

      const url =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        `SmartBus-Ticket-${booking.bookingId}.pdf`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error(
        "PDF download error:",
        err
      );

      setError(
        err.message ||
          "Unable to download ticket."
      );
    }
  };

  const handleHome = () => {
    navigate("/");
  };

  /*
   * Loading
   */
  if (loading) {
    return (
      <div className="confirmation-page">

        <div className="confirmation-empty">

          <div className="empty-ticket-icon">
            🎫
          </div>

          <h2>
            Loading Booking...
          </h2>

          <p>
            Please wait while we load your booking information.
          </p>

        </div>

      </div>
    );
  }

  /*
   * No booking
   */
  if (!booking) {
    return (
      <div className="confirmation-page">

        <div className="confirmation-empty">

          <div className="empty-ticket-icon">
            🎫
          </div>

          <h2>
            No Booking Found
          </h2>

          <p>
            We could not find your booking information.
          </p>

          <button
            type="button"
            onClick={() => navigate("/search")}
          >
            Search for a Bus
          </button>

        </div>

      </div>
    );
  }

  const ticketPrice =
    Number(
      booking.price ||
        payment?.amount ||
        0
    );

  const currency =
    booking.currency || "LKR";

  /*
   * Use real ticket number if available.
   * Otherwise show booking reference.
   */
  const displayBookingNumber =
    ticket?.ticketNumber ||
    `SB${String(
      booking.bookingId
    ).padStart(6, "0")}`;

  return (
    <div className="confirmation-page">

      {/* HEADER */}

      <section className="confirmation-header">

        <div className="container">

          <div className="confirmation-header-content">

            <div className="success-icon">
              ✓
            </div>

            <span>
              BOOKING CONFIRMED
            </span>

            <h1>
              Your Journey is Confirmed!
            </h1>

            <p>
              Your SmartBus reservation has been successfully
              confirmed.
            </p>

          </div>

        </div>

      </section>


      {/* MAIN */}

      <section className="confirmation-section">

        <div className="container">

          {error && (
            <div className="payment-error">
              ⚠️ {error}
            </div>
          )}

          <div className="confirmation-ticket">

            {/* TICKET TOP */}

            <div className="ticket-top">

              <div>

                <span>
                  SMARTBUS
                </span>

                <h2>
                  Bus Reservation Ticket
                </h2>

              </div>

              <div className="booking-reference">

                <span>
                  BOOKING REFERENCE
                </span>

                <strong>
                  {displayBookingNumber}
                </strong>

              </div>

            </div>


            {/* ROUTE */}

            <div className="confirmation-route">

              <div className="route-place">

                <span>
                  FROM
                </span>

                <strong>
                  {booking.from ||
                    "Not available"}
                </strong>

                <small>
                  {booking.from
                    ? booking.from
                        .substring(0, 3)
                        .toUpperCase()
                    : "---"}
                </small>

              </div>


              <div className="route-middle">

                <div className="bus-route-icon">
                  🚌
                </div>

                <div className="route-line">
                  ─────────────────
                </div>

                <small>
                  {booking.busName ||
                    "SmartBus Express"}
                </small>

              </div>


              <div className="route-place route-right">

                <span>
                  TO
                </span>

                <strong>
                  {booking.to ||
                    "Not available"}
                </strong>

                <small>
                  {booking.to
                    ? booking.to
                        .substring(0, 3)
                        .toUpperCase()
                    : "---"}
                </small>

              </div>

            </div>


            {/* JOURNEY DETAILS */}

            <div className="confirmation-details">

              <div className="confirmation-detail">

                <span>
                  📅 Travel Date
                </span>

                <strong>
                  {booking.date ||
                    "Not available"}
                </strong>

              </div>


              <div className="confirmation-detail">

                <span>
                  🕐 Departure
                </span>

                <strong>
                  {booking.departure ||
                    "Not available"}
                </strong>

              </div>


              <div className="confirmation-detail">

                <span>
                  🕐 Arrival
                </span>

                <strong>
                  {booking.arrival ||
                    "Not available"}
                </strong>

              </div>


              <div className="confirmation-detail">

                <span>
                  💺 Seat Number
                </span>

                <strong className="seat-number">
                  {booking.seat ||
                    "Not available"}
                </strong>

              </div>


              <div className="confirmation-detail">

                <span>
                  👤 Passenger
                </span>

                <strong>
                  {booking.gender ||
                    "Not available"}
                </strong>

              </div>


              <div className="confirmation-detail">

                <span>
                  💳 Payment
                </span>

                <strong>
                  {payment?.method === "cash"
                    ? "Pay on Boarding"
                    : "Card Payment"}
                </strong>

              </div>

            </div>


            {/* PRICE */}

            <div className="confirmation-price">

              <div>

                <span>
                  Total Amount
                </span>

                <strong>
                  {currency}{" "}
                  {ticketPrice.toLocaleString()}
                </strong>

              </div>

              <div className="paid-badge">

                {payment?.method === "cash"
                  ? "PAY ON BOARDING"
                  : "PAID"}

              </div>

            </div>


            {/* TICKET INFORMATION */}

            {ticket && (

              <div className="travel-note">

                <div className="note-icon">
                  ✓
                </div>

                <div>

                  <strong>
                    Ticket Generated
                  </strong>

                  <p>
                    Ticket Number:{" "}
                    <strong>
                      {ticket.ticketNumber}
                    </strong>
                  </p>

                  <p>
                    Ticket Status:{" "}
                    <strong>
                      {ticket.status}
                    </strong>
                  </p>

                </div>

              </div>

            )}


            {/* IMPORTANT INFORMATION */}

            <div className="travel-note">

              <div className="note-icon">
                ℹ
              </div>

              <div>

                <strong>
                  Important Information
                </strong>

                <p>
                  Please arrive at the boarding point at least
                  15 minutes before departure. Keep your booking
                  reference available when boarding the bus.
                </p>

              </div>

            </div>


            {/* ACTIONS */}

            <div className="confirmation-actions">

              {!ticket && (

                <button
                  type="button"
                  className="download-ticket-btn"
                  onClick={handleGenerateTicket}
                  disabled={ticketLoading}
                >
                  {ticketLoading
                    ? "Generating Ticket..."
                    : "🎫 Generate Ticket"}
                </button>

              )}


              {ticket && (

                <button
                  type="button"
                  className="download-ticket-btn"
                  onClick={handleDownloadTicket}
                >
                  🖨 Download PDF Ticket
                </button>

              )}


              <button
                type="button"
                className="home-btn"
                onClick={handleHome}
              >
                Back to Home →
              </button>

            </div>

          </div>


          {/* SUCCESS MESSAGE */}

          <div className="confirmation-message">

            <span>
              ✓
            </span>

            <div>

              <strong>
                Thank you for choosing SmartBus!
              </strong>

              <p>
                Have a safe and comfortable journey.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* FOOTER */}

      <footer className="confirmation-footer">

        <p>
          © 2026 SmartBus. All Rights Reserved.
        </p>

      </footer>

    </div>
  );
}

export default BookingConfirmation;