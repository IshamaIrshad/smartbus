
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ManageStaff.css";

const API_URL = "http://localhost:8080/api/admin/staff-assignments";

const emptyData = {
  schedules: [],
  drivers: [],
  conductors: [],
  driverAssignments: [],
  conductorAssignments: [],
};

function StaffAssignmentsPanel() {
  const navigate = useNavigate();

  const [data, setData] = useState(emptyData);
  const [staffRole, setStaffRole] = useState("DRIVER");
  const [scheduleId, setScheduleId] = useState("");
  const [staffId, setStaffId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getToken = () => localStorage.getItem("token");

  const handleUnauthorized = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("smartBusUser");
    navigate("/login");
  };

  const requestErrorMessage = async (response, fallback) => {
    try {
      const body = await response.json();
      return body.message || body.error || fallback;
    } catch {
      return fallback;
    }
  };

  const loadData = useCallback(async () => {
    const token = getToken();

    if (!token) {
      navigate("/login");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (response.status === 403) {
        throw new Error(
          "Access denied. Please log in with an administrator account."
        );
      }

      if (!response.ok) {
        throw new Error(
          await requestErrorMessage(response, "Unable to load assignments.")
        );
      }

      const result = await response.json();

      setData({
        schedules: result.schedules || [],
        drivers: result.drivers || [],
        conductors: result.conductors || [],
        driverAssignments: result.driverAssignments || [],
        conductorAssignments: result.conductorAssignments || [],
      });
    } catch (err) {
      setError(err.message || "Unable to load assignment data.");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const isDriver = staffRole === "DRIVER";

  const staffOptions = isDriver ? data.drivers : data.conductors;

  const assignments = isDriver
    ? data.driverAssignments
    : data.conductorAssignments;

  const assignedScheduleIds = useMemo(
    () => new Set(assignments.map((item) => Number(item.scheduleId))),
    [assignments]
  );

  const availableSchedules = data.schedules.filter(
    (schedule) => !assignedScheduleIds.has(Number(schedule.scheduleId))
  );

  useEffect(() => {
    setScheduleId("");
    setStaffId("");
    setError("");
    setSuccess("");
  }, [staffRole]);

  const formatDate = (date) => {
    if (!date) return "—";

    const parts = date.split("-");
    if (parts.length !== 3) return date;

    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  };

  const formatTime = (time) => {
    if (!time) return "—";
    return time.substring(0, 5);
  };

  const getScheduleLabel = (schedule) => {
    const route = schedule.routeName || "Route";
    const bus = schedule.busName || schedule.registrationNumber || "Bus";

    return `Schedule #${schedule.scheduleId} | ${route} | ${bus} | ${formatDate(
      schedule.travelDate
    )} ${formatTime(schedule.departureTime)}`;
  };

  const handleAssign = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!scheduleId || !staffId) {
      setError("Please select a schedule and a staff member.");
      return;
    }

    try {
      setSaving(true);

      const endpoint = isDriver ? "drivers" : "conductors";

      const response = await fetch(`${API_URL}/${endpoint}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scheduleId: Number(scheduleId),
          staffId: Number(staffId),
        }),
      });

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (response.status === 403) {
        throw new Error("Only an administrator can assign staff.");
      }

      if (!response.ok) {
        throw new Error(
          await requestErrorMessage(
            response,
            `Unable to assign ${isDriver ? "driver" : "conductor"}.`
          )
        );
      }

      setSuccess(
        `${isDriver ? "Driver" : "Conductor"} assigned successfully.`
      );
      setScheduleId("");
      setStaffId("");

      await loadData();
    } catch (err) {
      setError(err.message || "Unable to create assignment.");
    } finally {
      setSaving(false);
    }
  };

  const removeAssignment = async (assignment) => {
    const roleName = isDriver ? "driver" : "conductor";

    if (
      !window.confirm(
        `Remove ${assignment.staffName || roleName} from schedule #${assignment.scheduleId}?`
      )
    ) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      setDeletingId(assignment.assignmentId);

      const endpoint = isDriver ? "drivers" : "conductors";

      const response = await fetch(
        `${API_URL}/${endpoint}/${assignment.assignmentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (response.status === 403) {
        throw new Error("Only an administrator can remove assignments.");
      }

      if (!response.ok) {
        throw new Error(
          await requestErrorMessage(response, "Unable to remove assignment.")
        );
      }

      setSuccess("Assignment removed successfully.");
      await loadData();
    } catch (err) {
      setError(err.message || "Unable to remove assignment.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="staff-section staff-assignments-section">
      <div className="staff-section-heading">
        <div>
          <h2>Staff Assignments</h2>
          <p>Assign drivers and conductors to bus schedules.</p>
        </div>
      </div>

      {error && (
        <div className="staff-assignment-alert error" role="alert">
          <i className="bi bi-exclamation-circle-fill"></i> {error}
        </div>
      )}

      {success && (
        <div className="staff-assignment-alert success" role="status">
          <i className="bi bi-check-circle-fill"></i> {success}
        </div>
      )}

      <div className="staff-assignment-tabs">
        <button
          type="button"
          className={isDriver ? "selected" : ""}
          onClick={() => setStaffRole("DRIVER")}
        >
          <i className="bi bi-person-vcard-fill"></i>
          Driver Assignments ({data.driverAssignments.length})
        </button>

        <button
          type="button"
          className={!isDriver ? "selected" : ""}
          onClick={() => setStaffRole("CONDUCTOR")}
        >
          <i className="bi bi-person-badge-fill"></i>
          Conductor Assignments ({data.conductorAssignments.length})
        </button>
      </div>

      <form className="staff-assignment-form" onSubmit={handleAssign}>
        <label className="staff-form-field">
          Staff Role
          <select
            value={staffRole}
            onChange={(event) => setStaffRole(event.target.value)}
          >
            <option value="DRIVER">Driver</option>
            <option value="CONDUCTOR">Conductor</option>
          </select>
        </label>

        <label className="staff-form-field">
          Bus Schedule
          <select
            value={scheduleId}
            onChange={(event) => setScheduleId(event.target.value)}
            required
            disabled={loading || availableSchedules.length === 0}
          >
            <option value="">
              {loading
                ? "Loading schedules..."
                : availableSchedules.length === 0
                ? "No unassigned schedules"
                : "Select a schedule"}
            </option>

            {availableSchedules.map((schedule) => (
              <option
                key={schedule.scheduleId}
                value={schedule.scheduleId}
              >
                {getScheduleLabel(schedule)}
              </option>
            ))}
          </select>
        </label>

        <label className="staff-form-field">
          {isDriver ? "Select Driver" : "Select Conductor"}
          <select
            value={staffId}
            onChange={(event) => setStaffId(event.target.value)}
            required
            disabled={loading || staffOptions.length === 0}
          >
            <option value="">
              {loading
                ? "Loading staff..."
                : staffOptions.length === 0
                ? `No ${isDriver ? "drivers" : "conductors"} found`
                : `Select ${isDriver ? "a driver" : "a conductor"}`}
            </option>

            {staffOptions.map((staff) => (
              <option key={staff.userId} value={staff.userId}>
                {staff.name || "Unnamed staff"}
                {staff.employeeId ? ` (${staff.employeeId})` : ""}
              </option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          className="staff-add-btn"
          disabled={
            loading ||
            saving ||
            availableSchedules.length === 0 ||
            staffOptions.length === 0
          }
        >
          <i className="bi bi-person-check-fill"></i>{" "}
          {saving ? "Assigning..." : "Assign Staff"}
        </button>
      </form>

      <p className="staff-assignment-note">
        Only schedules without an assignment for the selected role are shown.
        A schedule may have one driver and one conductor.
      </p>

      {loading ? (
        <div className="staff-empty">
          <i className="bi bi-hourglass-split"></i>
          <h3>Loading assignments...</h3>
        </div>
      ) : assignments.length === 0 ? (
        <div className="staff-empty">
          <i className="bi bi-calendar2-check"></i>
          <h3>No {isDriver ? "driver" : "conductor"} assignments yet</h3>
          <p>Use the form above to assign staff to a schedule.</p>
        </div>
      ) : (
        <div className="staff-table-wrapper">
          <table className="staff-table staff-assignment-table">
            <thead>
              <tr>
                <th>Schedule</th>
                <th>Travel Date</th>
                <th>Departure</th>
                <th>Arrival</th>
                <th>Route</th>
                <th>Bus</th>
                <th>{isDriver ? "Driver" : "Conductor"}</th>
                <th>Employee No.</th>
                <th>Assigned At</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {assignments.map((assignment) => (
                <tr key={assignment.assignmentId}>
                  <td>#{assignment.scheduleId ?? "—"}</td>
                  <td>{formatDate(assignment.travelDate)}</td>
                  <td>{formatTime(assignment.departureTime)}</td>
                  <td>{formatTime(assignment.arrivalTime)}</td>
                  <td>{assignment.routeName || "—"}</td>
                  <td>
                    {assignment.busName || assignment.registrationNumber || "—"}
                    {assignment.registrationNumber &&
                      assignment.busName && (
                        <>
                          <br />
                          <small>{assignment.registrationNumber}</small>
                        </>
                      )}
                  </td>
                  <td>{assignment.staffName || "—"}</td>
                  <td>{assignment.employeeId || "—"}</td>
                  <td>
                    {assignment.assignedAt
                      ? assignment.assignedAt.replace("T", " ").substring(0, 16)
                      : "—"}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="staff-action-btn delete"
                      title="Remove Assignment"
                      aria-label={`Remove assignment ${assignment.assignmentId}`}
                      disabled={deletingId === assignment.assignmentId}
                      onClick={() => removeAssignment(assignment)}
                    >
                      <i className="bi bi-trash3"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default StaffAssignmentsPanel;
