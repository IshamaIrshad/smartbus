import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ConductorMyTrip.css";

function ConductorMyTrip() {
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(
          "http://localhost:8080/api/conductor/dashboard",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 401 || response.status === 403) {
          setError("Your session may have expired. Please log in again.");
          return;
        }

        if (!response.ok) {
          const message = await response.text();
          throw new Error(message || "Unable to load trip details.");
        }

        const data = await response.json();
        setTrip(data);
      } catch (err) {
        console.error("My Trip error:", err);
        setError("Unable to load trip details. Please check the backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("smartBusUser");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const formatTime = (time) => {
    if (!time) return "--:--";

    const [hourText, minuteText = "00"] = time.split(":");
    const hour = Number(hourText);
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;

    return `${String(displayHour).padStart(2, "0")}:${minuteText} ${period}`;
  };

  const getInitials = (name) => {
    if (!name) return "C";

    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join("");
  };

  const conductorName = trip?.conductorName || "Conductor";
  const departureTime = formatTime(trip?.departureTime);
  const arrivalTime = formatTime(trip?.arrivalTime);

  return (
    <div className="conductor-trip-page">
      <aside className="conductor-trip-sidebar">
        <div className="conductor-trip-logo">
          <div className="conductor-trip-logo-icon">
            <i className="bi bi-bus-front-fill"></i>
          </div>

          <div>
            <h2>SmartBus</h2>
            <span>Conductor Portal</span>
          </div>
        </div>

        <nav className="conductor-trip-navigation">
          <p>MAIN MENU</p>

          <button onClick={() => navigate("/conductor-dashboard")}>
            <i className="bi bi-grid-1x2-fill"></i>
            Dashboard
          </button>

          <button
            className="active"
            onClick={() => navigate("/conductor-my-trip")}
          >
            <i className="bi bi-signpost-2-fill"></i>
            My Trip
          </button>

          <button onClick={() => navigate("/conductor-passengers")}>
            <i className="bi bi-people-fill"></i>
            Passengers
          </button>

          <button onClick={() => navigate("/conductor-tickets")}>
            <i className="bi bi-ticket-perforated-fill"></i>
            Tickets
          </button>

          <button onClick={() => navigate("/conductor-track-bus")}>
            <i className="bi bi-geo-alt-fill"></i>
            Track Bus
          </button>
        </nav>

        <div className="conductor-trip-sidebar-bottom">
          <button onClick={() => navigate("/")}>
            <i className="bi bi-globe2"></i>
            View Website
          </button>

          <button className="logout" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right"></i>
            Logout
          </button>
        </div>
      </aside>

      <main className="conductor-trip-main">
        <header className="conductor-trip-topbar">
          <div>
            <span>CONDUCTOR PORTAL</span>
            <h1>My Trip</h1>
          </div>

          <div className="conductor-trip-user">
            <div>{getInitials(conductorName)}</div>

            <section>
              <strong>{conductorName}</strong>
              <small>Conductor</small>
            </section>
          </div>
        </header>

        <div className="conductor-trip-content">
          {loading && <p>Loading your assigned trip...</p>}

          {!loading && error && (
            <div className="conductor-trip-header-card">
              <div>
                <span className="trip-label">TRIP INFORMATION</span>
                <h2>Unable to load trip</h2>
                <p>{error}</p>
              </div>
            </div>
          )}

          {!loading && !error && trip && (
            <>
              <div className="conductor-trip-header-card">
                <div>
                  <span className="trip-label">YOUR ASSIGNED TRIP</span>

                  <h2>{trip.routeName || "Route not assigned"}</h2>

                  <p>
                    <i className="bi bi-calendar3"></i>
                    Travel date is not available from this API
                  </p>
                </div>

                <span className="trip-status">
                  <span></span>
                  Assigned
                </span>
              </div>

              <div className="conductor-trip-details-grid">
                <div className="conductor-trip-detail">
                  <i className="bi bi-bus-front-fill"></i>
                  <span>Bus Number</span>
                  <strong>{trip.registrationNumber || "Not assigned"}</strong>
                </div>

                <div className="conductor-trip-detail">
                  <i className="bi bi-person-badge-fill"></i>
                  <span>Driver</span>
                  <strong>{trip.driverName || "Not assigned"}</strong>
                </div>

                <div className="conductor-trip-detail">
                  <i className="bi bi-clock-fill"></i>
                  <span>Departure</span>
                  <strong>{departureTime}</strong>
                </div>

                <div className="conductor-trip-detail">
                  <i className="bi bi-clock-history"></i>
                  <span>Expected Arrival</span>
                  <strong>{arrivalTime}</strong>
                </div>
              </div>

              <div className="conductor-trip-route-card">
                <div className="route-header">
                  <h3>Trip Route</h3>
                  <span>{trip.busName || "Assigned bus"}</span>
                </div>

                <div className="route-container">
                  <div className="route-location">
                    <div className="route-marker start">
                      <i className="bi bi-geo-alt-fill"></i>
                    </div>

                    <div>
                      <strong>{trip.routeName || "Assigned route"}</strong>
                      <span>Departure · {departureTime}</span>
                    </div>
                  </div>

                  <div className="route-line">
                    <span></span>
                  </div>

                  <div className="route-location">
                    <div className="route-marker end">
                      <i className="bi bi-geo-alt-fill"></i>
                    </div>

                    <div>
                      <strong>Destination details unavailable</strong>
                      <span>Arrival · {arrivalTime}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="conductor-trip-actions">
                <button onClick={() => navigate("/conductor-passengers")}>
                  <i className="bi bi-people-fill"></i>
                  View Passengers
                </button>

                <button onClick={() => navigate("/conductor-tickets")}>
                  <i className="bi bi-ticket-perforated-fill"></i>
                  Check Tickets
                </button>

                <button onClick={() => navigate("/conductor-track-bus")}>
                  <i className="bi bi-geo-alt-fill"></i>
                  Track Bus
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default ConductorMyTrip;