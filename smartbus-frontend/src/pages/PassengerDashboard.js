import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/PassengerDashboard.css";

function PassengerDashboard() {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("Passenger");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("smartBusUser");
    const token = localStorage.getItem("token");

    // Get logged-in passenger name
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);

        setUserName(
          user.name ||
          user.fullName ||
          user.username ||
          "Passenger"
        );
      } catch (error) {
        console.error("Error reading user details:", error);
      }
    }

    // Get passenger bookings
    if (!token) {
      setLoading(false);
      return;
    }

    fetch("http://localhost:8080/api/passenger/bookings", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Failed to load bookings");
        }

        return response.json();
      })
      .then((data) => {
        setBookings(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        console.error("Error loading bookings:", error);
        setBookings([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Convert travel date + departure time into Date
  const getBookingDateTime = (booking) => {
    if (!booking.travelDate) {
      return null;
    }

    if (booking.departureTime) {
      return new Date(
        `${booking.travelDate}T${booking.departureTime}`
      );
    }

    return new Date(`${booking.travelDate}T00:00:00`);
  };

  const now = new Date();

  // Find upcoming bookings
  const upcomingBookings = bookings
    .filter((booking) => {
      const bookingDate = getBookingDateTime(booking);

      if (!bookingDate) {
        return false;
      }

      const status = String(booking.status || "").toUpperCase();

      if (
        status === "CANCELLED" ||
        status === "CANCELED" ||
        status === "COMPLETED"
      ) {
        return false;
      }

      return bookingDate >= now;
    })
    .sort((a, b) => {
      return (
        getBookingDateTime(a) -
        getBookingDateTime(b)
      );
    });

  // Nearest upcoming booking
  const upcomingBooking =
    upcomingBookings.length > 0
      ? upcomingBookings[0]
      : null;

  // Completed bookings
  const completedBookings = bookings.filter((booking) => {
    const bookingDate = getBookingDateTime(booking);
    const status = String(booking.status || "").toUpperCase();

    return (
      status === "COMPLETED" ||
      (bookingDate && bookingDate < now)
    );
  });

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "-";

    const date = new Date(`${dateString}T00:00:00`);

    if (isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Format time
  const formatTime = (timeString) => {
    if (!timeString) return "-";

    const parts = timeString.split(":");

    if (parts.length < 2) {
      return timeString;
    }

    const hours = parseInt(parts[0], 10);
    const minutes = parts[1];

    const period = hours >= 12 ? "PM" : "AM";
    const displayHour = hours % 12 || 12;

    return `${String(displayHour).padStart(2, "0")}:${minutes} ${period}`;
  };

  // View ticket
  const handleViewTicket = () => {
    if (upcomingBooking) {
      localStorage.setItem(
        "smartBusSelectedBooking",
        JSON.stringify(upcomingBooking)
      );

      navigate("/booking-confirmation");
    }
  };

  return (
    <div className="passenger-dashboard">

      {/* ================= HEADER ================= */}

      <header className="dashboard-header">
        <div className="container">

          <div className="welcome-section">

            <div>
              <div className="dashboard-label">
                PASSENGER DASHBOARD
              </div>

              <h1>
                Welcome, {userName} 👋
              </h1>

              <p>
                Manage your bus bookings, view your trips
                and plan your next journey.
              </p>
            </div>

            <div
              className="profile-shortcut"
              onClick={() => navigate("/profile")}
              style={{ cursor: "pointer" }}
            >

              <div className="profile-avatar">
                {userName.charAt(0).toUpperCase()}
              </div>

              <div>
                <strong>{userName}</strong>
                <span>SmartBus Member</span>
              </div>

            </div>

          </div>

        </div>
      </header>

      {/* ================= CONTENT ================= */}

      <main className="dashboard-content">

        <div className="container">

          {/* ================= STATISTICS ================= */}

          <section className="stats-row">

            <div className="stat-card">

              <div className="stat-icon">
                🎫
              </div>

              <div>
                <span>Total Bookings</span>

                <h2>
                  {loading ? "..." : bookings.length}
                </h2>
              </div>

            </div>


            <div className="stat-card">

              <div className="stat-icon">
                🚌
              </div>

              <div>
                <span>Upcoming Trips</span>

                <h2>
                  {loading
                    ? "..."
                    : upcomingBookings.length}
                </h2>
              </div>

            </div>


            <div className="stat-card">

              <div className="stat-icon">
                ✅
              </div>

              <div>
                <span>Completed Trips</span>

                <h2>
                  {loading
                    ? "..."
                    : completedBookings.length}
                </h2>
              </div>

            </div>

          </section>


          {/* ================= QUICK ACTIONS ================= */}

          <section className="dashboard-section">

            <div className="section-heading">

              <div>
                <span>GET STARTED</span>
                <h2>Quick Actions</h2>
              </div>

            </div>


            <div className="action-grid">

              <div
                className="action-card"
                onClick={() => navigate("/search")}
              >

                <div className="action-icon">
                  🔍
                </div>

                <div>
                  <h3>Search Bus</h3>

                  <p>
                    Find buses, routes, schedules and
                    available seats.
                  </p>
                </div>

                <div className="action-arrow">
                  →
                </div>

              </div>


              <div
                className="action-card"
                onClick={() => navigate("/my-bookings")}
              >

                <div className="action-icon">
                  🎫
                </div>

                <div>
                  <h3>My Bookings</h3>

                  <p>
                    View and manage your bus bookings.
                  </p>
                </div>

                <div className="action-arrow">
                  →
                </div>

              </div>


              <div
                className="action-card"
                onClick={() => navigate("/profile")}
              >

                <div className="action-icon">
                  👤
                </div>

                <div>
                  <h3>My Profile</h3>

                  <p>
                    View and update your personal details.
                  </p>
                </div>

                <div className="action-arrow">
                  →
                </div>

              </div>


              <div
                className="action-card"
                onClick={() => navigate("/track-bus")}
              >

                <div className="action-icon">
                  📍
                </div>

                <div>
                  <h3>Track Bus</h3>

                  <p>
                    Check your bus location and journey status.
                  </p>
                </div>

                <div className="action-arrow">
                  →
                </div>

              </div>

            </div>

          </section>


          {/* ================= UPCOMING JOURNEY ================= */}

          <section className="dashboard-section">

            <div className="section-heading">

              <div>
                <span>YOUR NEXT TRIP</span>
                <h2>Upcoming Journey</h2>
              </div>

              {upcomingBooking && (
                <button
                  className="view-all-btn"
                  onClick={() => navigate("/my-bookings")}
                >
                  View All <i>→</i>
                </button>
              )}

            </div>


            {loading ? (

              <div className="upcoming-card">
                <p>Loading your journey...</p>
              </div>

            ) : upcomingBooking ? (

              <div className="upcoming-card">

                {/* Route */}

                <div className="journey-route">

                  <div className="location">

                    <span>FROM</span>

                    <h3>
                      {upcomingBooking.pickupPoint ||
                        upcomingBooking.pickupPointName ||
                        "-"}
                    </h3>

                  </div>


                  <div className="route-line">

                    <div className="route-dot"></div>

                    <div className="route-dashed"></div>

                    <i>🚌</i>

                    <div className="route-dashed"></div>

                    <div className="route-dot"></div>

                  </div>


                  <div className="location destination">

                    <span>TO</span>

                    <h3>
                      {upcomingBooking.dropPoint ||
                        upcomingBooking.dropPointName ||
                        "-"}
                    </h3>

                  </div>

                </div>


                {/* Journey Details */}

                <div className="journey-details">

                  <div>
                    <span>DATE</span>

                    <strong>
                      {formatDate(
                        upcomingBooking.travelDate
                      )}
                    </strong>
                  </div>


                  <div>
                    <span>DEPARTURE</span>

                    <strong>
                      {formatTime(
                        upcomingBooking.departureTime
                      )}
                    </strong>
                  </div>


                  <div>
                    <span>SEAT</span>

                    <strong>
                      {upcomingBooking.seat || "-"}
                    </strong>
                  </div>


                  <div>
                    <span>STATUS</span>

                    <strong className="status-confirmed">
                      <i>●</i>{" "}
                      {upcomingBooking.status ||
                        "Confirmed"}
                    </strong>
                  </div>

                </div>


                {/* Journey Actions */}

                <div className="journey-actions">

                  <button
                    className="ticket-btn"
                    onClick={handleViewTicket}
                  >
                    🎫 View Ticket
                  </button>


                  <button
                    className="details-btn"
                    onClick={() =>
                      navigate("/my-bookings")
                    }
                  >
                    Booking Details <i>→</i>
                  </button>

                </div>

              </div>

            ) : (

              /* ================= NO BOOKINGS ================= */

              <div className="upcoming-card">

                <div
                  style={{
                    textAlign: "center",
                    padding: "30px 20px"
                  }}
                >

                  <div
                    style={{
                      fontSize: "40px",
                      marginBottom: "12px"
                    }}
                  >
                    🚌
                  </div>

                  <h3
                    style={{
                      marginBottom: "8px",
                      color: "#17324d"
                    }}
                  >
                    No Upcoming Journey
                  </h3>

                  <p
                    style={{
                      color: "#70818f",
                      marginBottom: "20px"
                    }}
                  >
                    You don't have any upcoming bus
                    trips yet.
                  </p>

                  <button
                    className="ticket-btn"
                    onClick={() => navigate("/search")}
                  >
                    + Book Your First Trip
                  </button>

                </div>

              </div>

            )}

          </section>


          {/* ================= NEW BOOKING ================= */}

          <section className="new-booking-section">

            <div className="new-booking-content">

              <div>

                <span>READY TO TRAVEL?</span>

                <h2>
                  Plan Your Next Journey
                </h2>

                <p>
                  Find your preferred bus, choose your
                  seat and book your ticket easily.
                </p>

              </div>


              <button
                className="new-booking-btn"
                onClick={() => navigate("/search")}
              >
                + New Booking
              </button>

            </div>

          </section>

        </div>

      </main>


      {/* ================= FOOTER ================= */}

      <footer className="dashboard-footer">

        <div className="container">

          <div>
            <h3>SmartBus</h3>

            <p>
              © 2026 SmartBus. All rights reserved.
            </p>
          </div>


          <div className="footer-links">

            <button
              onClick={() => navigate("/search")}
            >
              Search Bus
            </button>

            <button
              onClick={() => navigate("/my-bookings")}
            >
              My Bookings
            </button>

            <button
              onClick={() => navigate("/profile")}
            >
              Profile
            </button>

          </div>

        </div>

      </footer>

    </div>
  );
}

export default PassengerDashboard;