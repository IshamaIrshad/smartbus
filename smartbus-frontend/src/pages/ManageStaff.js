import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ManageStaff.css";
import StaffAssignmentsPanel from "./StaffAssignmentsPanel";

const API_URL = "http://localhost:8080/api/admin/staff";

const emptyForm = {
  name: "",
  email: "",
  password: "",
  phone: "",
  gender: "",
  role: "DRIVER",
  licenseNo: "",
};

function ManageStaff() {
  const navigate = useNavigate();

  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [showForm, setShowForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [formData, setFormData] = useState({ ...emptyForm });
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [nextEmployeeId, setNextEmployeeId] = useState("");
  const [selectedStaff, setSelectedStaff] = useState(null);

  const getToken = () => localStorage.getItem("token");

  const handleUnauthorized = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("smartBusUser");
    navigate("/login");
  };

  const fetchStaff = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setPageError("");

      const response = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        throw new Error("Unable to load staff. Check Admin permissions.");
      }

      const data = await response.json();
      setStaffList(
        Array.isArray(data)
          ? data.map((item) => ({
              ...item,
              role: (item.role || "").toUpperCase(),
              status: item.status || "Active",
              name: item.name || "—",
              email: item.email || "—",
              phone: item.phone || "—",
              employeeId: item.employeeId || "",
              licenseNo: item.licenseNo || "",
              gender: item.gender || "—",
            }))
          : []
      );
    } catch (error) {
      setPageError(error.message || "Unable to load staff.");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const fetchNextEmployeeId = async () => {
    setNextEmployeeId("");

    try {
      const response = await fetch(`${API_URL}/next-employee-id`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setNextEmployeeId(data.employeeId || "");
      }
    } catch (error) {
      console.error("Employee number preview:", error);
    }
  };

  const openAddForm = () => {
    setEditingStaff(null);
    setFormData({ ...emptyForm });
    setFormError("");
    setShowForm(true);
    fetchNextEmployeeId();
  };

  const openEditForm = (staff) => {
    if (staff.role === "ADMIN") return;

    setEditingStaff(staff);
    setFormData({
      ...emptyForm,
      name: staff.name === "—" ? "" : staff.name,
      email: staff.email === "—" ? "" : staff.email,
      phone: staff.phone === "—" ? "" : staff.phone,
      gender: staff.gender === "—" ? "" : staff.gender,
      role: staff.role,
      licenseNo: staff.licenseNo,
    });
    setNextEmployeeId(staff.employeeId);
    setFormError("");
    setShowForm(true);
  };

  const closeForm = () => {
    if (saving) return;
    setShowForm(false);
    setEditingStaff(null);
    setFormData({ ...emptyForm });
    setFormError("");
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const saveStaff = async (event) => {
    event.preventDefault();
    setFormError("");

    if (!formData.name.trim() || !formData.email.trim()) {
      setFormError("Please enter the staff member's name and email.");
      return;
    }

    if (!editingStaff && formData.password.length < 8) {
      setFormError("Password must contain at least 8 characters.");
      return;
    }

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      gender: formData.gender,
      role: formData.role,
      licenseNo: formData.licenseNo.trim(),
    };

    if (!editingStaff) {
      payload.password = formData.password;
    }

    try {
      setSaving(true);

      const response = await fetch(
        editingStaff
          ? `${API_URL}/${editingStaff.userId}`
          : API_URL,
        {
          method: editingStaff ? "PUT" : "POST",
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        let message = "Unable to save staff details.";
        try {
          const errorData = await response.json();
          message = errorData.message || errorData.error || message;
        } catch {
          // Use default message.
        }
        throw new Error(message);
      }

      setShowForm(false);
      setEditingStaff(null);
      setFormData({ ...emptyForm });
      await fetchStaff();
    } catch (error) {
      setFormError(error.message || "Unable to save staff.");
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (staff) => {
    if (staff.role === "ADMIN") return;

    const newStatus =
      staff.status.toLowerCase() === "active" ? "Inactive" : "Active";

    if (!window.confirm(`Change ${staff.name}'s status to ${newStatus}?`)) {
      return;
    }

    try {
      setPageError("");

      const response = await fetch(
        `${API_URL}/${staff.userId}/status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        throw new Error("Unable to update staff status.");
      }

      await fetchStaff();
    } catch (error) {
      setPageError(error.message || "Unable to update staff status.");
    }
  };

  // REMOVE STAFF: defined inside ManageStaff, before return.
  const removeStaff = async (staff) => {
    if (staff.role === "ADMIN") return;

    if (
      !window.confirm(
        `Remove ${staff.name} from active staff? Their record will be retained and marked Inactive.`
      )
    ) {
      return;
    }

    try {
      setPageError("");

      const response = await fetch(`${API_URL}/${staff.userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        throw new Error("Unable to remove staff member.");
      }

      setSelectedStaff(null);
      await fetchStaff();
    } catch (error) {
      setPageError(error.message || "Unable to remove staff.");
    }
  };

  const filteredStaff = staffList.filter((staff) => {
    const term = searchTerm.trim().toLowerCase();

    const matchesSearch =
      !term ||
      staff.name.toLowerCase().includes(term) ||
      staff.email.toLowerCase().includes(term) ||
      staff.employeeId.toLowerCase().includes(term) ||
      String(staff.userId).includes(term);

    const matchesRole =
      roleFilter === "ALL" || staff.role === roleFilter;

    const matchesStatus =
      statusFilter === "ALL" ||
      staff.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesRole && matchesStatus;
  });

  const staffMembers = staffList.filter(
    (staff) => staff.role === "DRIVER" || staff.role === "CONDUCTOR"
  );

  const activeCount = staffMembers.filter(
    (staff) => staff.status.toLowerCase() === "active"
  ).length;

  const driverCount = staffList.filter(
    (staff) => staff.role === "DRIVER"
  ).length;

  const conductorCount = staffList.filter(
    (staff) => staff.role === "CONDUCTOR"
  ).length;

  const formatRole = (role) =>
    role ? role.charAt(0) + role.slice(1).toLowerCase() : "Unknown";

  return (
    <div className="staff-page">
      <header className="staff-header">
        <div className="staff-header-left">
          <button
            type="button"
            className="staff-back-btn"
            onClick={() => navigate("/admin-dashboard")}
            title="Back to Dashboard"
          >
            <i className="bi bi-arrow-left"></i>
          </button>

          <div>
            <h1>Manage Staff</h1>
            <p>View and manage SmartBus drivers and conductors.</p>
          </div>
        </div>

        <button
          type="button"
          className="staff-dashboard-btn"
          onClick={() => navigate("/admin-dashboard")}
        >
          <i className="bi bi-grid-1x2-fill"></i> Dashboard
        </button>
      </header>

      <main className="staff-content">
        {pageError && (
          <div className="staff-form-error" role="alert">
            {pageError}
            <button type="button" onClick={() => setPageError("")}>
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
        )}

        <div className="staff-summary-grid">
          <div className="staff-summary-card">
            <div className="staff-summary-icon total">
              <i className="bi bi-people-fill"></i>
            </div>
            <div>
              <span>Total Staff</span>
              <h2>{staffMembers.length}</h2>
            </div>
          </div>

          <div className="staff-summary-card">
            <div className="staff-summary-icon active">
              <i className="bi bi-person-check-fill"></i>
            </div>
            <div>
              <span>Active Staff</span>
              <h2>{activeCount}</h2>
            </div>
          </div>

          <div className="staff-summary-card">
            <div className="staff-summary-icon driver">
              <i className="bi bi-person-vcard-fill"></i>
            </div>
            <div>
              <span>Drivers</span>
              <h2>{driverCount}</h2>
            </div>
          </div>

          <div className="staff-summary-card">
            <div className="staff-summary-icon conductor">
              <i className="bi bi-person-badge-fill"></i>
            </div>
            <div>
              <span>Conductors</span>
              <h2>{conductorCount}</h2>
            </div>
          </div>
        </div>

        <StaffAssignmentsPanel />

        <section className="staff-section">
          <div className="staff-section-heading">
            <div className="staff-heading-actions">
              <div>
                <h2>Staff List</h2>
                <p>Search and manage staff accounts.</p>
              </div>

              <button
                type="button"
                className="staff-add-btn"
                onClick={openAddForm}
              >
                <i className="bi bi-person-plus-fill"></i> Add Staff
              </button>
            </div>
          </div>

          <div className="staff-filters">
            <div className="staff-search">
              <i className="bi bi-search"></i>
              <input
                type="text"
                placeholder="Search by name, email or employee number..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>

            <select
              aria-label="Filter by role"
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value)}
            >
              <option value="ALL">All Roles</option>
              <option value="DRIVER">Driver</option>
              <option value="CONDUCTOR">Conductor</option>
              <option value="ADMIN">Admin</option>
            </select>

            <select
              aria-label="Filter by status"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {loading ? (
            <div className="staff-empty">
              <i className="bi bi-hourglass-split"></i>
              <h3>Loading staff...</h3>
            </div>
          ) : filteredStaff.length === 0 ? (
            <div className="staff-empty">
              <i className="bi bi-person-x"></i>
              <h3>No staff found</h3>
              <p>Try changing your search or filters.</p>
            </div>
          ) : (
            <div className="staff-table-wrapper">
              <table className="staff-table">
                <thead>
                  <tr>
                    <th>Staff Member</th>
                    <th>Employee No.</th>
                    <th>Role</th>
                    <th>Contact</th>
                    <th>License No.</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredStaff.map((staff) => (
                    <tr key={staff.userId}>
                      <td>
                        <div className="staff-profile">
                          <div className="staff-avatar">
                            {staff.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <strong>{staff.name}</strong>
                            <span>ID: {staff.userId}</span>
                          </div>
                        </div>
                      </td>

                      <td>{staff.employeeId || "—"}</td>

                      <td>
                        <span className={`role-badge ${staff.role.toLowerCase()}`}>
                          {formatRole(staff.role)}
                        </span>
                      </td>

                      <td>
                        <div className="staff-contact">
                          <span>
                            <i className="bi bi-envelope"></i> {staff.email}
                          </span>
                          <span>
                            <i className="bi bi-telephone"></i> {staff.phone}
                          </span>
                        </div>
                      </td>

                      <td>{staff.licenseNo || "—"}</td>

                      <td>
                        <span
                          className={`staff-status ${
                            staff.status.toLowerCase() === "active"
                              ? "active"
                              : "inactive"
                          }`}
                        >
                          <i className="bi bi-circle-fill"></i>
                          {staff.status}
                        </span>
                      </td>

                      <td>
                        <div className="staff-actions">
                          <button
                            type="button"
                            className="staff-action-btn view"
                            title="View Details"
                            aria-label="View Details"
                            onClick={() => setSelectedStaff(staff)}
                          >
                            <i className="bi bi-eye"></i>
                          </button>

                          <button
                            type="button"
                            className="staff-action-btn status"
                            title="Edit Staff"
                            aria-label="Edit Staff"
                            onClick={() => openEditForm(staff)}
                            disabled={staff.role === "ADMIN"}
                          >
                            <i className="bi bi-pencil-square"></i>
                          </button>

                          <button
                            type="button"
                            className="staff-action-btn status"
                            title={
                              staff.status.toLowerCase() === "active"
                                ? "Deactivate Staff"
                                : "Activate Staff"
                            }
                            aria-label="Change Staff Status"
                            onClick={() => toggleStatus(staff)}
                            disabled={staff.role === "ADMIN"}
                          >
                            <i className="bi bi-arrow-repeat"></i>
                          </button>

                          <button
                            type="button"
                            className="staff-action-btn delete"
                            title="Remove Staff"
                            aria-label="Remove Staff"
                            onClick={() => removeStaff(staff)}
                            disabled={staff.role === "ADMIN"}
                          >
                            <i className="bi bi-trash3"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {showForm && (
        <div className="staff-modal-overlay">
          <div
            className="staff-modal staff-form-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="staff-form-title"
          >
            <div className="staff-modal-header">
              <div>
                <h2 id="staff-form-title">
                  {editingStaff ? "Edit Staff" : "Add Staff"}
                </h2>
                <p>
                  {editingStaff
                    ? "Update staff information."
                    : "Create a Driver or Conductor account."}
                </p>
              </div>
              <button type="button" onClick={closeForm} disabled={saving}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <form onSubmit={saveStaff}>
              <div className="staff-form-grid">
                <label className="staff-form-field">
                  Full Name *
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </label>

                <label className="staff-form-field">
                  Email Address *
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </label>

                {!editingStaff && (
                  <label className="staff-form-field">
                    Password *
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      minLength={8}
                      autoComplete="new-password"
                      required
                    />
                  </label>
                )}

                <label className="staff-form-field">
                  Phone Number
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </label>

                <label className="staff-form-field">
                  Gender
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </label>

                <label className="staff-form-field">
                  Role *
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    disabled={Boolean(editingStaff)}
                    required
                  >
                    <option value="DRIVER">Driver</option>
                    <option value="CONDUCTOR">Conductor</option>
                  </select>
                </label>

                <label className="staff-form-field">
                  Employee Number
                  <input
                    value={
                      editingStaff
                        ? editingStaff.employeeId || "Not assigned"
                        : nextEmployeeId || "Generated automatically"
                    }
                    readOnly
                  />
                </label>

                <label className="staff-form-field">
                  License Number
                  <input
                    name="licenseNo"
                    value={formData.licenseNo}
                    onChange={handleInputChange}
                  />
                </label>
              </div>

              {formError && (
                <p className="staff-form-error" role="alert">
                  {formError}
                </p>
              )}

              <div className="staff-form-actions">
                <button
                  type="button"
                  className="staff-form-cancel"
                  onClick={closeForm}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="staff-add-btn"
                  disabled={saving}
                >
                  {saving ? "Saving..." : editingStaff ? "Save Changes" : "Create Staff"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedStaff && (
        <div
          className="staff-modal-overlay"
          onClick={() => setSelectedStaff(null)}
        >
          <div
            className="staff-modal"
            role="dialog"
            aria-modal="true"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="staff-modal-header">
              <div>
                <h2>Staff Details</h2>
                <p>Staff account information.</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStaff(null)}
                aria-label="Close details"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className="staff-modal-profile">
              <div className="modal-staff-avatar">
                {selectedStaff.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3>{selectedStaff.name}</h3>
                <span>{formatRole(selectedStaff.role)}</span>
              </div>
            </div>

            <div className="staff-details-grid">
              <div>
                <span>Employee Number</span>
                <strong>{selectedStaff.employeeId || "—"}</strong>
              </div>
              <div>
                <span>User ID</span>
                <strong>{selectedStaff.userId}</strong>
              </div>
              <div>
                <span>Email</span>
                <strong>{selectedStaff.email}</strong>
              </div>
              <div>
                <span>Phone</span>
                <strong>{selectedStaff.phone}</strong>
              </div>
              <div>
                <span>Gender</span>
                <strong>{selectedStaff.gender}</strong>
              </div>
              <div>
                <span>License Number</span>
                <strong>{selectedStaff.licenseNo || "—"}</strong>
              </div>
              <div>
                <span>Status</span>
                <strong>{selectedStaff.status}</strong>
              </div>
            </div>

            <button
              type="button"
              className="staff-modal-close"
              onClick={() => setSelectedStaff(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageStaff;