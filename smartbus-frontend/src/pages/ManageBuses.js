import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ManageBuses.css";

const ManageBuses = () => {
  const navigate = useNavigate();

  const [buses, setBuses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [editingBus, setEditingBus] = useState(null);

  const [formData, setFormData] = useState({
    busNumber: "",
    busName: "",
    type: "Luxury",
    capacity: "",
    route: "",
    driver: "",
    status: "Active",
  });

  const [loading, setLoading] = useState(true);

  // ================= LOAD BUSES =================

  useEffect(() => {
    loadBuses();
  }, []);

  const loadBuses = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:8080/api/buses",
        {
          method: "GET",
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
        throw new Error("Failed to load buses.");
      }

      const data = await response.json();

      const formattedBuses = data.map((bus) => ({
        id: bus.busId,
        busNumber: bus.registrationNumber || "",
        busName: bus.busName || "",
        type: bus.busType || "",
        capacity: bus.capacity || 0,

        // Route and driver are not stored directly in Bus entity yet
        route: "—",
        driver: "—",

        status:
          bus.status?.toUpperCase() === "ACTIVE"
            ? "Active"
            : bus.status?.toUpperCase() === "MAINTENANCE"
            ? "Maintenance"
            : "Inactive",
      }));

      setBuses(formattedBuses);
    } catch (error) {
      console.error("Error loading buses:", error);
      alert("Unable to load buses.");
    } finally {
      setLoading(false);
    }
  };

  // ================= SEARCH / FILTER =================

  const filteredBuses = buses.filter((bus) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      bus.busNumber.toLowerCase().includes(search) ||
      bus.busName.toLowerCase().includes(search) ||
      bus.route.toLowerCase().includes(search) ||
      bus.driver.toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === "All" ||
      bus.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // ================= STATISTICS =================

  const activeCount = buses.filter(
    (bus) => bus.status === "Active"
  ).length;

  const maintenanceCount = buses.filter(
    (bus) => bus.status === "Maintenance"
  ).length;

  const inactiveCount = buses.filter(
    (bus) => bus.status === "Inactive"
  ).length;

  // ================= ADD BUS =================

  const openAddModal = () => {
    setEditingBus(null);

    setFormData({
      busNumber: "",
      busName: "",
      type: "Luxury",
      capacity: "",
      route: "",
      driver: "",
      status: "Active",
    });

    setShowModal(true);
  };

  // ================= EDIT BUS =================

  const openEditModal = (bus) => {
    setEditingBus(bus);

    setFormData({
      busNumber: bus.busNumber,
      busName: bus.busName,
      type: bus.type,
      capacity: bus.capacity,
      route: bus.route === "—" ? "" : bus.route,
      driver: bus.driver === "—" ? "" : bus.driver,
      status: bus.status,
    });

    setShowModal(true);
  };

  // ================= CLOSE MODAL =================

  const closeModal = () => {
    setShowModal(false);
    setEditingBus(null);
  };

  // ================= FORM CHANGE =================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ================= SAVE BUS =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.busNumber ||
      !formData.busName ||
      !formData.capacity
    ) {
      alert(
        "Please fill in Bus Number, Bus Name and Seat Capacity."
      );
      return;
    }

    const capacityNumber = Number(formData.capacity);

    if (
      isNaN(capacityNumber) ||
      capacityNumber <= 0
    ) {
      alert("Please enter a valid seat capacity.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const busData = {
      registrationNumber:
        formData.busNumber.trim(),

      busName:
        formData.busName.trim(),

      busType:
        formData.type,

      capacity:
        capacityNumber,

      status:
        formData.status === "Active"
          ? "ACTIVE"
          : formData.status === "Maintenance"
          ? "MAINTENANCE"
          : "INACTIVE",
    };

    try {
      let response;

      // ================= UPDATE =================

      if (editingBus) {
        response = await fetch(
          `http://localhost:8080/api/buses/${editingBus.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(busData),
          }
        );
      }

      // ================= CREATE =================

      else {
        response = await fetch(
          "http://localhost:8080/api/buses",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(busData),
          }
        );
      }

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        localStorage.removeItem("token");
        localStorage.removeItem("smartBusUser");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();

        console.error(
          "Backend error:",
          errorText
        );

        throw new Error(
          editingBus
            ? "Failed to update bus."
            : "Failed to add bus."
        );
      }

      if (editingBus) {
        alert(
          "Bus details updated successfully."
        );
      } else {
        alert(
          "New bus added successfully."
        );
      }

      closeModal();

      await loadBuses();

    } catch (error) {
      console.error(
        "Bus save error:",
        error
      );

      alert(error.message);
    }
  };

  // ================= DELETE BUS =================

  const handleDelete = async (id) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this bus?"
      );

    if (!confirmDelete) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/buses/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        localStorage.removeItem("token");
        localStorage.removeItem("smartBusUser");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        const errorText =
          await response.text();

        console.error(
          "Delete error:",
          errorText
        );

        throw new Error(
          "Unable to delete this bus."
        );
      }

      alert(
        "Bus deleted successfully."
      );

      await loadBuses();

    } catch (error) {
      console.error(
        "Bus delete error:",
        error
      );

      alert(error.message);
    }
  };

  // ================= STATUS CLASS =================

  const getStatusClass = (status) => {
    if (status === "Active") {
      return "active";
    }

    if (status === "Maintenance") {
      return "maintenance";
    }

    return "inactive";
  };

  // ================= LOGOUT =================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("smartBusUser");

    navigate("/login");
  };

  return (
    <div className="manage-buses-page">

      {/* ================= HEADER ================= */}

      <header className="bus-management-header">

        <div className="bus-header-left">

          <button
            className="back-admin-btn"
            onClick={() =>
              navigate("/admin-dashboard")
            }
          >
            <i className="bi bi-arrow-left"></i>
          </button>

          <div>
            <span>ADMIN MANAGEMENT</span>

            <h1>
              Manage Buses
            </h1>

            <p>
              Add, update and manage buses in the SmartBus system.
            </p>
          </div>

        </div>

        <button
          className="add-bus-btn"
          onClick={openAddModal}
        >
          <i className="bi bi-plus-lg"></i>
          Add New Bus
        </button>

      </header>

      {/* ================= MAIN ================= */}

      <main className="bus-management-content">

        {/* ================= STATISTICS ================= */}

        <section className="bus-stat-grid">

          <div className="bus-stat-card">

            <div className="bus-stat-icon total">
              <i className="bi bi-bus-front-fill"></i>
            </div>

            <div>
              <span>Total Buses</span>

              <strong>
                {buses.length}
              </strong>
            </div>

          </div>

          <div className="bus-stat-card">

            <div className="bus-stat-icon active-icon">
              <i className="bi bi-check-circle-fill"></i>
            </div>

            <div>
              <span>Active</span>

              <strong>
                {activeCount}
              </strong>
            </div>

          </div>

          <div className="bus-stat-card">

            <div className="bus-stat-icon maintenance-icon">
              <i className="bi bi-tools"></i>
            </div>

            <div>
              <span>Maintenance</span>

              <strong>
                {maintenanceCount}
              </strong>
            </div>

          </div>

          <div className="bus-stat-card">

            <div className="bus-stat-icon inactive-icon">
              <i className="bi bi-pause-circle-fill"></i>
            </div>

            <div>
              <span>Inactive</span>

              <strong>
                {inactiveCount}
              </strong>
            </div>

          </div>

        </section>

        {/* ================= BUS LIST ================= */}

        <section className="bus-list-section">

          <div className="bus-list-header">

            <div>

              <h2>
                Bus List
              </h2>

              <p>
                View and manage all registered buses.
              </p>

            </div>

            <div className="bus-filters">

              <div className="bus-search">

                <i className="bi bi-search"></i>

                <input
                  type="text"
                  placeholder="Search buses..."
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(
                      e.target.value
                    )
                  }
                />

              </div>

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value
                  )
                }
                className="status-filter"
              >

                <option value="All">
                  All Status
                </option>

                <option value="Active">
                  Active
                </option>

                <option value="Maintenance">
                  Maintenance
                </option>

                <option value="Inactive">
                  Inactive
                </option>

              </select>

            </div>

          </div>

          {/* ================= TABLE ================= */}

          <div className="bus-table-wrapper">

            <table className="bus-table">

              <thead>

                <tr>
                  <th>Bus</th>
                  <th>Type</th>
                  <th>Capacity</th>
                  <th>Route</th>
                  <th>Driver</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>

              </thead>

              <tbody>

                {loading ? (

                  <tr>

                    <td
                      colSpan="7"
                      className="no-buses"
                    >
                      Loading buses...
                    </td>

                  </tr>

                ) : filteredBuses.length > 0 ? (

                  filteredBuses.map((bus) => (

                    <tr key={bus.id}>

                      <td>

                        <div className="bus-name-cell">

                          <div className="bus-list-icon">

                            <i className="bi bi-bus-front-fill"></i>

                          </div>

                          <div>

                            <strong>
                              {bus.busName}
                            </strong>

                            <span>
                              {bus.busNumber}
                            </span>

                          </div>

                        </div>

                      </td>

                      <td>
                        {bus.type}
                      </td>

                      <td>

                        <span className="capacity">

                          <i className="bi bi-people-fill"></i>

                          {bus.capacity} seats

                        </span>

                      </td>

                      <td>
                        {bus.route}
                      </td>

                      <td>
                        {bus.driver}
                      </td>

                      <td>

                        <span
                          className={`bus-status ${getStatusClass(
                            bus.status
                          )}`}
                        >
                          {bus.status}
                        </span>

                      </td>

                      <td>

                        <div className="bus-actions">

                          <button
                            className="edit-bus-btn"
                            onClick={() =>
                              openEditModal(bus)
                            }
                            title="Edit"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>

                          <button
                            className="delete-bus-btn"
                            onClick={() =>
                              handleDelete(bus.id)
                            }
                            title="Delete"
                          >
                            <i className="bi bi-trash3"></i>
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>

                    <td
                      colSpan="7"
                      className="no-buses"
                    >

                      <i className="bi bi-search"></i>

                      <strong>
                        No buses found
                      </strong>

                      <span>
                        Try changing your search or filter.
                      </span>

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </section>

      </main>

      {/* ================= ADD / EDIT MODAL ================= */}

      {showModal && (

        <div
          className="bus-modal-overlay"
          onClick={closeModal}
        >

          <div
            className="bus-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="bus-modal-header">

              <div>

                <h2>
                  {editingBus
                    ? "Edit Bus"
                    : "Add New Bus"}
                </h2>

                <p>
                  {editingBus
                    ? "Update the bus information."
                    : "Enter the details of the new bus."}
                </p>

              </div>

              <button
                className="close-modal-btn"
                onClick={closeModal}
              >
                <i className="bi bi-x-lg"></i>
              </button>

            </div>

            <form
              className="bus-form"
              onSubmit={handleSubmit}
            >

              <div className="form-row">

                <div className="bus-form-field">

                  <label>
                    Bus Number <span>*</span>
                  </label>

                  <input
                    type="text"
                    name="busNumber"
                    placeholder="e.g. NB-1234"
                    value={formData.busNumber}
                    onChange={handleChange}
                  />

                </div>

                <div className="bus-form-field">

                  <label>
                    Bus Name <span>*</span>
                  </label>

                  <input
                    type="text"
                    name="busName"
                    placeholder="e.g. SmartBus Express"
                    value={formData.busName}
                    onChange={handleChange}
                  />

                </div>

              </div>

              <div className="form-row">

                <div className="bus-form-field">

                  <label>
                    Bus Type
                  </label>

                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                  >

                    <option value="Luxury">
                      Luxury
                    </option>

                    <option value="Semi Luxury">
                      Semi Luxury
                    </option>

                    <option value="Normal">
                      Normal
                    </option>

                  </select>

                </div>

                <div className="bus-form-field">

                  <label>
                    Seat Capacity <span>*</span>
                  </label>

                  <input
                    type="number"
                    name="capacity"
                    placeholder="e.g. 52"
                    min="1"
                    value={formData.capacity}
                    onChange={handleChange}
                  />

                </div>

              </div>

              <div className="bus-form-field">

                <label>
                  Route
                </label>

                <input
                  type="text"
                  name="route"
                  placeholder="Managed through Routes / Schedules"
                  value={formData.route}
                  onChange={handleChange}
                />

              </div>

              <div className="form-row">

                <div className="bus-form-field">

                  <label>
                    Driver
                  </label>

                  <input
                    type="text"
                    name="driver"
                    placeholder="Managed through Driver Assignments"
                    value={formData.driver}
                    onChange={handleChange}
                  />

                </div>

                <div className="bus-form-field">

                  <label>
                    Status
                  </label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >

                    <option value="Active">
                      Active
                    </option>

                    <option value="Maintenance">
                      Maintenance
                    </option>

                    <option value="Inactive">
                      Inactive
                    </option>

                  </select>

                </div>

              </div>

              <div className="bus-form-actions">

                <button
                  type="button"
                  className="cancel-bus-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-bus-btn"
                >

                  <i className="bi bi-check-lg"></i>

                  {editingBus
                    ? "Update Bus"
                    : "Add Bus"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};

export default ManageBuses;