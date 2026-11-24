
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ConductorTickets.css";

const API_URL = "http://localhost:8080/api/conductor/tickets";

function ConductorTickets() {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [verifyingId, setVerifyingId] = useState(null);

  const loadTickets = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401 || response.status === 403) {
        setError(
          response.status === 401
            ? "Your session has expired. Please log in again."
            : "You do not have permission to access conductor tickets."
        );
        return;
      }

      if (!response.ok) {
        throw new Error("Unable to load tickets.");
      }

      const data = await response.json();
      setTickets(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  const checkTicket = async (ticketId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    setVerifyingId(ticketId);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/${ticketId}/verify`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.message ||
          result?.error ||
          "Ticket verification failed. Please refresh and try again."
        );
      }

      // Update the UI only after the backend confirms verification.
      setTickets((currentTickets) =>
        currentTickets.map((ticket) =>
          ticket.ticketId === ticketId
            ? { ...ticket, ...result }
            : ticket
        )
      );
    } catch (err) {
      setError(err.message || "Unable to verify this ticket.");
    } finally {
      setVerifyingId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("smartBusUser");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const checkedCount = tickets.filter(
    (ticket) =>
      ticket.ticketStatus?.toUpperCase() === "CHECKED"
  ).length;

  const pendingCount = tickets.filter(
    (ticket) =>
      ticket.ticketStatus?.toUpperCase() === "ACTIVE"
  ).length;

  const displayStatus = (status) => {
    if (!status) return "Unknown";

    return status.charAt(0).toUpperCase() +
      status.slice(1).toLowerCase();
  };

  return (
    <div className="conductor-tickets-page">
      <aside className="conductor-tickets-sidebar">
        <div className="conductor-tickets-logo">
          <div>
            <i className="bi bi-bus-front-fill"></i>
          </div>

          <section>
            <h2>SmartBus</h2>
            <span>Conductor Portal</span>
          </section>
        </div>

        <nav className="conductor-tickets-navigation">
          <p>MAIN MENU</p>

          <button onClick={() => navigate("/conductor-dashboard")}>
            <i className="bi bi-grid-1x2-fill"></i>
            Dashboard
          </button>

          <button onClick={() => navigate("/conductor-my-trip")}>
            <i className="bi bi-signpost-2-fill"></i>
            My Trip
          </button>

          <button onClick={() => navigate("/conductor-passengers")}>
            <i className="bi bi-people-fill"></i>
            Passengers
          </button>

          <button
            className="active"
            onClick={() => navigate("/conductor-tickets")}
          >
            <i className="bi bi-ticket-perforated-fill"></i>
            Tickets
          </button>

          <button onClick={() => navigate("/conductor-track-bus")}>
            <i className="bi bi-geo-alt-fill"></i>
            Track Bus
          </button>
        </nav>

        <div className="conductor-tickets-sidebar-bottom">
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

      <main className="conductor-tickets-main">
        <header className="conductor-tickets-topbar">
          <div>
            <span>CONDUCTOR PORTAL</span>
            <h1>Tickets</h1>
          </div>

          <div className="conductor-tickets-user">
            <div>CS</div>
            <section>
              <strong>Conductor</strong>
              <small>Conductor</small>
            </section>
          </div>
        </header>

        <div className="conductor-tickets-content">
          <div className="ticket-summary">
            <div>
              <i className="bi bi-ticket-perforated-fill"></i>
              <span>Total Tickets</span>
              <strong>{tickets.length}</strong>
            </div>

            <div>
              <i className="bi bi-check-circle-fill"></i>
              <span>Checked</span>
              <strong>{checkedCount}</strong>
            </div>

            <div>
              <i className="bi bi-clock-fill"></i>
              <span>Pending</span>
              <strong>{pendingCount}</strong>
            </div>
          </div>

          <div className="ticket-info">
            <i className="bi bi-info-circle-fill"></i>

            <div>
              <strong>Ticket Verification</strong>
              <p>
                Check the passenger's ticket before boarding.
                Once verified, mark the ticket as checked.
              </p>
            </div>
          </div>

          {error && (
            <div className="ticket-info" role="alert">
              <i className="bi bi-exclamation-circle-fill"></i>
              <div>
                <strong>Notice</strong>
                <p>{error}</p>
                <button type="button" onClick={loadTickets}>
                  Try Again
                </button>
              </div>
            </div>
          )}

          <div className="ticket-table-card">
            <div className="ticket-table-header">
              <div>
                <h2>Trip Tickets</h2>
                <p>Tickets for your assigned schedule</p>
              </div>
            </div>

            <div className="ticket-table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Passenger</th>
                    <th>Seat</th>
                    <th>Destination</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="6">Loading tickets...</td>
                    </tr>
                  ) : tickets.length === 0 ? (
                    <tr>
                      <td colSpan="6">
                        No tickets found for your assigned trip.
                      </td>
                    </tr>
                  ) : (
                    tickets.map((ticket) => {
                      const isChecked =
                        ticket.ticketStatus?.toUpperCase() === "CHECKED";

                      const isActive =
                        ticket.ticketStatus?.toUpperCase() === "ACTIVE";

                      return (
                        <tr key={ticket.ticketId}>
                          <td>
                            <strong>{ticket.bookingId}</strong>
                          </td>

                          <td>{ticket.passengerName}</td>

                          <td>
                            <strong>{ticket.seatNumber}</strong>
                          </td>

                          <td>{ticket.destination}</td>

                          <td>
                            <span
                              className={
                                isChecked
                                  ? "ticket-status checked"
                                  : "ticket-status pending"
                              }
                            >
                              <i
                                className={
                                  isChecked
                                    ? "bi bi-check-circle-fill"
                                    : "bi bi-clock-fill"
                                }
                              ></i>
                              {displayStatus(ticket.ticketStatus)}
                            </span>
                          </td>

                          <td>
                            {isChecked ? (
                              <span className="verified-text">
                                <i className="bi bi-check-circle-fill"></i>
                                Verified
                              </span>
                            ) : isActive ? (
                              <button
                                className="check-ticket-btn"
                                disabled={verifyingId === ticket.ticketId}
                                onClick={() => checkTicket(ticket.ticketId)}
                              >
                                <i className="bi bi-check-lg"></i>
                                {verifyingId === ticket.ticketId
                                  ? "Checking..."
                                  : "Check Ticket"}
                              </button>
                            ) : (
                              <span>{displayStatus(ticket.ticketStatus)}</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ConductorTickets;