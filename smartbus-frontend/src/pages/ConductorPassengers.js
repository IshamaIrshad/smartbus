import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ConductorPassengers.css";

const API_URL = "http://localhost:8080/api/conductor/passengers";

function ConductorPassengers() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [passengers, setPassengers] = useState([]);
  const [conductorName, setConductorName] = useState("Conductor");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("smartBusUser");

    if (!token) {
      navigate("/login");
      return;
    }

    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setConductorName(user.name || user.fullName || "Conductor");
      } catch {
        setConductorName("Conductor");
      }
    }

    const fetchPassengers = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("token");
          localStorage.removeItem("smartBusUser");
          navigate("/login");
          return;
        }

        if (!response.ok) {
          throw new Error("Unable to load passengers. Please try again.");
        }

        const data = await response.json();

        setPassengers(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(
          err.message || "Unable to connect to the server. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPassengers();
  }, [navigate]);

  const filteredPassengers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return passengers;
    }

    return passengers.filter((passenger) => {
      const bookingId = String(passenger.bookingId ?? "");
      const name = passenger.passengerName ?? "";
      const seat = passenger.seatNumber ?? "";
      const pickup = passenger.pickupPoint ?? "";
      const destination = passenger.destination ?? "";
      const status = passenger.status ?? "";

      return [
        bookingId,
        name,
        seat,
        pickup,
        destination,
        status,
      ].some((value) => String(value).toLowerCase().includes(query));
    });
  }, [passengers, search]);

  const availableStatuses = (status) =>
    String(status || "").toLowerCase();

  const confirmedCount = passengers.filter((passenger) =>
    ["confirmed", "booked", "paid"].includes(
      availableStatuses(passenger.status)
    )
  ).length;

  const cancelledCount = passengers.filter(
    (passenger) => availableStatuses(passenger.status) === "cancelled"
  ).length;

  const availableSeats = Math.max(
    0,
    (Number(passengers[0]?.busCapacity) || 0) - passengers.length
  );

  const getInitials = (name) =>
    String(name || "P")
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("smartBusUser");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="conductor-passengers-page">
      <aside className="conductor-passengers-sidebar">
        <div className="conductor-passengers-logo">
          <div>
            <i className="bi bi-bus-front-fill"></i>
          </div>

          <section>
            <h2>SmartBus</h2>
            <span>Conductor Portal</span>
          </section>
        </div>

        <nav className="conductor-passengers-navigation">
          <p>MAIN MENU</p>

          <button onClick={() => navigate("/conductor-dashboard")}>
            <i className="bi bi-grid-1x2-fill"></i>
            Dashboard
          </button>

          <button onClick={() => navigate("/conductor-my-trip")}>
            <i className="bi bi-signpost-2-fill"></i>
            My Trip
          </button>

          <button
            className="active"
            onClick={() => navigate("/conductor-passengers")}
          >
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

        <div className="conductor-passengers-sidebar-bottom">
          <button onClick={() => navigate("/")}>
            <i className="bi bi-globe2"></i>
            View Website
          </button>

          <button onClick={handleLogout}>
            <i className="bi bi-box-arrow-right"></i>
            Logout
          </button>
        </div>
      </aside>

      <main className="conductor-passengers-main">
        <header className="conductor-passengers-topbar">
          <div>
            <span>CONDUCTOR PORTAL</span>
            <h1>Passengers</h1>
          </div>

          <div className="conductor-passengers-user">
            <div>{getInitials(conductorName)}</div>
            <section>
              <strong>{conductorName}</strong>
              <small>Conductor</small>
            </section>
          </div>
        </header>

        <div className="conductor-passengers-content">
          <div className="conductor-passenger-summary">
            <div>
              <span>Total Passengers</span>
              <strong>{passengers.length}</strong>
            </div>

            <div>
              <span>Confirmed Bookings</span>
              <strong className="green">{confirmedCount}</strong>
            </div>

            <div>
              <span>Cancelled Bookings</span>
              <strong className="orange">{cancelledCount}</strong>
            </div>

            <div>
              <span>Available Seats</span>
              <strong className="blue">
                {passengers.length > 0 &&
                passengers[0]?.busCapacity != null
                  ? availableSeats
                  : "—"}
              </strong>
            </div>
          </div>

          <div className="conductor-passenger-toolbar">
            <div className="conductor-passenger-search">
              <i className="bi bi-search"></i>

              <input
                type="text"
                placeholder="Search passenger, booking or seat..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <button onClick={() => navigate("/conductor-tickets")}>
              <i className="bi bi-ticket-perforated"></i>
              Check Tickets
            </button>
          </div>

          <div className="conductor-passenger-table-card">
            <div className="conductor-passenger-table-header">
              <div>
                <h2>Passenger List</h2>
                <p>Bookings for your assigned trip</p>
              </div>

              <span>
                {filteredPassengers.length}{" "}
                {filteredPassengers.length === 1 ? "passenger" : "passengers"}
              </span>
            </div>

            <div className="conductor-passenger-table-wrapper">
              {loading ? (
                <div className="no-passengers">Loading passengers...</div>
              ) : error ? (
                <div className="no-passengers">{error}</div>
              ) : (
                <>
                  <table>
                    <thead>
                      <tr>
                        <th>Booking ID</th>
                        <th>Passenger</th>
                        <th>Seat</th>
                        <th>Destination</th>
                        <th>Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredPassengers.map((passenger) => (
                        <tr key={passenger.bookingId}>
                          <td>
                            <strong>
                              BK{String(passenger.bookingId).padStart(4, "0")}
                            </strong>
                          </td>

                          <td>
                            <div className="conductor-passenger-name">
                              <div>
                                {getInitials(passenger.passengerName)}
                              </div>

                              <span>{passenger.passengerName || "Unknown"}</span>
                            </div>
                          </td>

                          <td>
                            <strong>{passenger.seatNumber || "—"}</strong>
                          </td>

                          <td>{passenger.destination || "—"}</td>

                          <td>
                            <span
                              className={`passenger-status ${
                                availableStatuses(passenger.status) ===
                                  "cancelled"
                                  ? "pending"
                                  : "checked"
                              }`}
                            >
                              {passenger.status || "Unknown"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {filteredPassengers.length === 0 && (
                    <div className="no-passengers">
                      {passengers.length === 0
                        ? "No bookings found for your assigned trip."
                        : "No passengers found."}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ConductorPassengers;

