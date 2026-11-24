import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/DriverDashboard.css";

function DriverDashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("smartBusUser");
    navigate("/login");
  };

  return (
    <div className="driver-dashboard">
      <aside className={`driver-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="driver-logo">
          <div className="driver-logo-icon">
            <i className="bi bi-bus-front-fill"></i>
          </div>
          <div>
            <h2>SmartBus</h2>
            <span>Driver Portal</span>
          </div>
        </div>

        <nav className="driver-navigation">
          <p className="driver-nav-title">MAIN MENU</p>

          <button
            className="driver-nav-item active"
            onClick={() => navigate("/driver-dashboard")}
          >
            <i className="bi bi-grid-1x2-fill"></i>
            Dashboard
          </button>

          <button
            className="driver-nav-item"
            onClick={() => navigate("/driver-my-trip")}
          >
            <i className="bi bi-signpost-2-fill"></i>
            My Trip
          </button>

          <button
            className="driver-nav-item"
            onClick={() => navigate("/driver-passengers")}
          >
            <i className="bi bi-people-fill"></i>
            Passengers
          </button>

          <button
            className="driver-nav-item"
            onClick={() => navigate("/driver-track-bus")}
          >
            <i className="bi bi-geo-alt-fill"></i>
            Track Bus
          </button>
        </nav>

        <div className="driver-sidebar-bottom">
          <button
            className="driver-nav-item"
            onClick={() => navigate("/profile")}
          >
            <i className="bi bi-person-circle"></i>
            Profile
          </button>

          <button
            className="driver-nav-item"
            onClick={() => navigate("/")}
          >
            <i className="bi bi-globe2"></i>
            View Website
          </button>

          <button className="driver-nav-item logout" onClick={logout}>
            <i className="bi bi-box-arrow-right"></i>
            Logout
          </button>
        </div>
      </aside>

      <main className="driver-main">
        <header className="driver-topbar">
          <button
            className="driver-menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <i className="bi bi-list"></i>
          </button>

          <div>
            <h1>Driver Dashboard</h1>
            <p>Welcome back, Driver</p>
          </div>

          <div className="driver-profile">
            <div className="driver-avatar">
              <i className="bi bi-person-fill"></i>
            </div>
            <div>
              <strong>Driver</strong>
              <span>Bus Driver</span>
            </div>
          </div>
        </header>

        <section className="driver-content">
          <div className="driver-welcome">
            <div>
              <span className="driver-label">TODAY'S TRIP</span>
              <h2>Colombo → Kandy</h2>
              <p>Bus SB-102 • 08:30 AM Departure</p>
            </div>

            <button
              className="driver-primary-btn"
              onClick={() => navigate("/driver-my-trip")}
            >
              <i className="bi bi-play-fill"></i>
              View Trip
            </button>
          </div>

          <div className="driver-stats">
            <div className="driver-stat-card">
              <div className="driver-stat-icon">
                <i className="bi bi-bus-front-fill"></i>
              </div>
              <div>
                <span>Today's Trips</span>
                <h3>2</h3>
              </div>
            </div>

            <div className="driver-stat-card">
              <div className="driver-stat-icon">
                <i className="bi bi-people-fill"></i>
              </div>
              <div>
                <span>Passengers</span>
                <h3>38</h3>
              </div>
            </div>

            <div className="driver-stat-card">
              <div className="driver-stat-icon">
                <i className="bi bi-speedometer2"></i>
              </div>
              <div>
                <span>Current Speed</span>
                <h3>58 km/h</h3>
              </div>
            </div>

            <div className="driver-stat-card">
              <div className="driver-stat-icon">
                <i className="bi bi-check-circle-fill"></i>
              </div>
              <div>
                <span>Completed Trips</span>
                <h3>24</h3>
              </div>
            </div>
          </div>

          <div className="driver-dashboard-grid">
            <div className="driver-card">
              <div className="driver-card-header">
                <div>
                  <h3>Today's Schedule</h3>
                  <p>Your assigned trips for today</p>
                </div>
              </div>

              <div className="driver-trip-row">
                <div className="trip-time">
                  <strong>08:30</strong>
                  <span>AM</span>
                </div>

                <div className="trip-info">
                  <strong>Colombo → Kandy</strong>
                  <span>Bus SB-102 • 52 Seats</span>
                </div>

                <span className="trip-status active">Upcoming</span>
              </div>

              <div className="driver-trip-row">
                <div className="trip-time">
                  <strong>03:30</strong>
                  <span>PM</span>
                </div>

                <div className="trip-info">
                  <strong>Kandy → Colombo</strong>
                  <span>Bus SB-102 • 52 Seats</span>
                </div>

                <span className="trip-status">Scheduled</span>
              </div>
            </div>

            <div className="driver-card">
              <div className="driver-card-header">
                <div>
                  <h3>Safety Notice</h3>
                  <p>Important driver reminder</p>
                </div>
                <i className="bi bi-shield-check"></i>
              </div>

              <div className="driver-safety">
                <i className="bi bi-exclamation-circle-fill"></i>
                <p>
                  Please check the bus condition and passenger count before
                  starting your trip.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default DriverDashboard;