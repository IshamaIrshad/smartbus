
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/ConductorTrackBus.css";

const API_URL = "http://localhost:8080/api/conductor/dashboard";

function ConductorTrackBus() {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load the conductor's assigned trip from the backend.
  const loadTrip = useCallback(async () => {
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

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("smartBusUser");
        navigate("/login");
        return;
      }

      if (response.status === 403) {
        throw new Error(
          "You do not have permission to access conductor trip details."
        );
      }

      if (!response.ok) {
        throw new Error("Unable to load your assigned trip.");
      }

      const data = await response.json();
      setTrip(data);
    } catch (err) {
      setError(err.message || "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadTrip();
  }, [loadTrip]);

  // Initialize the illustrative map once.
  // This map does not display a real GPS location.
  useEffect(() => {
    const container = mapRef.current;

    if (!container || mapInstance.current) {
      return;
    }

    const map = L.map(container, {
      zoomControl: true,
    }).setView([7.115, 80.23], 9);

    mapInstance.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    const exampleRoute = [
      [6.9271, 79.8612],
      [7.115, 80.23],
      [7.2906, 80.6337],
    ];

    L.polyline(exampleRoute, {
      color: "#1769d1",
      weight: 5,
      dashArray: "8, 8",
    }).addTo(map);

    L.marker([6.9271, 79.8612])
      .addTo(map)
      .bindPopup("<strong>Colombo</strong><br/>Example starting point");

    L.marker([7.2906, 80.6337])
      .addTo(map)
      .bindPopup("<strong>Kandy</strong><br/>Example destination");

    let resizeFrame;

    const resizeMap = () => {
      if (mapInstance.current === map && mapRef.current === container) {
        map.invalidateSize({
          pan: false,
          animate: false,
        });
      }
    };

    resizeFrame = requestAnimationFrame(resizeMap);

    return () => {
      cancelAnimationFrame(resizeFrame);

      if (mapInstance.current === map) {
        mapInstance.current = null;
      }

      map.remove();
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("smartBusUser");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const getInitials = (name) => {
    if (!name) return "CO";

    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
  };

  const formatTime = (time) => {
    if (!time) return "Not available";

    const match = String(time).match(/^(\d{1,2}):(\d{2})/);

    if (!match) return time;

    const hours = Number(match[1]);
    const minutes = match[2];
    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;

    return `${displayHours}:${minutes} ${period}`;
  };

  const conductorName = trip?.conductorName || "Conductor";
  const routeName = trip?.routeName || "Assigned route";
  const busName = trip?.busName || "Bus details unavailable";
  const registrationNumber = trip?.registrationNumber || "Not available";
  const capacity = trip?.busCapacity;
  const passengers = trip?.totalPassengers;

  return (
    <div className="conductor-track-page">
      <aside className="conductor-track-sidebar">
        <div className="conductor-track-logo">
          <div>
            <i className="bi bi-bus-front-fill"></i>
          </div>

          <section>
            <h2>SmartBus</h2>
            <span>Conductor Portal</span>
          </section>
        </div>

        <nav className="conductor-track-navigation">
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

          <button onClick={() => navigate("/conductor-tickets")}>
            <i className="bi bi-ticket-perforated-fill"></i>
            Tickets
          </button>

          <button
            className="active"
            onClick={() => navigate("/conductor-track-bus")}
          >
            <i className="bi bi-geo-alt-fill"></i>
            Track Bus
          </button>
        </nav>

        <div className="conductor-track-sidebar-bottom">
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

      <main className="conductor-track-main">
        <header className="conductor-track-topbar">
          <div>
            <span>CONDUCTOR PORTAL</span>
            <h1>Track Bus</h1>
          </div>

          <div className="conductor-track-user">
            <div>{getInitials(conductorName)}</div>

            <section>
              <strong>{conductorName}</strong>
              <small>Conductor</small>
            </section>
          </div>
        </header>

        <div className="conductor-track-content">
          {error && (
            <div className="conductor-track-notice" role="alert">
              <i className="bi bi-exclamation-circle-fill"></i>

              <div>
                <strong>Unable to load trip</strong>
                <p>{error}</p>

                <button type="button" onClick={loadTrip}>
                  Try Again
                </button>
              </div>
            </div>
          )}

          <div className="conductor-track-route-header">
            <div>
              <span>ASSIGNED TRIP</span>
              <h2>{loading ? "Loading trip..." : routeName}</h2>

              {!loading && trip && (
                <p>
                  {busName} · {registrationNumber}
                </p>
              )}
            </div>

            <div className="conductor-live-badge">
              <span></span>
              GPS NOT CONNECTED
            </div>
          </div>

          <div className="conductor-track-map-card">
            <div
              ref={mapRef}
              className="conductor-leaflet-map"
            ></div>
          </div>

          <p>
            <i className="bi bi-info-circle"></i>{" "}
            Illustrative Colombo–Kandy map only. The route does not represent
            your assigned trip or a live GPS position.
          </p>

          <div className="conductor-track-info-grid">
            <div>
              <i className="bi bi-bus-front-fill"></i>
              <span>Assigned Bus</span>
              <strong>{loading ? "Loading..." : busName}</strong>
              <small>{registrationNumber}</small>
            </div>

            <div>
              <i className="bi bi-people-fill"></i>
              <span>Seats Used (Estimate)</span>
              <strong>
                {loading
                  ? "Loading..."
                  : passengers != null && capacity != null
                    ? `${passengers} / ${capacity}`
                    : "Not available"}
              </strong>
            </div>

            <div>
              <i className="bi bi-clock-fill"></i>
              <span>Departure Time</span>
              <strong>
                {loading
                  ? "Loading..."
                  : formatTime(trip?.departureTime)}
              </strong>
            </div>

            <div>
              <i className="bi bi-flag-fill"></i>
              <span>Arrival Time</span>
              <strong>
                {loading
                  ? "Loading..."
                  : formatTime(trip?.arrivalTime)}
              </strong>
            </div>
          </div>

          <div className="conductor-track-progress-card">
            <div className="conductor-track-progress-header">
              <div>
                <strong>Trip Progress</strong>
                <span>{routeName}</span>
              </div>

              <strong>Unavailable</strong>
            </div>

            <div className="conductor-track-progress">
              <div style={{ width: "0%" }}></div>
            </div>

            <div className="conductor-track-progress-labels">
              <span>Waiting for GPS</span>
              <span>Destination</span>
            </div>
          </div>

          <div className="conductor-track-notice">
            <i className="bi bi-info-circle-fill"></i>

            <div>
              <strong>Trip Information</strong>

              <p>
                {loading
                  ? "Loading your assigned trip information..."
                  : trip
                    ? `Your assigned route is ${routeName}. Departure: ${formatTime(
                        trip.departureTime
                      )}. Arrival: ${formatTime(
                        trip.arrivalTime
                      )}. Live location, speed, and trip progress are not available until GPS tracking is implemented.`
                    : "Trip information is not available. Please try loading it again."}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ConductorTrackBus;