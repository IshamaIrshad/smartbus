
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SearchBus.css";

const API_BASE_URL = "http://localhost:8080";

function SearchBus() {
  const navigate = useNavigate();

  const [routeId, setRouteId] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");

  const [points, setPoints] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [buses, setBuses] = useState([]);

  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  // Use local date instead of UTC date
  const getLocalToday = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const today = getLocalToday();

  // Load active routes and pickup/drop points
  useEffect(() => {
    const loadLocations = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/pickup-drop-points/active`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("token");
          localStorage.removeItem("smartBusUser");
          navigate("/login");
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to load pickup/drop points.");
        }

        const data = await response.json();

        console.log("Active pickup/drop points:", data);

        const activePoints = data.filter(
          (point) =>
            point.status === "ACTIVE" &&
            point.route &&
            point.route.status === "ACTIVE" &&
            point.pointName
        );

        setPoints(activePoints);

        // Get unique active routes from the points
        const routeMap = new Map();

        activePoints.forEach((point) => {
          const route = point.route;

          if (route?.routeId && route?.routeName) {
            routeMap.set(Number(route.routeId), {
              routeId: Number(route.routeId),
              routeName: route.routeName,
              distance: route.distance,
            });
          }
        });

        const activeRoutes = Array.from(routeMap.values()).sort(
          (a, b) => a.routeName.localeCompare(b.routeName)
        );

        setRoutes(activeRoutes);
      } catch (err) {
        console.error("Error loading locations:", err);
        setError("Unable to load routes and pickup locations.");
      }
    };

    loadLocations();
  }, [navigate]);

  // Points belonging to the selected route
  const selectedRoutePoints = useMemo(() => {
    if (!routeId) return [];

    return points
      .filter(
        (point) =>
          Number(point.route?.routeId) === Number(routeId)
      )
      .sort(
        (a, b) => Number(a.stopOrder) - Number(b.stopOrder)
      );
  }, [points, routeId]);

  // Check whether a point can be used as a pickup location
  const canPickup = (point) => {
    const type = String(point.pointType || "").toUpperCase();

    return ["BOTH", "PICKUP", "PICK_UP"].includes(type);
  };

  // Check whether a point can be used as a drop location
  const canDrop = (point) => {
    const type = String(point.pointType || "").toUpperCase();

    return ["BOTH", "DROP", "DROP_OFF", "DROPOFF"].includes(type);
  };

  // Available pickup locations
  const pickupPoints = selectedRoutePoints.filter(canPickup);

  // Find selected pickup point
  const selectedPickupPoint = selectedRoutePoints.find(
    (point) => point.pointName === from && canPickup(point)
  );

  // Only show destinations after the selected pickup location
  const destinationPoints = selectedPickupPoint
    ? selectedRoutePoints.filter(
        (point) =>
          canDrop(point) &&
          Number(point.stopOrder) >
            Number(selectedPickupPoint.stopOrder)
      )
    : [];

  const formatTime = (time) => {
    if (!time) return "";

    const [hours, minutes] = String(time).split(":");

    const dateObject = new Date();
    dateObject.setHours(Number(hours));
    dateObject.setMinutes(Number(minutes));

    return dateObject.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateDuration = (departure, arrival) => {
    if (!departure || !arrival) return "";

    const [departureHour, departureMinute] = departure
      .split(":")
      .map(Number);

    const [arrivalHour, arrivalMinute] = arrival
      .split(":")
      .map(Number);

    let departureMinutes =
      departureHour * 60 + departureMinute;

    let arrivalMinutes =
      arrivalHour * 60 + arrivalMinute;

    if (arrivalMinutes < departureMinutes) {
      arrivalMinutes += 24 * 60;
    }

    const durationMinutes =
      arrivalMinutes - departureMinutes;

    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;

    return `${hours}h ${minutes.toString().padStart(2, "0")}m`;
  };

  // Find the latest fare that applies to the selected journey date
  const findMatchingPrice = (
    prices,
    selectedRouteId,
    pickupPointId,
    dropPointId
  ) => {
    return prices
      .filter((price) => {
        const priceDate = String(
          price.effectiveDate || ""
        ).substring(0, 10);

        return (
          price.status === "ACTIVE" &&
          Number(price.route?.routeId) ===
            Number(selectedRouteId) &&
          Number(price.pickupPoint?.pointId) ===
            Number(pickupPointId) &&
          Number(price.dropPoint?.pointId) ===
            Number(dropPointId) &&
          priceDate &&
          priceDate <= date
        );
      })
      .sort((a, b) => {
        const dateA = String(a.effectiveDate).substring(0, 10);
        const dateB = String(b.effectiveDate).substring(0, 10);

        // Latest effective date first
        const dateComparison = dateB.localeCompare(dateA);

        if (dateComparison !== 0) {
          return dateComparison;
        }

        // If dates are equal, use the latest price ID
        return Number(b.priceId || 0) - Number(a.priceId || 0);
      })[0];
  };

  const handleSearch = async () => {
    setError("");
    setSearched(false);
    setBuses([]);

    if (!routeId) {
      setError("Please select a bus route.");
      return;
    }

    if (!from) {
      setError("Please select your pickup location.");
      return;
    }

    if (!to) {
      setError("Please select your destination.");
      return;
    }

    if (from === to) {
      setError("Pickup and destination cannot be the same.");
      return;
    }

    if (!date) {
      setError("Please select your journey date.");
      return;
    }

    if (date < today) {
      setError("Please select today or a future date.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      // Load schedules and ticket prices together
      const [schedulesResponse, pricesResponse] =
        await Promise.all([
          fetch(`${API_BASE_URL}/api/schedules`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),

          fetch(`${API_BASE_URL}/api/ticket-prices`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

      if (
        schedulesResponse.status === 401 ||
        schedulesResponse.status === 403 ||
        pricesResponse.status === 401 ||
        pricesResponse.status === 403
      ) {
        localStorage.removeItem("token");
        localStorage.removeItem("smartBusUser");
        navigate("/login");
        return;
      }

      if (!schedulesResponse.ok) {
        throw new Error("Failed to load schedules.");
      }

      if (!pricesResponse.ok) {
        throw new Error("Failed to load ticket prices.");
      }

      const schedules = await schedulesResponse.json();
      const prices = await pricesResponse.json();

      console.log("Schedules:", schedules);
      console.log("Ticket prices:", prices);

      // Find schedules for the selected route and date
      const matchingSchedules = schedules.filter(
        (schedule) =>
          schedule.status === "ACTIVE" &&
          String(schedule.travelDate).substring(0, 10) === date &&
          Number(schedule.route?.routeId) === Number(routeId) &&
          schedule.bus?.status === "ACTIVE"
      );

      const results = [];

      matchingSchedules.forEach((schedule) => {
        const scheduleRouteId = Number(
          schedule.route?.routeId
        );

        // Find pickup point belonging to this schedule's route
        const pickupPoint = points.find(
          (point) =>
            Number(point.route?.routeId) === scheduleRouteId &&
            point.pointName === from &&
            canPickup(point)
        );

        // Find destination point belonging to this schedule's route
        const dropPoint = points.find(
          (point) =>
            Number(point.route?.routeId) === scheduleRouteId &&
            point.pointName === to &&
            canDrop(point)
        );

        if (!pickupPoint || !dropPoint) {
          return;
        }

        // Destination must come after pickup
        if (
          Number(dropPoint.stopOrder) <=
          Number(pickupPoint.stopOrder)
        ) {
          return;
        }

        // Find the correct fare using exact point IDs
        const matchingPrice = findMatchingPrice(
          prices,
          scheduleRouteId,
          pickupPoint.pointId,
          dropPoint.pointId
        );

        if (!matchingPrice) {
          console.log(
            "No matching fare:",
            from,
            "to",
            to,
            "Route:",
            scheduleRouteId
          );
          return;
        }

        const availableSeats = Number(
          schedule.availableSeats
        );

        if (!Number.isFinite(availableSeats) || availableSeats <= 0) {
          return;
        }

        results.push({
          id: schedule.scheduleId,
          scheduleId: schedule.scheduleId,

          busId: schedule.bus?.busId,

          name: schedule.bus?.busName || "SmartBus",
          type: schedule.bus?.busType || "Bus",

          registrationNumber:
            schedule.bus?.registrationNumber || "",

          departure: formatTime(schedule.departureTime),
          arrival: formatTime(schedule.arrivalTime),

          departureRaw: schedule.departureTime,
          arrivalRaw: schedule.arrivalTime,

          duration: calculateDuration(
            schedule.departureTime,
            schedule.arrivalTime
          ),

          price: Number(matchingPrice.price),
          currency: matchingPrice.currency || "LKR",

          seats: availableSeats,

          routeId: scheduleRouteId,

          pickupPointId: pickupPoint.pointId,
          dropPointId: dropPoint.pointId,
        });
      });

      setBuses(results);
      setSearched(true);

      if (results.length === 0) {
        setError(
          "No buses are available for the selected journey. Please try another date or route."
        );
      }
    } catch (err) {
      console.error("Search error:", err);

      setError(
        "Unable to search buses. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleViewSeats = (bus) => {
    navigate("/seat-selection", {
      state: {
        from,
        to,
        date,

        scheduleId: bus.scheduleId,
        busId: bus.busId,

        busName: bus.name,
        busType: bus.type,
        registrationNumber: bus.registrationNumber,

        departure: bus.departure,
        arrival: bus.arrival,
        duration: bus.duration,

        price: bus.price,
        currency: bus.currency,

        availableSeats: bus.seats,

        pickupPointId: bus.pickupPointId,
        dropPointId: bus.dropPointId,
        routeId: bus.routeId,
      },
    });
  };

  return (
    <div className="search-page">

      {/* Page Header */}

      <section className="search-header">

        <div className="search-header-shape shape-one"></div>
        <div className="search-header-shape shape-two"></div>

        <div className="container search-header-content">

          <div className="search-header-icon">
            🚌
          </div>

          <div className="search-header-text">

            <span className="search-label">
              SMARTBUS RESERVATION
            </span>

            <h1>
              Find Your Perfect Bus Journey
            </h1>

            <p>
              Search buses, compare available journeys and choose the
              best option for your trip across Sri Lanka.
            </p>

          </div>

        </div>

      </section>

      {/* Search Form */}

      <section className="search-section">

        <div className="container">

          <div className="search-card">

            <h2>Search for a Bus</h2>

            <p className="search-description">
              Enter your journey details to find available buses.
            </p>

            <div className="row g-3">

              {/* Route */}

              <div className="col-lg-3 col-md-6">

                <label>Bus Route</label>

                <select
                  value={routeId}
                  onChange={(e) => {
                    setRouteId(e.target.value);
                    setFrom("");
                    setTo("");
                    setBuses([]);
                    setSearched(false);
                    setError("");
                  }}
                >

                  <option value="">
                    Select Route
                  </option>

                  {routes.map((route) => (
                    <option
                      key={route.routeId}
                      value={route.routeId}
                    >
                      {route.routeName}
                    </option>
                  ))}

                </select>

              </div>

              {/* From */}

              <div className="col-lg-3 col-md-6">

                <label>Pickup Location</label>

                <select
                  value={from}
                  disabled={!routeId}
                  onChange={(e) => {
                    setFrom(e.target.value);
                    setTo("");
                    setBuses([]);
                    setSearched(false);
                    setError("");
                  }}
                >

                  <option value="">
                    Select Pickup
                  </option>

                  {pickupPoints.map((point) => (
                    <option
                      key={point.pointId}
                      value={point.pointName}
                    >
                      {point.pointName}
                    </option>
                  ))}

                </select>

              </div>

              {/* To */}

              <div className="col-lg-3 col-md-6">

                <label>Destination</label>

                <select
                  value={to}
                  disabled={!from}
                  onChange={(e) => {
                    setTo(e.target.value);
                    setBuses([]);
                    setSearched(false);
                    setError("");
                  }}
                >

                  <option value="">
                    Select Destination
                  </option>

                  {destinationPoints.map((point) => (
                    <option
                      key={point.pointId}
                      value={point.pointName}
                    >
                      {point.pointName}
                    </option>
                  ))}

                </select>

              </div>

              {/* Date */}

              <div className="col-lg-3 col-md-6">

                <label>Journey Date</label>

                <input
                  type="date"
                  min={today}
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    setBuses([]);
                    setSearched(false);
                    setError("");
                  }}
                />

              </div>

            </div>

            {/* Error */}

            {error && (
              <div className="search-error">
                {error}
              </div>
            )}

            {/* Search Button */}

            <button
              className="search-submit"
              type="button"
              onClick={handleSearch}
              disabled={loading}
            >
              {loading
                ? "Searching..."
                : "Search Available Buses"}
            </button>

          </div>

          {/* Results */}

          {searched && buses.length > 0 && (

            <div className="results-section">

              <div className="results-heading">

                <div>

                  <h2>Available Buses</h2>

                  <p>
                    {from} → {to} &nbsp; | &nbsp; {date}
                  </p>

                </div>

                <span className="bus-count">
                  {buses.length}{" "}
                  {buses.length === 1 ? "bus" : "buses"} available
                </span>

              </div>

              {buses.map((bus) => (

                <div
                  className="bus-result-card"
                  key={bus.id}
                >

                  {/* Bus Icon */}

                  <div className="bus-icon">
                    🚌
                  </div>

                  {/* Bus Details */}

                  <div className="bus-details">

                    <h3>{bus.name}</h3>

                    <p className="bus-type">
                      {bus.type}
                    </p>

                    <div className="journey-times">

                      <div>

                        <strong>
                          {bus.departure}
                        </strong>

                        <span>
                          {from}
                        </span>

                      </div>

                      <div className="journey-line">

                        <span>
                          {bus.duration}
                        </span>

                        <div></div>

                      </div>

                      <div>

                        <strong>
                          {bus.arrival}
                        </strong>

                        <span>
                          {to}
                        </span>

                      </div>

                    </div>

                  </div>

                  {/* Price */}

                  <div className="bus-price">

                    <span>
                      Available Seats
                    </span>

                    <strong className="available-seats">
                      {bus.seats}
                    </strong>

                    <small>
                      Ticket Price
                    </small>

                    <strong>
                      Rs. {bus.price.toLocaleString("en-LK", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </strong>

                    <button
                      type="button"
                      onClick={() => handleViewSeats(bus)}
                    >
                      View Seats
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

          {/* No Results */}

          {searched && buses.length === 0 && !error && (

            <div className="results-section">

              <div className="results-heading">

                <div>

                  <h2>No Buses Found</h2>

                  <p>
                    No buses are available for the selected journey.
                  </p>

                </div>

              </div>

            </div>

          )}

        </div>

      </section>

      {/* Information */}

      <section className="search-info">

        <div className="container">

          <div className="row g-4">

            <div className="col-md-4">

              <div className="info-box">

                <div>🔎</div>

                <h4>Search</h4>

                <p>
                  Enter your route, pickup, destination and journey date.
                </p>

              </div>

            </div>

            <div className="col-md-4">

              <div className="info-box">

                <div>💺</div>

                <h4>Select Your Seat</h4>

                <p>
                  Choose an available seat that suits your preference.
                </p>

              </div>

            </div>

            <div className="col-md-4">

              <div className="info-box">

                <div>🎫</div>

                <h4>Book Your Ticket</h4>

                <p>
                  Continue your booking and receive your digital ticket.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
}

export default SearchBus;
