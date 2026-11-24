import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/DriverPassengers.css";

function DriverPassengers() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const passengers = [
    { id: "SB001", name: "Kamal Perera", seat: "A1", status: "Boarded" },
    { id: "SB002", name: "Nimal Silva", seat: "A2", status: "Boarded" },
    { id: "SB003", name: "Sarah Fernando", seat: "A3", status: "Pending" },
    { id: "SB004", name: "Amal Kumar", seat: "A4", status: "Boarded" },
    { id: "SB005", name: "Tharushi Perera", seat: "B1", status: "Pending" },
    { id: "SB006", name: "Dilan Jayasuriya", seat: "B2", status: "Boarded" },
    { id: "SB007", name: "Sahan Fernando", seat: "B3", status: "Pending" },
    { id: "SB008", name: "Nadeesha Silva", seat: "B4", status: "Boarded" },
  ];

  const filteredPassengers = passengers.filter((passenger) =>
    passenger.name.toLowerCase().includes(search.toLowerCase())
  );

  const logout = () => {
    localStorage.removeItem("smartBusUser");
    navigate("/login");
  };

  return (
    <div className="driver-passengers-page">
      <aside className="driver-passengers-sidebar">
        <div className="driver-passengers-logo">
          <div className="driver-passengers-logo-icon">
            <i className="bi bi-bus-front-fill"></i>
          </div>
          <div>
            <h2>SmartBus</h2>
            <span>Driver Portal</span>
          </div>
        </div>

        <nav className="driver-passengers-navigation">
          <p>MAIN MENU</p>

          <button onClick={() => navigate("/driver-dashboard")}>
            <i className="bi bi-grid-1x2-fill"></i>
            Dashboard
          </button>

          <button onClick={() => navigate("/driver-my-trip")}>
            <i className="bi bi-signpost-2-fill"></i>
            My Trip
          </button>

          <button className="active">
            <i className="bi bi-people-fill"></i>
            Passengers
          </button>

          <button onClick={() => navigate("/driver-track-bus")}>
            <i className="bi bi-geo-alt-fill"></i>
            Track Bus
          </button>
        </nav>

        <div className="driver-passengers-sidebar-bottom">
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

      <main className="driver-passengers-main">
        <header className="driver-passengers-topbar">
          <div>
            <span>DRIVER PORTAL</span>
            <h1>Passengers</h1>
          </div>

          <div className="driver-passengers-user">
            <div>
              <strong>Driver</strong>
              <span>Bus Driver</span>
            </div>
            <i className="bi bi-person-circle"></i>
          </div>
        </header>

        <section className="driver-passengers-content">
          <div className="passenger-summary">
            <div>
              <span>Today's Trip</span>
              <h2>Colombo → Kandy</h2>
              <p>Bus SB-102</p>
            </div>

            <div className="passenger-count">
              <strong>38</strong>
              <span>/ 52 passengers</span>
            </div>
          </div>

          <div className="passenger-toolbar">
            <div className="passenger-search">
              <i className="bi bi-search"></i>
              <input
                type="text"
                placeholder="Search passenger..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="passenger-table-card">
            <div className="passenger-table-header">
              <h3>Passenger List</h3>
              <span>{filteredPassengers.length} passengers</span>
            </div>

            <div className="passenger-table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Passenger</th>
                    <th>Seat</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredPassengers.map((passenger) => (
                    <tr key={passenger.id}>
                      <td>{passenger.id}</td>
                      <td>
                        <div className="passenger-name">
                          <div>
                            {passenger.name.charAt(0)}
                          </div>
                          <strong>{passenger.name}</strong>
                        </div>
                      </td>
                      <td>{passenger.seat}</td>
                      <td>
                        <span
                          className={`passenger-status ${
                            passenger.status === "Boarded"
                              ? "boarded"
                              : "pending"
                          }`}
                        >
                          {passenger.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <button
            className="passenger-track-btn"
            onClick={() => navigate("/driver-track-bus")}
          >
            <i className="bi bi-geo-alt-fill"></i>
            Track Bus
          </button>
        </section>
      </main>
    </div>
  );
}

export default DriverPassengers;