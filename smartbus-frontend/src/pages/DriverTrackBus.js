import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/DriverTrackBus.css";

function DriverTrackBus() {
  const navigate = useNavigate();

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const [speed] = useState(58);
  const [passengers] = useState(38);
  const [distance] = useState(68);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView([7.115, 80.23], 9);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    const routePositions = [
      [6.9271, 79.8612],
      [7.02, 79.95],
      [7.115, 80.23],
      [7.2, 80.4],
      [7.2906, 80.6337],
    ];

    L.polyline(routePositions, {
      color: "#2563eb",
      weight: 5,
    }).addTo(map);

    L.marker([6.9271, 79.8612])
      .addTo(map)
      .bindPopup("<b>Colombo</b><br>Starting Point");

    L.marker([7.2906, 80.6337])
      .addTo(map)
      .bindPopup("<b>Kandy</b><br>Destination");

    const busIcon = L.divIcon({
      className: "driver-bus-marker",
      html: '<i class="bi bi-bus-front-fill"></i>',
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    L.marker([7.115, 80.23], { icon: busIcon })
      .addTo(map)
      .bindPopup("<b>SB-102</b><br>Current Bus Location")
      .openPopup();

    mapInstanceRef.current = map;

    setTimeout(() => {
      map.invalidateSize();
    }, 300);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("smartBusUser");
    navigate("/login");
  };

  return (
    <div className="driver-track-page">
      <aside className="driver-track-sidebar">
        <div className="driver-track-logo">
          <div className="driver-track-logo-icon">
            <i className="bi bi-bus-front-fill"></i>
          </div>

          <div>
            <h2>SmartBus</h2>
            <span>Driver Portal</span>
          </div>
        </div>

        <nav className="driver-track-navigation">
          <p className="driver-track-nav-title">MAIN MENU</p>

          <button
            className="driver-track-nav-item"
            onClick={() => navigate("/driver-dashboard")}
          >
            <i className="bi bi-grid-1x2-fill"></i>
            Dashboard
          </button>

          <button
            className="driver-track-nav-item"
            onClick={() => navigate("/driver-my-trip")}
          >
            <i className="bi bi-signpost-2-fill"></i>
            My Trip
          </button>

          <button
            className="driver-track-nav-item"
            onClick={() => navigate("/driver-passengers")}
          >
            <i className="bi bi-people-fill"></i>
            Passengers
          </button>

          <button className="driver-track-nav-item active">
            <i className="bi bi-geo-alt-fill"></i>
            Track Bus
          </button>
        </nav>

        <div className="driver-track-sidebar-bottom">
          <button
            className="driver-track-bottom-link"
            onClick={() => navigate("/profile")}
          >
            <i className="bi bi-person-circle"></i>
            Profile
          </button>

          <button
            className="driver-track-bottom-link"
            onClick={() => navigate("/")}
          >
            <i className="bi bi-globe2"></i>
            View Website
          </button>

          <button className="driver-track-logout-btn" onClick={logout}>
            <i className="bi bi-box-arrow-right"></i>
            Logout
          </button>
        </div>
      </aside>

      <main className="driver-track-main">
        <header className="driver-track-topbar">
          <div>
            <span className="driver-track-page-label">
              DRIVER PORTAL
            </span>
            <h1>Track Bus</h1>
          </div>

          <div className="driver-track-user">
            <div>
              <strong>Driver</strong>
              <span>Bus Driver</span>
            </div>

            <i className="bi bi-person-circle"></i>
          </div>
        </header>

        <section className="driver-track-content">
          <div className="driver-track-route-header">
            <div>
              <span>LIVE TRIP</span>
              <h2>Colombo → Kandy</h2>
              <p>Bus SB-102</p>
            </div>

            <div className="driver-live-badge">
              <i className="bi bi-circle-fill"></i>
              Live
            </div>
          </div>

          <div className="driver-track-map-card">
            <div
              ref={mapRef}
              className="driver-leaflet-map"
            ></div>
          </div>

          <div className="driver-track-info-grid">
            <div className="driver-track-info-card">
              <i className="bi bi-speedometer2"></i>
              <div>
                <span>Current Speed</span>
                <strong>{speed} km/h</strong>
              </div>
            </div>

            <div className="driver-track-info-card">
              <i className="bi bi-people-fill"></i>
              <div>
                <span>Passengers</span>
                <strong>{passengers} / 52</strong>
              </div>
            </div>

            <div className="driver-track-info-card">
              <i className="bi bi-signpost-2-fill"></i>
              <div>
                <span>Remaining</span>
                <strong>{distance} km</strong>
              </div>
            </div>
          </div>

          <div className="driver-track-progress-card">
            <div className="driver-track-progress-header">
              <div>
                <h3>Trip Progress</h3>
                <p>Colombo to Kandy</p>
              </div>

              <strong>41%</strong>
            </div>

            <div className="driver-track-progress">
              <div
                className="driver-track-progress-fill"
                style={{ width: "41%" }}
              ></div>
            </div>

            <div className="driver-track-progress-labels">
              <span>Colombo</span>
              <span>Kandy</span>
            </div>
          </div>

          <div className="driver-track-notice">
            <i className="bi bi-info-circle-fill"></i>
            <div>
              <strong>GPS Tracking</strong>
              <p>
                The bus location shown on the map is currently simulated
                for the SmartBus project demonstration.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default DriverTrackBus;