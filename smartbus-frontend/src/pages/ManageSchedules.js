import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ManageSchedules.css";

const API_BASE_URL = "http://localhost:8080";

function ManageSchedules() {
  const navigate = useNavigate();

  const [schedules, setSchedules] = useState([]);
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [ticketPrices, setTicketPrices] = useState([]);
  const [pickupDropPoints, setPickupDropPoints] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    busId: "",
    busNumber: "",
    routeId: "",
    date: "",
    departure: "",
    arrival: "",
    pickupPointId: "",
    dropPointId: "",
    price: "",
    status: "ACTIVE",
  });

  const token = localStorage.getItem("token");

  const authHeaders = {
    Authorization: `Bearer ${token}`,
  };

  // ==========================================
  // AUTHORIZATION ERROR
  // ==========================================

  const handleAuthError = (response) => {
    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("smartBusUser");
      navigate("/login");
      return true;
    }

    return false;
  };

  // ==========================================
  // LOAD ALL DATA
  // ==========================================

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    loadSchedules();
    loadBuses();
    loadRoutes();
    loadTicketPrices();
    loadPickupDropPoints();
  }, [token, navigate]);

  // ==========================================
  // COMMON FETCH FUNCTION
  // ==========================================

  const fetchData = async (url, errorMessage) => {
    const response = await fetch(url, {
      headers: authHeaders,
    });

    if (handleAuthError(response)) {
      throw new Error("Session expired. Please log in again.");
    }

    if (!response.ok) {
      throw new Error(errorMessage);
    }

    return response.json();
  };

  // ==========================================
  // LOAD SCHEDULES
  // ==========================================

  const loadSchedules = async () => {
    try {
      const data = await fetchData(
        `${API_BASE_URL}/api/schedules`,
        "Failed to load schedules."
      );

      setSchedules(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading schedules:", error);
      alert(error.message);
    }
  };

  // ==========================================
  // LOAD BUSES
  // ==========================================

  const loadBuses = async () => {
    try {
      const data = await fetchData(
        `${API_BASE_URL}/api/buses`,
        "Failed to load buses."
      );

      setBuses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading buses:", error);
      alert(error.message);
    }
  };

  // ==========================================
  // LOAD ALL ROUTES
  // ==========================================

  const loadRoutes = async () => {
    try {
      const data = await fetchData(
        `${API_BASE_URL}/api/routes`,
        "Failed to load routes."
      );

      setRoutes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading routes:", error);
      alert(error.message);
    }
  };

  // ==========================================
  // LOAD TICKET PRICES
  // ==========================================

  const loadTicketPrices = async () => {
    try {
      const data = await fetchData(
        `${API_BASE_URL}/api/ticket-prices`,
        "Failed to load ticket prices."
      );

      setTicketPrices(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading ticket prices:", error);
      alert(error.message);
    }
  };

  // ==========================================
  // LOAD PICKUP AND DROP POINTS
  // ==========================================

  const loadPickupDropPoints = async () => {
    try {
      const data = await fetchData(
        `${API_BASE_URL}/api/pickup-drop-points/active`,
        "Failed to load pickup and drop points."
      );

      setPickupDropPoints(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading pickup/drop points:", error);
      alert(error.message);
    }
  };

  // ==========================================
  // GET BUS BY ID
  // ==========================================

  const getBusById = (busId) => {
    return buses.find(
      (bus) => Number(bus.busId) === Number(busId)
    );
  };

  // ==========================================
  // GET ROUTE BY ID
  // ==========================================

  const getRouteById = (routeId) => {
    return routes.find(
      (route) => Number(route.routeId) === Number(routeId)
    );
  };

  // ==========================================
  // GET POINT TYPE
  // ==========================================

  const getPointType = (point) => {
    return String(point.pointType || "")
      .toUpperCase()
      .replace(/[\s-]/g, "_");
  };

  // ==========================================
  // GET PICKUP POINTS FOR SELECTED ROUTE
  // ==========================================

  const getPickupPointsForRoute = (routeId) => {
    if (!routeId) return [];

    return pickupDropPoints
      .filter((point) => {
        const sameRoute =
          Number(point.route?.routeId) === Number(routeId);

        const active =
          String(point.status).toUpperCase() === "ACTIVE";

        const type = getPointType(point);

        return (
          sameRoute &&
          active &&
          ["PICKUP", "PICK_UP", "BOTH"].includes(type)
        );
      })
      .sort(
        (a, b) => Number(a.stopOrder || 0) - Number(b.stopOrder || 0)
      );
  };

  // ==========================================
  // GET DROP POINTS FOR SELECTED PICKUP
  // ==========================================

  const getDropPointsForRoute = (routeId, pickupPointId) => {
    if (!routeId || !pickupPointId) return [];

    const pickupPoint = pickupDropPoints.find(
      (point) =>
        Number(point.pointId) === Number(pickupPointId)
    );

    if (!pickupPoint) return [];

    return pickupDropPoints
      .filter((point) => {
        const sameRoute =
          Number(point.route?.routeId) === Number(routeId);

        const active =
          String(point.status).toUpperCase() === "ACTIVE";

        const type = getPointType(point);

        const validType = ["DROP", "DROP_OFF", "DROPOFF", "BOTH"].includes(
          type
        );

        const laterStop =
          Number(point.stopOrder) > Number(pickupPoint.stopOrder);

        return sameRoute && active && validType && laterStop;
      })
      .sort(
        (a, b) => Number(a.stopOrder || 0) - Number(b.stopOrder || 0)
      );
  };

  // ==========================================
  // GET FARES FOR A SCHEDULE
  // ==========================================

  const getPricesForSchedule = (schedule) => {
    const routeId = schedule.route?.routeId;
    const travelDate = schedule.travelDate;

    if (!routeId || !travelDate) return [];

    const matchingPrices = ticketPrices.filter((price) => {
      return (
        Number(price.route?.routeId) === Number(routeId) &&
        String(price.status).toUpperCase() === "ACTIVE" &&
        price.pickupPoint &&
        price.dropPoint &&
        price.effectiveDate &&
        price.effectiveDate <= travelDate
      );
    });

    // Keep the latest effective fare for each pickup/drop combination.
    const fareMap = new Map();

    matchingPrices.forEach((fare) => {
      const key = `${fare.pickupPoint.pointId}-${fare.dropPoint.pointId}`;

      const existingFare = fareMap.get(key);

      if (
        !existingFare ||
        fare.effectiveDate > existingFare.effectiveDate
      ) {
        fareMap.set(key, fare);
      }
    });

    return Array.from(fareMap.values()).sort((a, b) => {
      return (
        Number(a.pickupPoint?.stopOrder || 0) -
        Number(b.pickupPoint?.stopOrder || 0)
      );
    });
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) return "—";

    const parts = date.split("-");

    if (parts.length !== 3) return date;

    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    return `${parts[2]} ${months[Number(parts[1]) - 1]} ${parts[0]}`;
  };

  // ==========================================
  // FORMAT TIME
  // ==========================================

  const formatTime = (time) => {
    if (!time) return "—";

    const parts = time.split(":");
    const hours = Number(parts[0]);
    const minutes = parts[1];

    const ampm = hours >= 12 ? "PM" : "AM";

    let hour = hours % 12;

    if (hour === 0) hour = 12;

    return `${String(hour).padStart(2, "0")}:${minutes} ${ampm}`;
  };

  // ==========================================
  // FORMAT CURRENCY
  // ==========================================

  const formatCurrency = (price, currency = "LKR") => {
    return `${currency} ${Number(price).toLocaleString("en-LK", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // ==========================================
  // RESET FORM
  // ==========================================

  const resetForm = () => {
    setFormData({
      busId: "",
      busNumber: "",
      routeId: "",
      date: "",
      departure: "",
      arrival: "",
      pickupPointId: "",
      dropPointId: "",
      price: "",
      status: "ACTIVE",
    });
  };

  // ==========================================
  // ADD SCHEDULE
  // ==========================================

  const handleAddSchedule = () => {
    setEditingSchedule(null);
    resetForm();
    setShowModal(true);
  };

  // ==========================================
  // EDIT SCHEDULE
  // ==========================================

  const handleEditSchedule = (schedule) => {
    setEditingSchedule(schedule);

    setFormData({
      busId: schedule.bus?.busId || "",
      busNumber: schedule.bus?.registrationNumber || "",
      routeId: schedule.route?.routeId || "",
      date: schedule.travelDate || "",
      departure: schedule.departureTime || "",
      arrival: schedule.arrivalTime || "",
      pickupPointId: "",
      dropPointId: "",
      price: "",
      status:
        String(schedule.status).toUpperCase() === "ACTIVE"
          ? "ACTIVE"
          : "INACTIVE",
    });

    setShowModal(true);
  };

  // ==========================================
  // HANDLE FORM INPUTS
  // ==========================================

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // BUS
    if (name === "busId") {
      const selectedBus = getBusById(value);

      setFormData((previous) => ({
        ...previous,
        busId: value,
        busNumber: selectedBus?.registrationNumber || "",
      }));

      return;
    }

    // ROUTE
    if (name === "routeId") {
      setFormData((previous) => ({
        ...previous,
        routeId: value,
        pickupPointId: "",
        dropPointId: "",
        price: "",
      }));

      return;
    }

    // PICKUP POINT
    if (name === "pickupPointId") {
      setFormData((previous) => ({
        ...previous,
        pickupPointId: value,
        dropPointId: "",
      }));

      return;
    }

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // SAVE OR UPDATE TICKET PRICE
  // ==========================================

  const saveTicketPrice = async () => {
    const fareData = {
      route: {
        routeId: Number(formData.routeId),
      },
      pickupPoint: {
        pointId: Number(formData.pickupPointId),
      },
      dropPoint: {
        pointId: Number(formData.dropPointId),
      },
      price: Number(formData.price),
      currency: "LKR",
      effectiveDate: formData.date,
      status: formData.status,
    };

    // Find existing fare for this exact combination and date.
    const existingFare = ticketPrices.find((fare) => {
      return (
        Number(fare.route?.routeId) === Number(formData.routeId) &&
        Number(fare.pickupPoint?.pointId) ===
          Number(formData.pickupPointId) &&
        Number(fare.dropPoint?.pointId) ===
          Number(formData.dropPointId) &&
        fare.effectiveDate === formData.date
      );
    });

    const isUpdating = Boolean(existingFare);

    const url = isUpdating
      ? `${API_BASE_URL}/api/ticket-prices/${existingFare.priceId}`
      : `${API_BASE_URL}/api/ticket-prices`;

    const response = await fetch(url, {
      method: isUpdating ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(fareData),
    });

    if (handleAuthError(response)) {
      throw new Error("Session expired. Please log in again.");
    }

    if (!response.ok) {
      const errorText = await response.text();

      console.error("Ticket price error:", errorText);

      throw new Error(
        "Schedule was saved, but ticket price could not be saved. Check the backend response."
      );
    }
  };

  // ==========================================
  // SAVE SCHEDULE
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.busId ||
      !formData.routeId ||
      !formData.date ||
      !formData.departure ||
      !formData.arrival
    ) {
      alert("Please fill in all required schedule fields.");
      return;
    }

    // Require all fare fields together.
    const hasAnyFareValue =
      formData.pickupPointId || formData.dropPointId || formData.price;

    if (
      hasAnyFareValue &&
      (!formData.pickupPointId ||
        !formData.dropPointId ||
        !formData.price)
    ) {
      alert("Please select pickup point, drop-off point and enter ticket price.");
      return;
    }

    if (hasAnyFareValue && Number(formData.price) <= 0) {
      alert("Please enter a valid ticket price.");
      return;
    }

    const selectedBus = getBusById(formData.busId);

    if (!selectedBus) {
      alert("Please select a valid bus.");
      return;
    }

    const scheduleData = {
      bus: {
        busId: Number(formData.busId),
      },
      route: {
        routeId: Number(formData.routeId),
      },
      departureTime: formData.departure,
      arrivalTime: formData.arrival,
      travelDate: formData.date,
      availableSeats: editingSchedule
        ? editingSchedule.availableSeats
        : selectedBus.capacity,
      status: formData.status,
    };

    setSaving(true);

    try {
      const isUpdating = Boolean(editingSchedule);

      const url = isUpdating
        ? `${API_BASE_URL}/api/schedules/${editingSchedule.scheduleId}`
        : `${API_BASE_URL}/api/schedules`;

      const response = await fetch(url, {
        method: isUpdating ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(scheduleData),
      });

      if (handleAuthError(response)) {
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();

        console.error("Schedule backend error:", errorText);

        throw new Error(
          isUpdating
            ? "Failed to update schedule."
            : "Failed to create schedule."
        );
      }

      // Save fare only when the admin entered a fare combination.
      if (hasAnyFareValue) {
        await saveTicketPrice();
      }

      alert(
        isUpdating
          ? "Schedule updated successfully."
          : "Schedule added successfully."
      );

      setShowModal(false);
      setEditingSchedule(null);
      resetForm();

      await Promise.all([
        loadSchedules(),
        loadTicketPrices(),
      ]);
    } catch (error) {
      console.error("Error saving schedule:", error);
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // DELETE SCHEDULE
  // ==========================================

  const handleDeleteSchedule = async (scheduleId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this schedule?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/schedules/${scheduleId}`,
        {
          method: "DELETE",
          headers: authHeaders,
        }
      );

      if (handleAuthError(response)) return;

      if (!response.ok) {
        throw new Error("Failed to delete schedule.");
      }

      alert("Schedule deleted successfully.");

      await loadSchedules();
    } catch (error) {
      console.error("Error deleting schedule:", error);
      alert(error.message);
    }
  };

  // ==========================================
  // FILTER SCHEDULES
  // ==========================================

  const filteredSchedules = schedules.filter((schedule) => {
    const search = searchTerm.toLowerCase();

    const busName = schedule.bus?.busName || "";
    const busNumber = schedule.bus?.registrationNumber || "";
    const routeName = schedule.route?.routeName || "";
    const date = schedule.travelDate || "";

    return (
      busName.toLowerCase().includes(search) ||
      busNumber.toLowerCase().includes(search) ||
      routeName.toLowerCase().includes(search) ||
      date.toLowerCase().includes(search)
    );
  });

  // ==========================================
  // SUMMARY COUNTS
  // ==========================================

  const activeSchedules = schedules.filter(
    (schedule) =>
      String(schedule.status).toUpperCase() === "ACTIVE"
  ).length;

  const inactiveSchedules = schedules.length - activeSchedules;

  // ==========================================
  // CURRENT PICKUP AND DROP OPTIONS
  // ==========================================

  const pickupOptions = getPickupPointsForRoute(formData.routeId);

  const dropOptions = getDropPointsForRoute(
    formData.routeId,
    formData.pickupPointId
  );

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("smartBusUser");
    navigate("/login");
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="manage-schedules-page">

      {/* HEADER */}

      <header className="manage-schedules-header">

        <div className="manage-schedules-header-left">

          <button
            className="back-dashboard-btn"
            onClick={() => navigate("/admin-dashboard")}
            title="Back to Dashboard"
          >
            <i className="bi bi-arrow-left"></i>
          </button>

          <div>
            <h1>Manage Schedules</h1>
            <p>Create and manage bus departure schedules</p>
          </div>

        </div>

        <button
          className="add-schedule-btn"
          onClick={handleAddSchedule}
        >
          <i className="bi bi-plus-lg"></i>
          Add New Schedule
        </button>

      </header>

      {/* MAIN CONTENT */}

      <main className="manage-schedules-content">

        {/* SUMMARY */}

        <div className="schedule-summary-grid">

          <div className="schedule-summary-card">

            <div className="schedule-summary-icon total">
              <i className="bi bi-calendar3"></i>
            </div>

            <div>
              <span>Total Schedules</span>
              <h2>{schedules.length}</h2>
            </div>

          </div>

          <div className="schedule-summary-card">

            <div className="schedule-summary-icon active">
              <i className="bi bi-calendar-check-fill"></i>
            </div>

            <div>
              <span>Active Schedules</span>
              <h2>{activeSchedules}</h2>
            </div>

          </div>

          <div className="schedule-summary-card">

            <div className="schedule-summary-icon inactive">
              <i className="bi bi-calendar-x-fill"></i>
            </div>

            <div>
              <span>Inactive Schedules</span>
              <h2>{inactiveSchedules}</h2>
            </div>

          </div>

        </div>

        {/* SCHEDULES SECTION */}

        <section className="schedules-section">

          <div className="schedules-section-header">

            <div>
              <h2>All Schedules</h2>
              <p>View and manage departure schedules for your buses.</p>
            </div>

            <div className="schedule-search">
              <i className="bi bi-search"></i>

              <input
                type="text"
                placeholder="Search schedules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

          </div>

          {/* TABLE */}

          <div className="schedules-table-wrapper">

            <table className="schedules-table">

              <thead>
                <tr>
                  <th>Bus</th>
                  <th>Route</th>
                  <th>Date</th>
                  <th>Departure</th>
                  <th>Arrival</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {filteredSchedules.length > 0 ? (

                  filteredSchedules.map((schedule) => {

                    const isActive =
                      String(schedule.status).toUpperCase() === "ACTIVE";

                    const fares = getPricesForSchedule(schedule);

                    return (
                      <tr key={schedule.scheduleId}>

                        {/* BUS */}

                        <td>
                          <div className="schedule-bus-cell">

                            <div className="schedule-bus-icon">
                              <i className="bi bi-bus-front-fill"></i>
                            </div>

                            <div>
                              <strong>
                                {schedule.bus?.busName || "—"}
                              </strong>

                              <span>
                                {schedule.bus?.registrationNumber || "—"}
                              </span>
                            </div>

                          </div>
                        </td>

                        {/* ROUTE */}

                        <td>
                          <div className="schedule-route-cell">
                            <i className="bi bi-signpost-2"></i>

                            <span>
                              {schedule.route?.routeName || "—"}
                            </span>
                          </div>
                        </td>

                        {/* DATE */}

                        <td>
                          <div className="schedule-date-cell">
                            <i className="bi bi-calendar3"></i>

                            <span>
                              {formatDate(schedule.travelDate)}
                            </span>
                          </div>
                        </td>

                        {/* DEPARTURE */}

                        <td>
                          <div className="schedule-time-cell">
                            <i className="bi bi-clock"></i>

                            <span>
                              {formatTime(schedule.departureTime)}
                            </span>
                          </div>
                        </td>

                        {/* ARRIVAL */}

                        <td>
                          <div className="schedule-time-cell">
                            <i className="bi bi-clock-fill"></i>

                            <span>
                              {formatTime(schedule.arrivalTime)}
                            </span>
                          </div>
                        </td>

                        {/* PRICES */}

                        <td>
                          <div className="schedule-price-list">

                            {fares.length > 0 ? (

                              fares.map((fare) => (

                                <div
                                  key={fare.priceId}
                                  className="schedule-fare-item"
                                  style={{
                                    marginBottom: "6px",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  <strong className="schedule-price">
                                    {fare.pickupPoint?.pointName || "—"}
                                    {" → "}
                                    {fare.dropPoint?.pointName || "—"}
                                  </strong>

                                  <div>
                                    {formatCurrency(
                                      fare.price,
                                      fare.currency || "LKR"
                                    )}
                                  </div>
                                </div>

                              ))

                            ) : (

                              <span> No fares available </span>

                            )}

                          </div>
                        </td>

                        {/* STATUS */}

                        <td>
                          <span
                            className={`schedule-status ${
                              isActive ? "active" : "inactive"
                            }`}
                          >
                            <span className="status-dot"></span>

                            {isActive ? "Active" : "Inactive"}
                          </span>
                        </td>

                        {/* ACTIONS */}

                        <td>
                          <div className="schedule-actions">

                            <button
                              className="schedule-action edit"
                              title="Edit Schedule"
                              onClick={() => handleEditSchedule(schedule)}
                            >
                              <i className="bi bi-pencil"></i>
                            </button>

                            <button
                              className="schedule-action delete"
                              title="Delete Schedule"
                              onClick={() =>
                                handleDeleteSchedule(schedule.scheduleId)
                              }
                            >
                              <i className="bi bi-trash3"></i>
                            </button>

                          </div>
                        </td>

                      </tr>
                    );
                  })

                ) : (

                  <tr>
                    <td colSpan="8">

                      <div className="no-schedules">
                        <i className="bi bi-calendar-x"></i>

                        <h3>No schedules found</h3>

                        <p>Try searching with a different keyword.</p>
                      </div>

                    </td>
                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </section>

      </main>

      {/* MODAL */}

      {showModal && (

        <div
          className="schedule-modal-overlay"
          onClick={() => setShowModal(false)}
        >

          <div
            className="schedule-modal"
            onClick={(e) => e.stopPropagation()}
          >

            {/* MODAL HEADER */}

            <div className="schedule-modal-header">

              <div>

                <h2>
                  {editingSchedule ? "Edit Schedule" : "Add New Schedule"}
                </h2>

                <p>
                  {editingSchedule
                    ? "Update schedule information and add a fare."
                    : "Enter schedule information and ticket fare details."}
                </p>

              </div>

              <button
                className="close-modal-btn"
                onClick={() => setShowModal(false)}
              >
                <i className="bi bi-x-lg"></i>
              </button>

            </div>

            {/* FORM */}

            <form onSubmit={handleSubmit}>

              <div className="schedule-form-grid">

                {/* BUS NAME */}

                <div className="form-group">

                  <label>
                    Bus Name <span>*</span>
                  </label>

                  <div className="input-with-icon">
                    <i className="bi bi-bus-front"></i>

                    <select
                      name="busId"
                      value={formData.busId}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Bus</option>

                      {buses.map((bus) => (

                        <option
                          key={bus.busId}
                          value={bus.busId}
                        >
                          {bus.busName}
                        </option>

                      ))}

                    </select>
                  </div>

                </div>

                {/* BUS NUMBER */}

                <div className="form-group">

                  <label>
                    Bus Number <span>*</span>
                  </label>

                  <div className="input-with-icon">
                    <i className="bi bi-card-text"></i>

                    <input
                      type="text"
                      name="busNumber"
                      placeholder="Bus registration number"
                      value={formData.busNumber}
                      readOnly
                    />
                  </div>

                </div>

                {/* ROUTE */}

                <div className="form-group">

                  <label>
                    Route <span>*</span>
                  </label>

                  <div className="input-with-icon">
                    <i className="bi bi-signpost-2"></i>

                    <select
                      name="routeId"
                      value={formData.routeId}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Route</option>

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

                </div>

                {/* DATE */}

                <div className="form-group">

                  <label>
                    Travel Date <span>*</span>
                  </label>

                  <div className="input-with-icon">
                    <i className="bi bi-calendar3"></i>

                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                </div>

                {/* DEPARTURE */}

                <div className="form-group">

                  <label>
                    Departure Time <span>*</span>
                  </label>

                  <div className="input-with-icon">
                    <i className="bi bi-clock"></i>

                    <input
                      type="time"
                      name="departure"
                      value={formData.departure}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                </div>

                {/* ARRIVAL */}

                <div className="form-group">

                  <label>
                    Arrival Time <span>*</span>
                  </label>

                  <div className="input-with-icon">
                    <i className="bi bi-clock-fill"></i>

                    <input
                      type="time"
                      name="arrival"
                      value={formData.arrival}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                </div>

                {/* FARE SECTION */}

                <div
                  className="form-group"
                  style={{ gridColumn: "1 / -1" }}
                >

                  <h3>Ticket Fare Details</h3>

                  <p>
                    Add a fare for a specific pickup and drop-off combination.
                  </p>

                </div>

                {/* PICKUP POINT */}

                <div className="form-group">

                  <label>Pickup Point</label>

                  <div className="input-with-icon">
                    <i className="bi bi-geo-alt"></i>

                    <select
                      name="pickupPointId"
                      value={formData.pickupPointId}
                      onChange={handleInputChange}
                      disabled={!formData.routeId}
                    >
                      <option value="">
                        Select Pickup Point
                      </option>

                      {pickupOptions.map((point) => (

                        <option
                          key={point.pointId}
                          value={point.pointId}
                        >
                          {point.pointName}
                        </option>

                      ))}

                    </select>
                  </div>

                  {formData.routeId && pickupOptions.length === 0 && (
                    <small>
                      No active pickup points are available for this route.
                    </small>
                  )}

                </div>

                {/* DROP POINT */}

                <div className="form-group">

                  <label>Drop-off Point</label>

                  <div className="input-with-icon">
                    <i className="bi bi-geo-alt-fill"></i>

                    <select
                      name="dropPointId"
                      value={formData.dropPointId}
                      onChange={handleInputChange}
                      disabled={!formData.pickupPointId}
                    >
                      <option value="">
                        Select Drop-off Point
                      </option>

                      {dropOptions.map((point) => (

                        <option
                          key={point.pointId}
                          value={point.pointId}
                        >
                          {point.pointName}
                        </option>

                      ))}

                    </select>
                  </div>

                  {formData.pickupPointId && dropOptions.length === 0 && (
                    <small>
                      No later drop-off points are available.
                    </small>
                  )}

                </div>

                {/* TICKET PRICE */}

                <div className="form-group">

                  <label>Ticket Price (LKR)</label>

                  <div className="input-with-icon">
                    <i className="bi bi-cash-stack"></i>

                    <input
                      type="number"
                      name="price"
                      placeholder="Enter ticket price"
                      value={formData.price}
                      onChange={handleInputChange}
                      min="0.01"
                      step="0.01"
                    />
                  </div>

                </div>

                {/* STATUS */}

                <div className="form-group">

                  <label>Status</label>

                  <div className="input-with-icon">
                    <i className="bi bi-toggle-on"></i>

                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                    </select>
                  </div>

                </div>

              </div>

              {/* EXISTING FARES FOR SELECTED ROUTE */}

              {formData.routeId && (

                <div
                  style={{
                    marginTop: "20px",
                    padding: "15px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                  }}
                >

                  <h3>Existing Fares for This Route</h3>

                  {ticketPrices.filter((fare) =>
                    Number(fare.route?.routeId) === Number(formData.routeId)
                  ).length > 0 ? (

                    ticketPrices
                      .filter((fare) =>
                        Number(fare.route?.routeId) ===
                        Number(formData.routeId)
                      )
                      .map((fare) => (

                        <div
                          key={fare.priceId}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: "10px",
                            padding: "8px 0",
                            borderBottom: "1px solid #eee",
                          }}
                        >

                          <span>
                            {fare.pickupPoint?.pointName || "—"}
                            {" → "}
                            {fare.dropPoint?.pointName || "—"}
                          </span>

                          <strong>
                            {formatCurrency(
                              fare.price,
                              fare.currency || "LKR"
                            )}
                          </strong>

                        </div>

                      ))

                  ) : (

                    <p>No fares have been added for this route yet.</p>

                  )}

                </div>

              )}

              {/* MODAL FOOTER */}

              <div className="schedule-modal-footer">

                <button
                  type="button"
                  className="cancel-schedule-btn"
                  onClick={() => setShowModal(false)}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-schedule-btn"
                  disabled={saving}
                >

                  <i
                    className={
                      editingSchedule
                        ? "bi bi-check-lg"
                        : "bi bi-plus-lg"
                    }
                  ></i>

                  {saving
                    ? "Saving..."
                    : editingSchedule
                    ? "Update Schedule"
                    : "Add Schedule"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default ManageSchedules;