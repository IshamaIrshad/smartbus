import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/DriverMyTrip.css";

function DriverMyTrip() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("smartBusUser");
    navigate("/login");
  };

  return (
    <div className="driver-trip-page">
      <aside className="driver-trip-sidebar">
        <div className="driver-trip-logo">
          <div className="driver-trip-logo-icon">
            <i className="bi bi-bus-front-fill"></i>
          </div>
          <div>
            <h2>SmartBus</h2>
            <span>Driver Portal</span>
          </div>
        </div>

        <nav className="driver-trip-navigation">
          <p>MAIN MENU</p>

          <button onClick={() => navigate("/driver-dashboard")}>
            <i className="bi bi-grid-1x2-fill"></i>
            Dashboard
          </button>

          <button className="active">
            <i className="bi bi-signpost-2-fill"></i>
            My Trip
          </button>

          <button onClick={() => navigate("/driver-passengers")}>
            <i className="bi bi-people-fill"></i>
            Passengers
          </button>

          <button onClick={() => navigate("/driver-track-bus")}>
            <i className="bi bi-geo-alt-fill"></i>
            Track Bus
          </button>
        </nav>

        <div className="driver-trip-sidebar-bottom">
          <button onClick={() => navigate("/profile")}>
            <i className="bi bi-person-circle"></i>
            Profile
          </button>

          <button onClick={() => navigate("/")}>
            <i className="bi bi-globe2"></i>
            View Website
          </button>

          <button onClick={logout}>
            <i className="bi bi-box-arrow-right"></i>
            Logout
          </button>
        </div>
      </aside>

      <main className="driver-trip-main">
        <header className="driver-trip-topbar">
          <div>
            <span>DRIVER PORTAL</span>
            <h1>My Trip</h1>
          </div>

          <div className="driver-trip-user">
            <div>
              <strong>Driver</strong>
              <span>Bus Driver</span>
            </div>
            <i className="bi bi-person-circle"></i>
          </div>
        </header>

        <section className="driver-trip-content">
          <div className="trip-header-card">
            <div>
              <span className="trip-label">TODAY'S ASSIGNED TRIP</span>
              <h2>Colombo → Kandy</h2>
              <p>Bus SB-102</p>
            </div>

            <span className="trip-live-status">
              <i className="bi bi-circle-fill"></i>
              Upcoming
            </span>
          </div>

          <div className="trip-details-grid">
            <div className="trip-detail-card">
              <i className="bi bi-clock-fill"></i>
              <span>Departure</span>
              <strong>08:30 AM</strong>
            </div>

            <div className="trip-detail-card">
              <i className="bi bi-geo-alt-fill"></i>
              <span>Route</span>
              <strong>Colombo → Kandy</strong>
            </div>

            <div className="trip-detail-card">
              <i className="bi bi-people-fill"></i>
              <span>Passengers</span>
              <strong>38 / 52</strong>
            </div>

            <div className="trip-detail-card">
              <i className="bi bi-signpost-fill"></i>
              <span>Distance</span>
              <strong>116 km</strong>
            </div>
          </div>

          <div className="trip-route-card">
            <h3>Trip Route</h3>

            <div className="route-line">
              <div className="route-point">
                <span></span>
                <div>
                  <strong>Colombo</strong>
                  <small>08:30 AM</small>
                </div>
              </div>

              <div className="route-connector"></div>

              <div className="route-point">
                <span></span>
                <div>
                  <strong>Kadawatha</strong>
                  <small>09:05 AM</small>
                </div>
              </div>

              <div className="route-connector"></div>

              <div className="route-point">
                <span></span>
                <div>
                  <strong>Kandy</strong>
                  <small>11:00 AM</small>
                </div>
              </div>
            </div>
          </div>

          <div className="trip-action-buttons">
            <button onClick={() => navigate("/driver-passengers")}>
              <i className="bi bi-people-fill"></i>
              View Passengers
            </button>

            <button onClick={() => navigate("/driver-track-bus")}>
              <i className="bi bi-geo-alt-fill"></i>
              Track Bus
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default DriverMyTrip;