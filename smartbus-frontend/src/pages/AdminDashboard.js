import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const [totalBookings, setTotalBookings] = useState(0);
  const [activeBuses, setActiveBuses] = useState(0);
  const [totalPassengers, setTotalPassengers] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  const [loadingStats, setLoadingStats] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("smartBusUser");
    localStorage.removeItem("token");
    navigate("/login");
  };

  // ================================
  // LOAD DASHBOARD STATISTICS
  // ================================

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoadingStats(false);
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const loadDashboardStats = async () => {
      try {
        const [
          bookingsResponse,
          busesResponse,
          passengersResponse,
        ] = await Promise.all([
          fetch("http://localhost:8080/api/bookings", {
            headers,
          }),

          fetch("http://localhost:8080/api/buses", {
            headers,
          }),

          fetch("http://localhost:8080/api/passengers", {
            headers,
          }),
        ]);

        // ----------------------------
        // BOOKINGS
        // ----------------------------

        if (bookingsResponse.ok) {
          const bookingsData = await bookingsResponse.json();

          const bookings = Array.isArray(bookingsData)
            ? bookingsData
            : [];

          setTotalBookings(bookings.length);

          // Calculate total revenue
          const revenue = bookings.reduce((total, booking) => {
            const status = String(
              booking.status || ""
            ).toUpperCase();

            // Don't include cancelled bookings
            if (
              status === "CANCELLED" ||
              status === "CANCELED"
            ) {
              return total;
            }

            const price = Number(
              booking.totalPrice ||
              booking.price ||
              booking.amount ||
              0
            );

            return total + price;
          }, 0);

          setTotalRevenue(revenue);
        }

        // ----------------------------
        // BUSES
        // ----------------------------

        if (busesResponse.ok) {
          const busesData = await busesResponse.json();

          const buses = Array.isArray(busesData)
            ? busesData
            : [];

          // Count only active buses
          const activeBusCount = buses.filter((bus) => {
            return (
              String(bus.status || "").toUpperCase() ===
              "ACTIVE"
            );
          }).length;

          setActiveBuses(activeBusCount);
        }

        // ----------------------------
        // PASSENGERS
        // ----------------------------

        if (passengersResponse.ok) {
          const passengersData =
            await passengersResponse.json();

          const passengers = Array.isArray(passengersData)
            ? passengersData
            : [];

          setTotalPassengers(passengers.length);
        }
      } catch (error) {
        console.error(
          "Error loading dashboard statistics:",
          error
        );
      } finally {
        setLoadingStats(false);
      }
    };

    loadDashboardStats();
  }, []);

  // ================================
  // FORMAT REVENUE
  // ================================

  const formatRevenue = (amount) => {
    if (amount >= 1000000) {
      return `Rs. ${(amount / 1000000).toFixed(1)}M`;
    }

    if (amount >= 1000) {
      return `Rs. ${(amount / 1000).toFixed(1)}K`;
    }

    return `Rs. ${amount.toLocaleString()}`;
  };

  // ================================
  // CURRENT MONTH
  // ================================

  const currentMonth = new Date().toLocaleDateString(
    "en-US",
    {
      month: "long",
      year: "numeric",
    }
  );

  return (
    <div className="admin-dashboard">

      {/* ================= SIDEBAR ================= */}

      <aside className="admin-sidebar">

        <div className="admin-logo">

          <div className="admin-logo-icon">
            <i className="bi bi-bus-front-fill"></i>
          </div>

          <div>
            <h2>SmartBus</h2>
            <span>Admin Panel</span>
          </div>

        </div>

        <nav className="admin-navigation">

          <p className="nav-title">
            MAIN MENU
          </p>

          {/* Dashboard */}
          <button
            className="admin-nav-item active"
            onClick={() =>
              navigate("/admin-dashboard")
            }
          >
            <i className="bi bi-grid-1x2-fill"></i>
            <span>Dashboard</span>
          </button>

          {/* Buses */}
          <button
            className="admin-nav-item"
            onClick={() =>
              navigate("/manage-buses")
            }
          >
            <i className="bi bi-bus-front"></i>
            <span>Buses</span>
          </button>

          {/* Routes */}
          <button
            className="admin-nav-item"
            onClick={() =>
              navigate("/manage-routes")
            }
          >
            <i className="bi bi-signpost-2"></i>
            <span>Routes</span>
          </button>

          {/* Schedules */}
          <button
            className="admin-nav-item"
            onClick={() =>
              navigate("/manage-schedules")
            }
          >
            <i className="bi bi-calendar3"></i>
            <span>Schedules</span>
          </button>

          {/* Bookings */}
          <button
            className="admin-nav-item"
            onClick={() =>
              navigate("/manage-bookings")
            }
          >
            <i className="bi bi-ticket-perforated"></i>
            <span>Bookings</span>
          </button>

          <p className="nav-title second-title">
            MANAGEMENT
          </p>

          {/* Reports */}
          <button
            className="admin-nav-item"
            onClick={() =>
              navigate("/admin-reports")
            }
          >
            <i className="bi bi-bar-chart-line"></i>
            <span>Reports</span>
          </button>

          {/* Passengers */}
          <button
            className="admin-nav-item"
            onClick={() =>
              navigate("/manage-passengers")
            }
          >
            <i className="bi bi-people"></i>
            <span>Passengers</span>
          </button>

          {/* Staff */}
          <button
            className="admin-nav-item"
            onClick={() =>
              navigate("/manage-staff")
            }
          >
            <i className="bi bi-person-badge"></i>
            <span>Staff</span>
          </button>

        </nav>

        {/* Sidebar Bottom */}

        <div className="sidebar-bottom">

          <button
            className="view-website-btn"
            onClick={() => navigate("/")}
          >
            <i className="bi bi-globe2"></i>
            <span>View Website</span>
          </button>

          <button
            className="admin-logout-btn"
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-right"></i>
            <span>Logout</span>
          </button>

        </div>

      </aside>


      {/* ================= MAIN ================= */}

      <main className="admin-main">

        {/* TOP BAR */}

        <header className="admin-topbar">

          <div className="topbar-left">

            <button
              className="mobile-menu-btn"
              onClick={() => {
                const sidebar =
                  document.querySelector(
                    ".admin-sidebar"
                  );

                sidebar?.classList.toggle("show");
              }}
            >
              <i className="bi bi-list"></i>
            </button>

            <div>
              <h1>Dashboard</h1>

              <p>
                Manage your SmartBus reservation system
              </p>
            </div>

          </div>


          <div className="admin-user">

            <div className="admin-user-icon">
              <i className="bi bi-person-fill"></i>
            </div>

            <div className="admin-user-info">
              <strong>Administrator</strong>
              <span>Admin</span>
            </div>

          </div>

        </header>


        {/* CONTENT */}

        <section className="admin-content">

          {/* ================= WELCOME ================= */}

          <div className="admin-welcome">

            <div>

              <h2>
                Welcome back, Admin! 👋
              </h2>

              <p>
                Here's what's happening with your
                SmartBus system today.
              </p>

            </div>

            <div className="welcome-date">

              <i className="bi bi-calendar3"></i>

              <span>
                {currentMonth}
              </span>

            </div>

          </div>


          {/* ================= STATS ================= */}

          <div className="admin-stats-grid">

            {/* Total Bookings */}

            <div className="admin-stat-card">

              <div className="stat-icon bookings-icon">
                <i className="bi bi-ticket-perforated-fill"></i>
              </div>

              <div className="stat-info">

                <span>
                  Total Bookings
                </span>

                <h3>
                  {loadingStats
                    ? "..."
                    : totalBookings}
                </h3>

                <small>
                  <i className="bi bi-database-check"></i>{" "}
                  From booking records
                </small>

              </div>

            </div>


            {/* Active Buses */}

            <div className="admin-stat-card">

              <div className="stat-icon buses-icon">
                <i className="bi bi-bus-front-fill"></i>
              </div>

              <div className="stat-info">

                <span>
                  Active Buses
                </span>

                <h3>
                  {loadingStats
                    ? "..."
                    : activeBuses}
                </h3>

                <small>
                  <i className="bi bi-check-circle"></i>{" "}
                  Currently active
                </small>

              </div>

            </div>


            {/* Total Passengers */}

            <div className="admin-stat-card">

              <div className="stat-icon passengers-icon">
                <i className="bi bi-people-fill"></i>
              </div>

              <div className="stat-info">

                <span>
                  Total Passengers
                </span>

                <h3>
                  {loadingStats
                    ? "..."
                    : totalPassengers}
                </h3>

                <small>
                  <i className="bi bi-people"></i>{" "}
                  Registered passengers
                </small>

              </div>

            </div>


            {/* Total Revenue */}

            <div className="admin-stat-card">

              <div className="stat-icon revenue-icon">
                <i className="bi bi-cash-stack"></i>
              </div>

              <div className="stat-info">

                <span>
                  Total Revenue
                </span>

                <h3>
                  {loadingStats
                    ? "..."
                    : formatRevenue(totalRevenue)}
                </h3>

                <small>
                  <i className="bi bi-calculator"></i>{" "}
                  From confirmed bookings
                </small>

              </div>

            </div>

          </div>


          {/* ================= QUICK MANAGEMENT ================= */}

          <div className="admin-section">

            <div className="section-heading">

              <div>

                <h2>
                  Quick Management
                </h2>

                <p>
                  Manage important parts of your bus
                  reservation system.
                </p>

              </div>

            </div>


            <div className="management-grid">

              {/* Buses */}

              <button
                className="management-card"
                onClick={() =>
                  navigate("/manage-buses")
                }
              >

                <div className="management-icon">
                  <i className="bi bi-bus-front-fill"></i>
                </div>

                <div className="management-content">

                  <h3>
                    Manage Buses
                  </h3>

                  <p>
                    Add, edit and manage buses.
                  </p>

                </div>

                <i className="bi bi-chevron-right management-arrow"></i>

              </button>


              {/* Routes */}

              <button
                className="management-card"
                onClick={() =>
                  navigate("/manage-routes")
                }
              >

                <div className="management-icon">
                  <i className="bi bi-signpost-2-fill"></i>
                </div>

                <div className="management-content">

                  <h3>
                    Manage Routes
                  </h3>

                  <p>
                    Create and manage bus routes.
                  </p>

                </div>

                <i className="bi bi-chevron-right management-arrow"></i>

              </button>


              {/* Schedules */}

              <button
                className="management-card"
                onClick={() =>
                  navigate("/manage-schedules")
                }
              >

                <div className="management-icon">
                  <i className="bi bi-calendar-check-fill"></i>
                </div>

                <div className="management-content">

                  <h3>
                    Manage Schedules
                  </h3>

                  <p>
                    Manage bus departure schedules.
                  </p>

                </div>

                <i className="bi bi-chevron-right management-arrow"></i>

              </button>


              {/* Bookings */}

              <button
                className="management-card"
                onClick={() =>
                  navigate("/manage-bookings")
                }
              >

                <div className="management-icon">
                  <i className="bi bi-ticket-detailed-fill"></i>
                </div>

                <div className="management-content">

                  <h3>
                    Manage Bookings
                  </h3>

                  <p>
                    View and manage passenger bookings.
                  </p>

                </div>

                <i className="bi bi-chevron-right management-arrow"></i>

              </button>

            </div>

          </div>


          {/* ================= RECENT BOOKINGS ================= */}

          <div className="admin-section">

            <div className="section-heading">

              <div>

                <h2>
                  Recent Bookings
                </h2>

                <p>
                  Latest passenger booking activities.
                </p>

              </div>

              <button
                className="view-all-btn"
                onClick={() =>
                  navigate("/manage-bookings")
                }
              >
                View All
                <i className="bi bi-arrow-right"></i>
              </button>

            </div>

            <div className="booking-table-wrapper">

              <table className="booking-table">

                <thead>

                  <tr>
                    <th>Booking ID</th>
                    <th>Passenger</th>
                    <th>Route</th>
                    <th>Date</th>
                    <th>Seat</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>

                </thead>

                <tbody>

                  <tr>
                    <td colSpan="7">
                      <div
                        style={{
                          textAlign: "center",
                          padding: "30px",
                          color: "#7b8a98"
                        }}
                      >
                        Recent bookings will be connected
                        in the next step.
                      </div>
                    </td>
                  </tr>

                </tbody>

              </table>

            </div>

          </div>


          {/* ================= SYSTEM STATUS ================= */}

          <div className="admin-section">

            <div className="section-heading">

              <div>

                <h2>
                  System Status
                </h2>

                <p>
                  Current status of your SmartBus system.
                </p>

              </div>

            </div>


            <div className="system-status-grid">

              {/* System */}

              <div className="system-status-card">

                <div className="system-status-icon online">
                  <i className="bi bi-server"></i>
                </div>

                <div>

                  <h3>
                    System
                  </h3>

                  <p>
                    All systems operational
                  </p>

                </div>

                <span className="status-dot"></span>

              </div>


              {/* Database */}

              <div className="system-status-card">

                <div className="system-status-icon online">
                  <i className="bi bi-database-check"></i>
                </div>

                <div>

                  <h3>
                    Database
                  </h3>

                  <p>
                    Connected and running
                  </p>

                </div>

                <span className="status-dot"></span>

              </div>


              {/* Payment */}

              <div className="system-status-card">

                <div className="system-status-icon online">
                  <i className="bi bi-credit-card"></i>
                </div>

                <div>

                  <h3>
                    Payment Service
                  </h3>

                  <p>
                    Service available
                  </p>

                </div>

                <span className="status-dot"></span>

              </div>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default AdminDashboard;