import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/TrackBus.css";

const TrackBus = () => {
  const navigate = useNavigate();
  const mapRef = useRef(null);

  const colombo = [6.9271, 79.8612];
  const kandy = [7.2906, 80.6337];
  const currentBusLocation = [7.145, 80.365];

  useEffect(() => {
    if (!mapRef.current) return;

    const map = L.map(mapRef.current).setView(currentBusLocation, 9);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    const route = [
      colombo,
      [6.98, 79.95],
      [7.08, 80.15],
      currentBusLocation,
      [7.22, 80.48],
      kandy,
    ];

    L.polyline(route, {
      weight: 5,
    }).addTo(map);

    L.marker(colombo)
      .addTo(map)
      .bindPopup("<b>Colombo</b><br>Starting Point");

    L.marker(currentBusLocation)
      .addTo(map)
      .bindPopup("<b>🚌 SmartBus</b><br>Current Bus Location")
      .openPopup();

    L.marker(kandy)
      .addTo(map)
      .bindPopup("<b>Kandy</b><br>Destination");

    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div className="track-page">
      <section className="track-header">
        <div>
          <span className="track-label">LIVE BUS TRACKING</span>
          <h1>Track Your Bus</h1>
          <p>
            Follow your SmartBus journey from Colombo to Kandy.
          </p>
        </div>

        <button
          className="back-dashboard-btn"
          onClick={() => navigate("/passenger-dashboard")}
        >
          <i className="bi bi-arrow-left"></i>
          Dashboard
        </button>
      </section>

      <section className="track-content">

        <div className="trip-status-card">
          <div className="status-left">
            <div className="bus-icon">
              <i className="bi bi-bus-front-fill"></i>
            </div>

            <div>
              <h2>SmartBus Express</h2>
              <p>Colombo → Kandy</p>
            </div>
          </div>

          <div className="status-badge">
            <span></span>
            On the way
          </div>
        </div>

        <div className="tracking-info-grid">

          <div className="tracking-info-card">
            <i className="bi bi-geo-alt-fill"></i>
            <div>
              <span>Current Location</span>
              <strong>Near Kadawatha</strong>
            </div>
          </div>

          <div className="tracking-info-card">
            <i className="bi bi-clock-fill"></i>
            <div>
              <span>Estimated Arrival</span>
              <strong>11:30 AM</strong>
            </div>
          </div>

          <div className="tracking-info-card">
            <i className="bi bi-signpost-2-fill"></i>
            <div>
              <span>Destination</span>
              <strong>Kandy</strong>
            </div>
          </div>

        </div>

        <div className="map-card">

          <div className="map-card-header">
            <div>
              <h2>
                <i className="bi bi-map"></i>
                Live Route
              </h2>
              <p>Current sample location of your bus</p>
            </div>

            <div className="live-indicator">
              <span></span>
              LIVE
            </div>
          </div>

          <div className="map-container">
            <div
              ref={mapRef}
              className="bus-map"
            ></div>
          </div>

        </div>

        <div className="tracking-notice">
          <i className="bi bi-info-circle-fill"></i>

          <div>
            <strong>Tracking Information</strong>
            <p>
              The current bus location shown on this map is a sample
              location for the project demonstration. In the final system,
              the location will be updated using the driver's GPS location.
            </p>
          </div>
        </div>

        <div className="track-actions">

          <button
            className="secondary-track-btn"
            onClick={() => navigate("/my-bookings")}
          >
            <i className="bi bi-ticket-perforated"></i>
            My Bookings
          </button>

          <button
            className="primary-track-btn"
            onClick={() => navigate("/passenger-dashboard")}
          >
            <i className="bi bi-grid"></i>
            Back to Dashboard
          </button>

        </div>

      </section>
    </div>
  );
};

export default TrackBus;