import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/BookingSummary.css";

function BookingSummary() {
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const savedBooking = localStorage.getItem("smartBusBooking");

    if (savedBooking) {
      setBooking(JSON.parse(savedBooking));
    }
  }, []);

  const handleContinue = () => {
    navigate("/payment");
  };

  const handleBack = () => {
    navigate("/seat-selection");
  };

  // If no booking information is available
  if (!booking) {
    return (
      <div className="summary-page">
        <section className="summary-empty">
          <div className="empty-icon">🚌</div>

          <h2>No Booking Found</h2>

          <p>
            Please select a bus and seat before viewing your booking summary.
          </p>

          <button
            className="summary-primary-btn"
            onClick={() => navigate("/search")}
          >
            Search for a Bus
          </button>
        </section>
      </div>
    );
  }

  // Use the real ticket price from Search Bus
  const ticketPrice = Number(booking.price) || 0;

  const currency = booking.currency || "LKR";

  return (
    <div className="summary-page">

      {/* =====================================
          HEADER
      ===================================== */}
      <section className="summary-header">

        <div className="container">

          <div className="summary-header-content">

            <span>SMARTBUS BOOKING</span>

            <h1>Booking Summary</h1>

            <p>
              Review your journey details before continuing to payment.
            </p>

          </div>

        </div>

      </section>


      {/* =====================================
          MAIN SECTION
      ===================================== */}
      <section className="summary-section">

        <div className="container">

          <div className="row g-4">

            {/* =================================
                LEFT SIDE
            ================================= */}
            <div className="col-lg-8">

              <div className="summary-card">

                {/* STEP */}

                <div className="summary-step">

                  <span>
                    STEP 3 OF 3
                  </span>

                  <h2>
                    Review Your Booking
                  </h2>

                  <p>
                    Please check your information before continuing.
                  </p>

                </div>


                {/* JOURNEY */}

                <div className="journey-box">

                  <div className="journey-location">

                    <span>
                      FROM
                    </span>

                    <strong>
                      {booking.from || "Not selected"}
                    </strong>

                  </div>


                  <div className="journey-arrow">
                    →
                  </div>


                  <div className="journey-location">

                    <span>
                      TO
                    </span>

                    <strong>
                      {booking.to || "Not selected"}
                    </strong>

                  </div>

                </div>


                {/* JOURNEY DETAILS */}

                <div className="summary-details">

                  <h3>
                    Journey Details
                  </h3>


                  <div className="details-grid">

                    <div className="detail-item">

                      <span>
                        🚌 Bus
                      </span>

                      <strong>
                        {booking.busName || "Not available"}
                      </strong>

                    </div>


                    <div className="detail-item">

                      <span>
                        📅 Travel Date
                      </span>

                      <strong>
                        {booking.date || "Not selected"}
                      </strong>

                    </div>


                    <div className="detail-item">

                      <span>
                        🕐 Departure
                      </span>

                      <strong>
                        {booking.departure || "Not available"}
                      </strong>

                    </div>


                    <div className="detail-item">

                      <span>
                        🕐 Arrival
                      </span>

                      <strong>
                        {booking.arrival || "Not available"}
                      </strong>

                    </div>

                  </div>

                </div>


                {/* PASSENGER DETAILS */}

                <div className="summary-details">

                  <h3>
                    Passenger Details
                  </h3>


                  <div className="details-grid">

                    <div className="detail-item">

                      <span>
                        👤 Gender
                      </span>

                      <strong>
                        {booking.gender || "Not selected"}
                      </strong>

                    </div>


                    <div className="detail-item">

                      <span>
                        💺 Selected Seat
                      </span>

                      <strong className="selected-seat-text">
                        {booking.seat
                          ? `Seat ${booking.seat}`
                          : "Not selected"}
                      </strong>

                    </div>

                  </div>

                </div>


                {/* PRICE */}

                <div className="price-section">

                  <div className="price-row">

                    <span>
                      Ticket Price
                    </span>

                    <strong>
                      {currency} {ticketPrice.toLocaleString()}
                    </strong>

                  </div>


                  <div className="price-row">

                    <span>
                      Service Fee
                    </span>

                    <strong>
                      {currency} 0
                    </strong>

                  </div>


                  <div className="price-divider"></div>


                  <div className="total-row">

                    <span>
                      Total Amount
                    </span>

                    <strong>
                      {currency} {ticketPrice.toLocaleString()}
                    </strong>

                  </div>

                </div>


                {/* ACTIONS */}

                <div className="summary-actions">

                  <button
                    type="button"
                    className="summary-back-btn"
                    onClick={handleBack}
                  >
                    ← Change Seat
                  </button>


                  <button
                    type="button"
                    className="summary-continue-btn"
                    onClick={handleContinue}
                  >
                    Continue to Payment →
                  </button>

                </div>

              </div>

            </div>


            {/* =================================
                RIGHT SIDE
            ================================= */}
            <div className="col-lg-4">

              <div className="ticket-card">

                <div className="ticket-icon">
                  🎫
                </div>

                <h3>
                  Your Ticket
                </h3>

                <p className="ticket-subtitle">
                  Booking information
                </p>


                <div className="ticket-route">

                  <div>

                    <span>
                      {booking.from || "From"}
                    </span>

                    <strong>
                      {booking.from
                        ? booking.from.substring(0, 3).toUpperCase()
                        : "---"}
                    </strong>

                  </div>


                  <div className="ticket-route-line">
                    ─────────→
                  </div>


                  <div>

                    <span>
                      {booking.to || "To"}
                    </span>

                    <strong>
                      {booking.to
                        ? booking.to.substring(0, 3).toUpperCase()
                        : "---"}
                    </strong>

                  </div>

                </div>


                <div className="ticket-info">

                  <div>

                    <span>
                      Date
                    </span>

                    <strong>
                      {booking.date || "Not selected"}
                    </strong>

                  </div>


                  <div>

                    <span>
                      Seat
                    </span>

                    <strong>
                      {booking.seat || "Not selected"}
                    </strong>

                  </div>


                  <div>

                    <span>
                      Passenger
                    </span>

                    <strong>
                      {booking.gender || "Not selected"}
                    </strong>

                  </div>


                  <div>

                    <span>
                      Amount
                    </span>

                    <strong>
                      {currency} {ticketPrice.toLocaleString()}
                    </strong>

                  </div>

                </div>


                <div className="ticket-note">

                  <strong>
                    🔒 Secure Booking
                  </strong>

                  <p>
                    Your booking details will be confirmed after
                    successful payment.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================
          FOOTER
      ===================================== */}
      <footer className="summary-footer">

        <p>
          © 2026 SmartBus. All Rights Reserved.
        </p>

      </footer>

    </div>
  );
}

export default BookingSummary;