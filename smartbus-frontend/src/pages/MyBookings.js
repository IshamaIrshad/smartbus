import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/MyBookings.css";

function MyBookings() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("upcoming");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // LOAD BOOKINGS FROM BACKEND
  // =========================
  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:8080/api/passenger/bookings",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("token");
          localStorage.removeItem("smartBusUser");
          navigate("/login");
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to load bookings.");
        }

        const data = await response.json();

        setBookings(data);
      } catch (error) {
        console.error("Booking loading error:", error);
        setError("Unable to load your bookings. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [navigate]);

  // =========================
  // FORMAT DATE
  // =========================
  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    const dateObject = new Date(date);

    return dateObject.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // =========================
  // FORMAT TIME
  // =========================
  const formatTime = (time) => {
    if (!time) {
      return "-";
    }

    const [hours, minutes] = time.split(":");

    const date = new Date();
    date.setHours(Number(hours), Number(minutes), 0, 0);

    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // =========================
  // CHECK UPCOMING BOOKING
  // =========================
  const isUpcoming = (booking) => {
    if (!booking.travelDate) {
      return false;
    }

    if (booking.status !== "BOOKED") {
      return false;
    }

    const travelDate = new Date(
      `${booking.travelDate}T${booking.departureTime || "00:00:00"}`
    );

    return travelDate >= new Date();
  };

  // =========================
  // CANCEL BOOKING
  // =========================
  const handleCancel = async (bookingId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmCancel) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/passenger/bookings/${bookingId}/cancel`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            reason: "Cancelled by passenger",
          }),
        }
      );

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("smartBusUser");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        throw new Error(
          errorData.message || "Failed to cancel booking."
        );
      }

      const updatedBooking = await response.json();

      setBookings((currentBookings) =>
        currentBookings.map((booking) =>
          booking.bookingId === updatedBooking.bookingId
            ? updatedBooking
            : booking
        )
      );
    } catch (error) {
      console.error("Booking cancellation error:", error);
      alert(error.message || "Unable to cancel booking.");
    }
  };

  // =========================
  // BOOKING GROUPS
  // =========================
  const upcomingBookings = bookings.filter(
    (booking) => isUpcoming(booking)
  );

  const pastBookings = bookings.filter(
    (booking) => !isUpcoming(booking)
  );

  const displayedBookings =
    activeTab === "upcoming"
      ? upcomingBookings
      : pastBookings;

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="my-bookings-page">

        <section className="bookings-header">
          <div className="container">
            <p>PASSENGER ACCOUNT</p>
            <h1>My Bookings</h1>
            <span>
              View and manage all your SmartBus journeys in one place.
            </span>
          </div>
        </section>

        <main className="container bookings-container">
          <div className="empty-bookings">
            <div className="empty-icon">
              <i className="bi bi-hourglass-split"></i>
            </div>

            <h2>Loading Bookings...</h2>

            <p>
              Please wait while we load your SmartBus bookings.
            </p>
          </div>
        </main>

      </div>
    );
  }

  return (
    <div className="my-bookings-page">

      {/* Header */}
      <section className="bookings-header">
        <div className="container">
          <p>PASSENGER ACCOUNT</p>
          <h1>My Bookings</h1>
          <span>
            View and manage all your SmartBus journeys in one place.
          </span>
        </div>
      </section>

      <main className="container bookings-container">

        {/* Error */}
        {error && (
          <div className="password-error">
            <i className="bi bi-exclamation-circle"></i>
            {error}
          </div>
        )}

        {/* Summary Cards */}
        <div className="booking-stats">

          <div className="booking-stat-card">

            <div className="booking-stat-icon">
              <i className="bi bi-ticket-perforated"></i>
            </div>

            <div>
              <span>Total Bookings</span>
              <h2>{bookings.length}</h2>
            </div>

          </div>

          <div className="booking-stat-card">

            <div className="booking-stat-icon">
              <i className="bi bi-calendar-check"></i>
            </div>

            <div>
              <span>Upcoming</span>
              <h2>{upcomingBookings.length}</h2>
            </div>

          </div>

          <div className="booking-stat-card">

            <div className="booking-stat-icon">
              <i className="bi bi-check-circle"></i>
            </div>

            <div>
              <span>Completed</span>

              <h2>
                {
                  bookings.filter(
                    (booking) =>
                      booking.status === "COMPLETED"
                  ).length
                }
              </h2>
            </div>

          </div>

        </div>

        {/* Booking Tabs */}
        <section className="bookings-section">

          <div className="booking-tabs">

            <button
              className={
                activeTab === "upcoming"
                  ? "booking-tab active"
                  : "booking-tab"
              }
              onClick={() => setActiveTab("upcoming")}
            >
              <i className="bi bi-calendar-event"></i>
              Upcoming
              <span>{upcomingBookings.length}</span>
            </button>

            <button
              className={
                activeTab === "past"
                  ? "booking-tab active"
                  : "booking-tab"
              }
              onClick={() => setActiveTab("past")}
            >
              <i className="bi bi-clock-history"></i>
              Past Bookings
              <span>{pastBookings.length}</span>
            </button>

          </div>

          {/* Booking List */}
          <div className="booking-list">

            {displayedBookings.length === 0 ? (

              <div className="empty-bookings">

                <div className="empty-icon">
                  <i className="bi bi-ticket-perforated"></i>
                </div>

                <h2>
                  {activeTab === "upcoming"
                    ? "No Upcoming Bookings"
                    : "No Past Bookings"}
                </h2>

                <p>
                  {activeTab === "upcoming"
                    ? "You don't have any upcoming journeys."
                    : "Your completed and cancelled journeys will appear here."}
                </p>

                {activeTab === "upcoming" && (
                  <button
                    onClick={() => navigate("/search")}
                    className="search-bus-btn"
                  >
                    <i className="bi bi-search"></i>
                    Search Buses
                  </button>
                )}

              </div>

            ) : (

              displayedBookings.map((booking) => (

                <div
                  className="booking-card"
                  key={booking.bookingId}
                >

                  {/* Booking Top */}
                  <div className="booking-card-top">

                    <div>

                      <span className="booking-label">
                        BOOKING REFERENCE
                      </span>

                      <h3>
                        SB{String(booking.bookingId).padStart(6, "0")}
                      </h3>

                    </div>

                    <span
                      className={`booking-status ${
                        booking.status === "BOOKED"
                          ? "confirmed"
                          : booking.status === "COMPLETED"
                          ? "completed"
                          : "cancelled"
                      }`}
                    >

                      <i
                        className={
                          booking.status === "BOOKED"
                            ? "bi bi-check-circle-fill"
                            : booking.status === "COMPLETED"
                            ? "bi bi-check2-circle"
                            : "bi bi-x-circle-fill"
                        }
                      ></i>

                      {booking.status === "BOOKED"
                        ? "Confirmed"
                        : booking.status === "COMPLETED"
                        ? "Completed"
                        : "Cancelled"}

                    </span>

                  </div>

                  {/* Route */}
                  <div className="booking-route">

                    <div className="booking-location">

                      <span>FROM</span>

                      <h2>
                        {booking.pickupPoint}
                      </h2>

                    </div>

                    <div className="booking-route-line">

                      <div className="route-circle"></div>

                      <div className="route-dotted"></div>

                      <i className="bi bi-bus-front-fill"></i>

                      <div className="route-dotted"></div>

                      <div className="route-circle"></div>

                    </div>

                    <div className="booking-location">

                      <span>TO</span>

                      <h2>
                        {booking.dropPoint}
                      </h2>

                    </div>

                  </div>

                  {/* Details */}
                  <div className="booking-details">

                    <div>
                      <span>BUS</span>
                      <strong>
                        {booking.busName}
                      </strong>
                    </div>

                    <div>
                      <span>DATE</span>
                      <strong>
                        {formatDate(booking.travelDate)}
                      </strong>
                    </div>

                    <div>
                      <span>DEPARTURE</span>
                      <strong>
                        {formatTime(booking.departureTime)}
                      </strong>
                    </div>

                    <div>
                      <span>ARRIVAL</span>
                      <strong>
                        {formatTime(booking.arrivalTime)}
                      </strong>
                    </div>

                    <div>
                      <span>SEAT</span>
                      <strong>
                        {booking.seatNumber}
                      </strong>
                    </div>

                    <div>
                      <span>PRICE</span>
                      <strong>
                        Rs. {Number(booking.totalPrice).toLocaleString()}
                      </strong>
                    </div>

                  </div>

                  {/* Actions */}
                  <div className="booking-actions">

                    {booking.status === "BOOKED" && (
                      <button
                        className="view-ticket-btn"
                        onClick={() =>
                          navigate(
                            `/booking-confirmation?bookingId=${booking.bookingId}`
                          )
                        }
                      >
                        <i className="bi bi-ticket"></i>
                        View Ticket
                      </button>
                    )}

                    {booking.status === "BOOKED" && (
                      <button
                        className="cancel-booking-btn"
                        onClick={() =>
                          handleCancel(booking.bookingId)
                        }
                      >
                        <i className="bi bi-x-circle"></i>
                        Cancel Booking
                      </button>
                    )}

                    <button
                      className="booking-detail-btn"
                      onClick={() =>
                        alert(
                          `Booking Reference: SB${String(
                            booking.bookingId
                          ).padStart(6, "0")}\n` +
                          `Route: ${booking.pickupPoint} → ${booking.dropPoint}\n` +
                          `Seat: ${booking.seatNumber}\n` +
                          `Bus: ${booking.busName}\n` +
                          `Price: Rs. ${Number(
                            booking.totalPrice
                          ).toLocaleString()}`
                        )
                      }
                    >
                      <i className="bi bi-info-circle"></i>
                      Details
                    </button>

                  </div>

                </div>

              ))

            )}

          </div>

        </section>

        {/* New Booking */}
        <section className="new-booking-box">

          <div>
            <span>PLAN ANOTHER JOURNEY</span>

            <h2>
              Looking for your next trip?
            </h2>

            <p>
              Search available buses and reserve your seat today.
            </p>
          </div>

          <button
            onClick={() => navigate("/search")}
          >
            Search Buses
            <i className="bi bi-arrow-right"></i>
          </button>

        </section>

        {/* Back */}
        <div className="back-dashboard">

          <button
            onClick={() =>
              navigate("/passenger-dashboard")
            }
          >
            <i className="bi bi-arrow-left"></i>
            Back to Passenger Dashboard
          </button>

        </div>

      </main>

    </div>
  );
}

export default MyBookings;