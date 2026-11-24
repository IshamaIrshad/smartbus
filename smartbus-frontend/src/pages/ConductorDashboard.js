import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ConductorDashboard.css";

function ConductorDashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
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
          throw new Error(message || "Unable to load dashboard.");
        }

        const data = await response.json();
        setDashboard(data);
      } catch (err) {
        console.error("Conductor dashboard error:", err);
        setError("Unable to load dashboard. Please check the backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("smartBusUser");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const formatTime = (time) => {
    if (!time) return "--:--";

    const parts = time.split(":");
    const hours = Number(parts[0]);
    const minutes = parts[1] || "00";
    const period = hours >= 12 ? "PM" : "AM";
    const displayHour = hours % 12 || 12;

    return `${String(displayHour).padStart(2, "0")}:${minutes} ${period}`;
  };

  const getInitials = (name) => {
    if (!name) return "C";

    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
  };

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "GOOD MORNING";
    if (hour < 17) return "GOOD AFTERNOON";
    return "GOOD EVENING";
  };

  const conductorName = dashboard?.conductorName || "Conductor";
  const busRegistration = dashboard?.registrationNumber || "Not assigned";
  const totalPassengers = dashboard?.totalPassengers ?? 0;
  const busCapacity = dashboard?.busCapacity ?? 0;
  const departureTime = formatTime(dashboard?.departureTime);
  const arrivalTime = formatTime(dashboard?.arrivalTime);

  const passengerPercentage =
    busCapacity > 0
      ? Math.min(100, Math.round((totalPassengers / busCapacity) * 100))
      : 0;

  return (
    <div className="conductor-dashboard">
      {/* SIDEBAR */}
      <aside className={`conductor-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="conductor-logo">
          <div className="conductor-logo-icon">
            <i className="bi bi-bus-front-fill"></i>
          </div>

          <div>
            <h2>SmartBus</h2>
            <span>Conductor Portal</span>
          </div>
        </div>

        <nav className="conductor-navigation">
          <p className="conductor-nav-title">MAIN MENU</p>

          <button
            className="conductor-nav-item active"
            onClick={() => navigate("/conductor-dashboard")}
          >
            <i className="bi bi-grid-1x2-fill"></i>
            <span>Dashboard</span>
          </button>

          <button
            className="conductor-nav-item"
            onClick={() => navigate("/conductor-my-trip")}
          >
            <i className="bi bi-signpost-2-fill"></i>
            <span>My Trip</span>
          </button>

          <button
            className="conductor-nav-item"
            onClick={() => navigate("/conductor-passengers")}
          >
            <i className="bi bi-people-fill"></i>
            <span>Passengers</span>
          </button>

          <button
            className="conductor-nav-item"
            onClick={() => navigate("/conductor-tickets")}
          >
            <i className="bi bi-ticket-perforated-fill"></i>
            <span>Tickets</span>
          </button>

          <button
            className="conductor-nav-item"
            onClick={() => navigate("/conductor-track-bus")}
          >
            <i className="bi bi-geo-alt-fill"></i>
            <span>Track Bus</span>
          </button>
        </nav>

        <div className="conductor-sidebar-bottom">
          <button
            className="conductor-view-website-btn"
            onClick={() => navigate("/")}
          >
            <i className="bi bi-globe2"></i>
            <span>View Website</span>
          </button>

          <button className="conductor-logout-btn" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="conductor-main">
        <header className="conductor-topbar">
          <button
            className="conductor-menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <i className="bi bi-list"></i>
          </button>

          <div className="conductor-topbar-title">
            <span>CONDUCTOR PORTAL</span>
            <h1>Dashboard</h1>
          </div>

          <div className="conductor-profile">
            <div className="conductor-avatar">
              {getInitials(conductorName)}
            </div>

            <div className="conductor-profile-info">
              <strong>{conductorName}</strong>
              <span>Conductor</span>
            </div>
          </div>
        </header>

        <div className="conductor-content">
          {/* WELCOME */}
          <section className="conductor-welcome">
            <div>
              <span className="conductor-welcome-label">
                {getGreeting()}
              </span>

              <h2>Welcome back, {conductorName}!</h2>

              <p>
                Manage your assigned trip, passengers and ticket information
                from your dashboard.
              </p>
            </div>

            <div className="conductor-welcome-icon">
              <i className="bi bi-person-workspace"></i>
            </div>
          </section>

          {loading && <p>Loading your dashboard...</p>}

          {!loading && error && (
            <div className="conductor-notice">
              <div className="conductor-notice-icon">
                <i className="bi bi-exclamation-circle-fill"></i>
              </div>
              <div>
                <strong>Dashboard unavailable</strong>
                <p>{error}</p>
              </div>
            </div>
          )}

          {!loading && !error && dashboard && (
            <>
              {/* STATS */}
              <section className="conductor-stats">
                <div className="conductor-stat-card">
                  <div className="conductor-stat-icon blue">
                    <i className="bi bi-bus-front-fill"></i>
                  </div>
                  <div>
                    <span>Today's Bus</span>
                    <h3>{busRegistration}</h3>
                    <small>{dashboard.busName || "Assigned bus"}</small>
                  </div>
                </div>

                <div className="conductor-stat-card">
                  <div className="conductor-stat-icon green">
                    <i className="bi bi-people-fill"></i>
                  </div>
                  <div>
                    <span>Passengers</span>
                    <h3>
                      {totalPassengers} / {busCapacity}
                    </h3>
                    <small>Current bookings</small>
                  </div>
                </div>

                <div className="conductor-stat-card">
                  <div className="conductor-stat-icon orange">
                    <i className="bi bi-ticket-perforated-fill"></i>
                  </div>
                  <div>
                    <span>Tickets Checked</span>
                    <h3>0</h3>
                    <small>Checking data not connected yet</small>
                  </div>
                </div>

                <div className="conductor-stat-card">
                  <div className="conductor-stat-icon purple">
                    <i className="bi bi-clock-fill"></i>
                  </div>
                  <div>
                    <span>Departure</span>
                    <h3>{departureTime}</h3>
                    <small>Assigned schedule</small>
                  </div>
                </div>
              </section>

              {/* DASHBOARD GRID */}
              <div className="conductor-dashboard-grid">
                {/* TODAY'S TRIP */}
                <section className="conductor-card conductor-trip-card">
                  <div className="conductor-card-header">
                    <div>
                      <h2>Today's Trip</h2>
                      <p>Your assigned trip</p>
                    </div>

                    <span className="conductor-status">
                      <span></span>
                      Assigned
                    </span>
                  </div>

                  <div className="conductor-route">
                    <div className="conductor-route-point">
                      <div className="conductor-route-dot"></div>
                      <div>
                        <strong>
                          {dashboard.routeName || "Route not assigned"}
                        </strong>
                        <span>{departureTime}</span>
                      </div>
                    </div>

                    <div className="conductor-route-line"></div>

                    <div className="conductor-route-point">
                      <div className="conductor-route-dot destination"></div>
                      <div>
                        <strong>Destination</strong>
                        <span>{arrivalTime}</span>
                      </div>
                    </div>
                  </div>

                  <div className="conductor-trip-details">
                    <div>
                      <i className="bi bi-bus-front"></i>
                      <span>Bus</span>
                      <strong>{busRegistration}</strong>
                    </div>

                    <div>
                      <i className="bi bi-person-badge"></i>
                      <span>Driver</span>
                      <strong>{dashboard.driverName || "Not assigned"}</strong>
                    </div>

                    <div>
                      <i className="bi bi-people"></i>
                      <span>Passengers</span>
                      <strong>
                        {totalPassengers} / {busCapacity}
                      </strong>
                    </div>
                  </div>

                  <button
                    className="conductor-primary-btn"
                    onClick={() => navigate("/conductor-my-trip")}
                  >
                    View My Trip
                    <i className="bi bi-arrow-right"></i>
                  </button>
                </section>

                {/* QUICK ACTIONS */}
                <section className="conductor-card">
                  <div className="conductor-card-header">
                    <div>
                      <h2>Quick Actions</h2>
                      <p>Common conductor tasks</p>
                    </div>
                  </div>

                  <div className="conductor-quick-actions">
                    <button onClick={() => navigate("/conductor-passengers")}>
                      <div className="quick-action-icon blue">
                        <i className="bi bi-people-fill"></i>
                      </div>
                      <div>
                        <strong>View Passengers</strong>
                        <span>Check today's passenger list</span>
                      </div>
                      <i className="bi bi-chevron-right"></i>
                    </button>

                    <button onClick={() => navigate("/conductor-tickets")}>
                      <div className="quick-action-icon green">
                        <i className="bi bi-ticket-perforated-fill"></i>
                      </div>
                      <div>
                        <strong>Check Tickets</strong>
                        <span>Verify passenger tickets</span>
                      </div>
                      <i className="bi bi-chevron-right"></i>
                    </button>

                    <button onClick={() => navigate("/conductor-track-bus")}>
                      <div className="quick-action-icon orange">
                        <i className="bi bi-geo-alt-fill"></i>
                      </div>
                      <div>
                        <strong>Track Bus</strong>
                        <span>View current bus location</span>
                      </div>
                      <i className="bi bi-chevron-right"></i>
                    </button>
                  </div>
                </section>
              </div>

              {/* PASSENGER BOARDING */}
              <section className="conductor-card conductor-boarding-card">
                <div className="conductor-card-header">
                  <div>
                    <h2>Passenger Boarding</h2>
                    <p>Passenger count for your assigned schedule</p>
                  </div>

                  <button
                    className="conductor-view-btn"
                    onClick={() => navigate("/conductor-passengers")}
                  >
                    View All
                    <i className="bi bi-arrow-right"></i>
                  </button>
                </div>

                <div className="conductor-boarding-progress">
                  <div className="boarding-progress-header">
                    <span>Tickets Checked</span>
                    <strong>0 / {totalPassengers}</strong>
                  </div>

                  <div className="boarding-progress-bar">
                    <div
                      className="boarding-progress-fill"
                      style={{ width: "0%" }}
                    ></div>
                  </div>

                  <div className="boarding-progress-labels">
                    <span>0</span>
                    <span>0% checked</span>
                    <span>{totalPassengers}</span>
                  </div>
                </div>

                <div className="conductor-boarding-stats">
                  <div>
                    <i className="bi bi-check-circle-fill"></i>
                    <div>
                      <strong>0</strong>
                      <span>Checked</span>
                    </div>
                  </div>

                  <div>
                    <i className="bi bi-clock-fill"></i>
                    <div>
                      <strong>{totalPassengers}</strong>
                      <span>Not yet checked</span>
                    </div>
                  </div>

                  <div>
                    <i className="bi bi-person-plus-fill"></i>
                    <div>
                      <strong>{totalPassengers}</strong>
                      <span>Total Passengers</span>
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* NOTICE */}
          <section className="conductor-notice">
            <div className="conductor-notice-icon">
              <i className="bi bi-info-circle-fill"></i>
            </div>

            <div>
              <strong>Conductor Responsibilities</strong>
              <p>
                Please verify passenger tickets before boarding, assist
                passengers with their seats and report any issues during the
                trip.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default ConductorDashboard;