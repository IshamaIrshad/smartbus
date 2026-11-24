
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ManageRoutes.css";

function ManageRoutes() {
  const navigate = useNavigate();

  const [routes, setRoutes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);

  const [formData, setFormData] = useState({
    routeCode: "",
    from: "",
    to: "",
    distance: "",
    duration: "",
    fare: "",
    status: "Active",
  });

  const [loading, setLoading] = useState(true);

  // ==============================
  // LOAD ROUTES FROM BACKEND
  // ==============================
  useEffect(() => {
    loadRoutes();
  }, []);

  const loadRoutes = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:8080/api/routes",
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
        throw new Error("Failed to load routes.");
      }

      const data = await response.json();

      const formattedRoutes = data.map((route, index) => {
        const routeName = route.routeName || "";

        let from = routeName;
        let to = "";

        if (routeName.toLowerCase().includes(" to ")) {
          const parts = routeName.split(/\s+to\s+/i);

          from = parts[0]?.trim() || "";
          to = parts[1]?.trim() || "";
        }

        return {
          id: route.routeId,
          routeCode: `RT${String(index + 1).padStart(3, "0")}`,
          from,
          to,
          distance:
            route.distance !== null &&
            route.distance !== undefined
              ? `${route.distance} km`
              : "—",
          duration: "—",
          fare: "—",
          status:
            route.status?.toUpperCase() === "ACTIVE"
              ? "Active"
              : "Inactive",
        };
      });

      setRoutes(formattedRoutes);
    } catch (error) {
      console.error("Error loading routes:", error);
      alert("Unable to load routes.");
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // SEARCH + FILTER
  // ==============================
  const filteredRoutes = routes.filter((route) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      route.routeCode.toLowerCase().includes(search) ||
      route.from.toLowerCase().includes(search) ||
      route.to.toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === "All" ||
      route.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const activeRoutes = routes.filter(
    (route) => route.status === "Active"
  ).length;

  const inactiveRoutes = routes.filter(
    (route) => route.status === "Inactive"
  ).length;

  // ==============================
  // ADD MODAL
  // ==============================
  const openAddModal = () => {
    setEditingRoute(null);

    setFormData({
      routeCode: "",
      from: "",
      to: "",
      distance: "",
      duration: "",
      fare: "",
      status: "Active",
    });

    setShowModal(true);
  };

  // ==============================
  // EDIT MODAL
  // ==============================
  const openEditModal = (route) => {
    setEditingRoute(route);

    setFormData({
      routeCode: route.routeCode,
      from: route.from,
      to: route.to,
      distance: route.distance.replace(" km", ""),
      duration: route.duration === "—" ? "" : route.duration,
      fare: route.fare === "—" ? "" : route.fare,
      status: route.status,
    });

    setShowModal(true);
  };

  // ==============================
  // CLOSE MODAL
  // ==============================
  const closeModal = () => {
    setShowModal(false);
    setEditingRoute(null);
  };

  // ==============================
  // FORM CHANGE
  // ==============================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==============================
  // ADD / UPDATE ROUTE
  // ==============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.routeCode ||
      !formData.from ||
      !formData.to ||
      !formData.distance
    ) {
      alert(
        "Please fill in Route Code, Starting Point, Destination and Distance."
      );
      return;
    }

    if (
      formData.from.trim().toLowerCase() ===
      formData.to.trim().toLowerCase()
    ) {
      alert(
        "Starting point and destination cannot be the same."
      );
      return;
    }

    const distanceNumber = Number(formData.distance);

    if (isNaN(distanceNumber) || distanceNumber <= 0) {
      alert("Please enter a valid distance.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const routeData = {
      routeName: `${formData.from.trim()} to ${formData.to.trim()}`,
      distance: distanceNumber,
      status:
        formData.status === "Active"
          ? "ACTIVE"
          : "INACTIVE",
    };

    try {
      let response;

      if (editingRoute) {
        response = await fetch(
          `http://localhost:8080/api/routes/${editingRoute.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(routeData),
          }
        );
      } else {
        response = await fetch(
          "http://localhost:8080/api/routes",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(routeData),
          }
        );
      }

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("smartBusUser");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Backend error:", errorText);

        throw new Error(
          editingRoute
            ? "Failed to update route."
            : "Failed to add route."
        );
      }

      if (editingRoute) {
        alert("Route updated successfully.");
      } else {
        alert("Route added successfully.");
      }

      closeModal();

      await loadRoutes();
    } catch (error) {
      console.error("Route save error:", error);
      alert(error.message);
    }
  };

  // ==============================
  // DELETE ROUTE
  // ==============================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this route?"
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
        `http://localhost:8080/api/routes/${id}`,
        {
          method: "DELETE",
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
        const errorText = await response.text();
        console.error("Delete error:", errorText);

        throw new Error(
          "Unable to delete this route."
        );
      }

      alert("Route deleted successfully.");

      await loadRoutes();
    } catch (error) {
      console.error("Route delete error:", error);
      alert(error.message);
    }
  };

  // ==============================
  // LOGOUT
  // ==============================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("smartBusUser");
    navigate("/login");
  };

  return (
    <div className="manage-routes-page">

      {/* Sidebar */}
      <aside className="routes-sidebar">

        <div className="routes-logo">
          <div className="routes-logo-icon">
            <i className="bi bi-bus-front-fill"></i>
          </div>

          <div>
            <h2>SmartBus</h2>
            <span>Admin Panel</span>
          </div>
        </div>

        <nav className="routes-navigation">

          <p className="routes-nav-title">
            MAIN MENU
          </p>

          <button
            className="routes-nav-item"
            onClick={() => navigate("/admin-dashboard")}
          >
            <i className="bi bi-grid-1x2-fill"></i>
            <span>Dashboard</span>
          </button>

          <button
            className="routes-nav-item"
            onClick={() => navigate("/manage-buses")}
          >
            <i className="bi bi-bus-front"></i>
            <span>Buses</span>
          </button>

          <button className="routes-nav-item active">
            <i className="bi bi-signpost-2"></i>
            <span>Routes</span>
          </button>

          {/* UPDATED: Schedules Navigation */}
          <button
            className="routes-nav-item"
            onClick={() => navigate("/manage-schedules")}
          >
            <i className="bi bi-calendar3"></i>
            <span>Schedules</span>
          </button>

          <button
            className="routes-nav-item"
            onClick={() => navigate("/manage-bookings")}
          >
            <i className="bi bi-ticket-perforated"></i>
            <span>Bookings</span>
          </button>

          <p className="routes-nav-title routes-second-title">
            MANAGEMENT
          </p>

          {/* UPDATED: Passengers Navigation */}
          <button
            className="routes-nav-item"
            onClick={() => navigate("/manage-passengers")}
          >
            <i className="bi bi-people"></i>
            <span>Passengers</span>
          </button>

          {/* UPDATED: Staff Navigation */}
          <button
            className="routes-nav-item"
            onClick={() => navigate("/manage-staff")}
          >
            <i className="bi bi-person-badge"></i>
            <span>Staff</span>
          </button>

        </nav>

        <div className="routes-sidebar-bottom">

          <button
            className="routes-website-btn"
            onClick={() => navigate("/")}
          >
            <i className="bi bi-globe2"></i>
            <span>View Website</span>
          </button>

          <button
            className="routes-logout-btn"
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-right"></i>
            <span>Logout</span>
          </button>

        </div>

      </aside>

      {/* Main */}
      <main className="routes-main">

        {/* Top Bar */}
        <header className="routes-topbar">

          <div className="routes-topbar-left">

            <button
              className="routes-mobile-menu"
              onClick={() => {
                const sidebar =
                  document.querySelector(".routes-sidebar");

                sidebar?.classList.toggle("show");
              }}
            >
              <i className="bi bi-list"></i>
            </button>

            <div>
              <h1>Manage Routes</h1>
              <p>Create and manage SmartBus routes</p>
            </div>

          </div>

          <div className="routes-admin-user">

            <div className="routes-admin-avatar">
              <i className="bi bi-person-fill"></i>
            </div>

            <div>
              <strong>Administrator</strong>
              <span>Admin</span>
            </div>

          </div>

        </header>

        {/* Content */}
        <section className="routes-content">

          {/* Page Header */}
          <div className="routes-page-header">

            <div>
              <h2>Bus Routes</h2>
              <p>
                Add, edit and manage the routes
                available in SmartBus.
              </p>
            </div>

            <button
              className="add-route-btn"
              onClick={openAddModal}
            >
              <i className="bi bi-plus-lg"></i>
              Add New Route
            </button>

          </div>

          {/* Statistics */}
          <div className="routes-stats">

            <div className="route-stat-card">
              <div className="route-stat-icon total">
                <i className="bi bi-signpost-2-fill"></i>
              </div>

              <div>
                <span>Total Routes</span>
                <h3>{routes.length}</h3>
              </div>
            </div>

            <div className="route-stat-card">
              <div className="route-stat-icon active">
                <i className="bi bi-check-circle-fill"></i>
              </div>

              <div>
                <span>Active Routes</span>
                <h3>{activeRoutes}</h3>
              </div>
            </div>

            <div className="route-stat-card">
              <div className="route-stat-icon inactive">
                <i className="bi bi-pause-circle-fill"></i>
              </div>

              <div>
                <span>Inactive Routes</span>
                <h3>{inactiveRoutes}</h3>
              </div>
            </div>

          </div>

          {/* Search and Filter */}
          <div className="routes-tools">

            <div className="route-search">
              <i className="bi bi-search"></i>

              <input
                type="text"
                placeholder="Search by route code, starting point or destination..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="route-filter">
              <i className="bi bi-funnel"></i>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

          </div>

          {/* Route Table */}
          <div className="routes-table-card">

            <div className="routes-table-header">
              <div>
                <h3>All Routes</h3>
                <p>
                  Showing {filteredRoutes.length} of{" "}
                  {routes.length} routes
                </p>
              </div>
            </div>

            <div className="routes-table-wrapper">

              <table className="routes-table">

                <thead>
                  <tr>
                    <th>Route Code</th>
                    <th>Starting Point</th>
                    <th>Destination</th>
                    <th>Distance</th>
                    <th>Duration</th>
                    <th>Fare</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>

                  {loading ? (
                    <tr>
                      <td colSpan="8" className="no-routes">
                        <p>Loading routes...</p>
                      </td>
                    </tr>
                  ) : filteredRoutes.length > 0 ? (

                    filteredRoutes.map((route) => (

                      <tr key={route.id}>

                        <td>
                          <strong className="route-code">
                            {route.routeCode}
                          </strong>
                        </td>

                        <td>
                          <div className="location-cell">
                            <i className="bi bi-geo-alt"></i>
                            <span>{route.from}</span>
                          </div>
                        </td>

                        <td>
                          <div className="location-cell destination">
                            <i className="bi bi-geo-alt-fill"></i>
                            <span>{route.to}</span>
                          </div>
                        </td>

                        <td>{route.distance}</td>
                        <td>{route.duration}</td>

                        <td>
                          <strong>{route.fare}</strong>
                        </td>

                        <td>
                          <span
                            className={`route-status ${
                              route.status === "Active"
                                ? "active"
                                : "inactive"
                            }`}
                          >
                            <span></span>
                            {route.status}
                          </span>
                        </td>

                        <td>
                          <div className="route-actions">

                            <button
                              className="route-edit-btn"
                              onClick={() => openEditModal(route)}
                              title="Edit Route"
                            >
                              <i className="bi bi-pencil"></i>
                            </button>

                            <button
                              className="route-delete-btn"
                              onClick={() => handleDelete(route.id)}
                              title="Delete Route"
                            >
                              <i className="bi bi-trash3"></i>
                            </button>

                          </div>
                        </td>

                      </tr>

                    ))

                  ) : (

                    <tr>
                      <td colSpan="8" className="no-routes">
                        <i className="bi bi-signpost-2"></i>
                        <p>No routes found.</p>
                      </td>
                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          </div>

          {/* Back */}
          <button
            className="back-dashboard-btn"
            onClick={() => navigate("/admin-dashboard")}
          >
            <i className="bi bi-arrow-left"></i>
            Back to Dashboard
          </button>

        </section>

      </main>

      {/* Add/Edit Modal */}
      {showModal && (

        <div
          className="route-modal-overlay"
          onClick={closeModal}
        >

          <div
            className="route-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="route-modal-header">

              <div>
                <h2>
                  {editingRoute
                    ? "Edit Route"
                    : "Add New Route"}
                </h2>

                <p>
                  {editingRoute
                    ? "Update the route information."
                    : "Enter the details for the new route."}
                </p>
              </div>

              <button
                className="route-modal-close"
                onClick={closeModal}
              >
                <i className="bi bi-x-lg"></i>
              </button>

            </div>

            <form onSubmit={handleSubmit}>

              <div className="route-form-grid">

                <div className="route-form-group">
                  <label>Route Code</label>

                  <div className="route-input-wrapper">
                    <i className="bi bi-hash"></i>

                    <input
                      type="text"
                      name="routeCode"
                      placeholder="e.g. RT006"
                      value={formData.routeCode}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="route-form-group">
                  <label>Starting Point</label>

                  <div className="route-input-wrapper">
                    <i className="bi bi-geo-alt"></i>

                    <input
                      type="text"
                      name="from"
                      placeholder="e.g. Colombo"
                      value={formData.from}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="route-form-group">
                  <label>Destination</label>

                  <div className="route-input-wrapper">
                    <i className="bi bi-geo-alt-fill"></i>

                    <input
                      type="text"
                      name="to"
                      placeholder="e.g. Kandy"
                      value={formData.to}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="route-form-group">
                  <label>Distance (km)</label>

                  <div className="route-input-wrapper">
                    <i className="bi bi-signpost"></i>

                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      name="distance"
                      placeholder="e.g. 115"
                      value={formData.distance}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="route-form-group">
                  <label>Travel Duration</label>

                  <div className="route-input-wrapper">
                    <i className="bi bi-clock"></i>

                    <input
                      type="text"
                      name="duration"
                      placeholder="e.g. 3 hrs"
                      value={formData.duration}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="route-form-group">
                  <label>Fare</label>

                  <div className="route-input-wrapper">
                    <i className="bi bi-cash"></i>

                    <input
                      type="text"
                      name="fare"
                      placeholder="e.g. Rs. 1,500"
                      value={formData.fare}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="route-form-group">
                  <label>Status</label>

                  <div className="route-input-wrapper">
                    <i className="bi bi-toggle-on"></i>

                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

              </div>

              <div className="route-modal-actions">

                <button
                  type="button"
                  className="route-cancel-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="route-save-btn"
                >
                  <i
                    className={
                      editingRoute
                        ? "bi bi-check-lg"
                        : "bi bi-plus-lg"
                    }
                  ></i>

                  {editingRoute
                    ? "Update Route"
                    : "Add Route"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default ManageRoutes;
