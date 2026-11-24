import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Payment.css";

function Payment() {
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);

  const [paymentMethod, setPaymentMethod] = useState("card");

  const [formData, setFormData] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Load booking information
  useEffect(() => {
    const savedBooking = localStorage.getItem("smartBusBooking");

    if (savedBooking) {
      setBooking(JSON.parse(savedBooking));
    }
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  // Create real backend booking
  const createBooking = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (!booking) {
      setError("Booking information is missing. Please start again.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      /*
       * Create the real booking in the backend.
       *
       * We DO NOT send card details to the backend.
       */
      const bookingRequest = {
        scheduleId: booking.scheduleId,
        seatId: booking.seatId,
        pickupPointId: booking.pickupPointId,
        dropPointId: booking.dropPointId,
        passengerGender: booking.gender,
        bookingType:
          paymentMethod === "card"
            ? "ONLINE"
            : "PAY_ON_BOARDING",
      };

      const response = await fetch(
        "http://localhost:8080/api/bookings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(bookingRequest),
        }
      );

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("smartBusUser");
        navigate("/login");
        return;
      }

      const responseText = await response.text();

      if (!response.ok) {
        let errorMessage = "Unable to create booking.";

        try {
          const errorData = JSON.parse(responseText);

          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch {
          if (responseText) {
            errorMessage = responseText;
          }
        }

        throw new Error(errorMessage);
      }

      const createdBooking = JSON.parse(responseText);

      /*
       * Save payment information locally.
       *
       * Card details are NOT stored.
       */
      localStorage.setItem(
        "smartBusPayment",
        JSON.stringify({
          method: paymentMethod,
          amount: Number(booking.price) || 0,
          status: "Paid",
        })
      );

      /*
       * Save the real backend booking ID.
       * This will be used by the confirmation/ticket page.
       */
      localStorage.setItem(
        "smartBusCreatedBooking",
        JSON.stringify(createdBooking)
      );

      /*
       * Go to confirmation page with the real booking ID.
       */
      navigate(
        `/booking-confirmation?bookingId=${createdBooking.bookingId}`
      );

    } catch (err) {
      console.error("Booking error:", err);

      setError(
        err.message ||
          "Unable to complete your booking. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle payment
  const handlePayment = (e) => {
    e.preventDefault();

    if (!booking) {
      setError(
        "Booking information is missing. Please go back and select a seat again."
      );
      return;
    }

    if (paymentMethod === "card") {
      if (!formData.cardName.trim()) {
        setError("Please enter the name on the card.");
        return;
      }

      if (!formData.cardNumber.trim()) {
        setError("Please enter your card number.");
        return;
      }

      if (formData.cardNumber.length < 12) {
        setError("Please enter a valid card number.");
        return;
      }

      if (!formData.expiry.trim()) {
        setError("Please enter the card expiry date.");
        return;
      }

      if (!formData.cvv.trim()) {
        setError("Please enter the CVV.");
        return;
      }

      if (formData.cvv.length < 3) {
        setError("Please enter a valid CVV.");
        return;
      }
    }

    createBooking();
  };

  // If no booking information exists
  if (!booking) {
    return (
      <div className="payment-page">
        <section className="summary-empty">
          <div className="empty-icon">🚌</div>

          <h2>No Booking Found</h2>

          <p>
            Please select a bus and seat before making a payment.
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

  const ticketPrice = Number(booking.price) || 0;
  const currency = booking.currency || "LKR";

  return (
    <div className="payment-page">

      {/* HEADER */}

      <section className="payment-header">

        <div className="container">

          <div className="payment-header-content">

            <span>SMARTBUS BOOKING</span>

            <h1>Secure Payment</h1>

            <p>
              Complete your payment to confirm your bus reservation.
            </p>

          </div>

        </div>

      </section>


      {/* MAIN */}

      <section className="payment-section">

        <div className="container">

          <div className="row g-4">

            {/* PAYMENT FORM */}

            <div className="col-lg-8">

              <div className="payment-card">

                <div className="payment-title">

                  <span>PAYMENT</span>

                  <h2>Choose Payment Method</h2>

                  <p>
                    Select your preferred payment method.
                  </p>

                </div>


                {/* PAYMENT METHODS */}

                <div className="payment-methods">

                  <button
                    type="button"
                    className={
                      paymentMethod === "card"
                        ? "payment-method active"
                        : "payment-method"
                    }
                    onClick={() => {
                      setPaymentMethod("card");
                      setError("");
                    }}
                    disabled={loading}
                  >

                    <span className="method-icon">💳</span>

                    <span>
                      <strong>Debit / Credit Card</strong>
                      <small>Visa, Mastercard</small>
                    </span>

                  </button>


                  <button
                    type="button"
                    className={
                      paymentMethod === "cash"
                        ? "payment-method active"
                        : "payment-method"
                    }
                    onClick={() => {
                      setPaymentMethod("cash");
                      setError("");
                    }}
                    disabled={loading}
                  >

                    <span className="method-icon">💵</span>

                    <span>
                      <strong>Pay on Boarding</strong>
                      <small>Pay when boarding the bus</small>
                    </span>

                  </button>

                </div>


                {/* CARD FORM */}

                {paymentMethod === "card" && (

                  <form onSubmit={handlePayment}>

                    <div className="form-section-title">
                      Card Information
                    </div>


                    <div className="form-group">

                      <label>
                        Name on Card
                      </label>

                      <input
                        type="text"
                        name="cardName"
                        placeholder="Enter name on card"
                        value={formData.cardName}
                        onChange={handleChange}
                        disabled={loading}
                      />

                    </div>


                    <div className="form-group">

                      <label>
                        Card Number
                      </label>

                      <input
                        type="text"
                        name="cardNumber"
                        placeholder="Enter card number"
                        maxLength="16"
                        value={formData.cardNumber}
                        onChange={(e) => {

                          const value =
                            e.target.value.replace(/\D/g, "");

                          setFormData({
                            ...formData,
                            cardNumber: value,
                          });

                          setError("");
                        }}
                        disabled={loading}
                      />

                    </div>


                    <div className="form-row">

                      <div className="form-group">

                        <label>
                          Expiry Date
                        </label>

                        <input
                          type="text"
                          name="expiry"
                          placeholder="MM/YY"
                          maxLength="5"
                          value={formData.expiry}
                          onChange={handleChange}
                          disabled={loading}
                        />

                      </div>


                      <div className="form-group">

                        <label>
                          CVV
                        </label>

                        <input
                          type="password"
                          name="cvv"
                          placeholder="CVV"
                          maxLength="3"
                          value={formData.cvv}
                          onChange={(e) => {

                            const value =
                              e.target.value.replace(/\D/g, "");

                            setFormData({
                              ...formData,
                              cvv: value,
                            });

                            setError("");
                          }}
                          disabled={loading}
                        />

                      </div>

                    </div>


                    {error && (
                      <div className="payment-error">
                        ⚠️ {error}
                      </div>
                    )}


                    <div className="payment-actions">

                      <button
                        type="button"
                        className="payment-back-btn"
                        onClick={() =>
                          navigate("/booking-summary")
                        }
                        disabled={loading}
                      >
                        ← Back
                      </button>


                      <button
                        type="submit"
                        className="pay-btn"
                        disabled={loading}
                      >
                        {loading
                          ? "Processing..."
                          : `Pay ${currency} ${ticketPrice.toLocaleString()} →`}
                      </button>

                    </div>

                  </form>

                )}


                {/* PAY ON BOARDING */}

                {paymentMethod === "cash" && (

                  <div className="cash-payment">

                    <div className="cash-icon">
                      💵
                    </div>

                    <h3>
                      Pay on Boarding
                    </h3>

                    <p>
                      You can pay the ticket amount directly
                      when boarding the bus.
                    </p>

                    <div className="cash-warning">
                      Please arrive at least 15 minutes before
                      departure.
                    </div>


                    {error && (
                      <div className="payment-error">
                        ⚠️ {error}
                      </div>
                    )}


                    <div className="payment-actions">

                      <button
                        type="button"
                        className="payment-back-btn"
                        onClick={() =>
                          navigate("/booking-summary")
                        }
                        disabled={loading}
                      >
                        ← Back
                      </button>


                      <button
                        type="button"
                        className="pay-btn"
                        onClick={handlePayment}
                        disabled={loading}
                      >
                        {loading
                          ? "Processing..."
                          : "Confirm Booking →"}
                      </button>

                    </div>

                  </div>

                )}

              </div>

            </div>


            {/* ORDER SUMMARY */}

            <div className="col-lg-4">

              <div className="payment-summary-card">

                <div className="summary-icon">
                  🎫
                </div>

                <h3>
                  Booking Summary
                </h3>


                <div className="payment-summary-row">

                  <span>
                    Route
                  </span>

                  <strong>
                    {booking.from || "Not selected"} →{" "}
                    {booking.to || "Not selected"}
                  </strong>

                </div>


                <div className="payment-summary-row">

                  <span>
                    Bus
                  </span>

                  <strong>
                    {booking.busName || "Not available"}
                  </strong>

                </div>


                <div className="payment-summary-row">

                  <span>
                    Date
                  </span>

                  <strong>
                    {booking.date || "Not selected"}
                  </strong>

                </div>


                <div className="payment-summary-row">

                  <span>
                    Seat
                  </span>

                  <strong>
                    {booking.seat || "Not selected"}
                  </strong>

                </div>


                <div className="payment-divider"></div>


                <div className="payment-total">

                  <span>
                    Total Amount
                  </span>

                  <strong>
                    {currency} {ticketPrice.toLocaleString()}
                  </strong>

                </div>


                <div className="secure-note">

                  🔒 Secure payment

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* FOOTER */}

      <footer className="payment-footer">

        <p>
          © 2026 SmartBus. All Rights Reserved.
        </p>

      </footer>

    </div>
  );
}

export default Payment;