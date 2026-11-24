
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminReports.css";

const API_URL = "http://localhost:8080/api/admin/reports";

const PERIODS = {
  "This Week": "thisWeek",
  "This Month": "thisMonth",
  "Last Month": "lastMonth",
  "This Year": "thisYear",
};

const emptySummary = {
  totalBookings: 0,
  confirmedBookings: 0,
  completedBookings: 0,
  cancelledBookings: 0,
  pendingBookings: 0,
  totalRevenue: 0,
};

function formatMoney(value) {
  return Number(value || 0).toLocaleString("en-LK", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function normalizeStatus(status) {
  return String(status || "").toLowerCase();
}

function AdminReports() {
  const navigate = useNavigate();

  const [reportPeriod, setReportPeriod] = useState("This Month");
  const [summary, setSummary] = useState(emptySummary);
  const [monthlyBookings, setMonthlyBookings] = useState([]);
  const [popularRoutes, setPopularRoutes] = useState([]);
  const [busPerformance, setBusPerformance] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const period = PERIODS[reportPeriod];

      const response = await fetch(
        `${API_URL}?period=${encodeURIComponent(period)}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("smartBusUser");
        navigate("/login");
        return;
      }

      if (response.status === 403) {
        setError(
          "You do not have permission to view these reports. Please log in with an admin account."
        );
        return;
      }

      if (!response.ok) {
        throw new Error(
          `Unable to load reports (HTTP ${response.status}).`
        );
      }

      const data = await response.json();

      setSummary({
        ...emptySummary,
        ...(data.summary || {}),
      });

      setMonthlyBookings(
        Array.isArray(data.monthlyBookings)
          ? data.monthlyBookings
          : []
      );

      setPopularRoutes(
        Array.isArray(data.popularRoutes)
          ? data.popularRoutes
          : []
      );

      setBusPerformance(
        Array.isArray(data.busPerformance)
          ? data.busPerformance
          : []
      );

      setRecentBookings(
        Array.isArray(data.recentBookings)
          ? data.recentBookings
          : []
      );
    } catch (err) {
      console.error("Reports loading error:", err);
      setError(
        err.message ||
          "Could not connect to the SmartBus reports service."
      );
    } finally {
      setLoading(false);
    }
  }, [reportPeriod, navigate]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const maxBookings = Math.max(
    1,
    ...monthlyBookings.map((item) => Number(item.bookings || 0))
  );

  const maxRouteBookings = Math.max(
    1,
    ...popularRoutes.map((item) => Number(item.bookings || 0))
  );

  const confirmed = Number(summary.confirmedBookings || 0);
  const completed = Number(summary.completedBookings || 0);
  const cancelled = Number(summary.cancelledBookings || 0);
  const pending = Number(summary.pendingBookings || 0);
  const total = Number(summary.totalBookings || 0);

  const handlePrintReport = () => {
    window.print();
  };

  const handleExportReport = () => {
    const rows = [
      ["SmartBus Reports & Analytics"],
      ["Report Period", reportPeriod],
      [],
      ["Summary", "Value"],
      ["Total Bookings", total],
      ["Confirmed Bookings", confirmed],
      ["Completed Bookings", completed],
      ["Cancelled Bookings", cancelled],
      ["Pending Bookings", pending],
      ["Revenue (LKR)", Number(summary.totalRevenue || 0)],
      [],
      ["Monthly Booking Trend"],
      ["Month", "Year", "Bookings"],
      ...monthlyBookings.map((item) => [
        item.month,
        item.year,
        item.bookings,
      ]),
      [],
      ["Popular Routes"],
      ["Route", "Bookings"],
      ...popularRoutes.map((item) => [
        item.route,
        item.bookings,
      ]),
      [],
      ["Bus Performance"],
      ["Bus Registration", "Bookings", "Revenue (LKR)"],
      ...busPerformance.map((item) => [
        item.bus,
        item.bookings,
        item.revenue,
      ]),
      [],
      ["Recent Bookings"],
      ["Booking ID", "Passenger", "Route", "Date", "Status", "Amount"],
      ...recentBookings.map((item) => [
        item.bookingId,
        item.passenger,
        item.route,
        formatDate(item.bookingDate),
        item.status,
        item.totalPrice,
      ]),
    ];

    const csvValue = (value) => {
      const safeValue = String(value ?? "");
      return `"${safeValue.replace(/"/g, '""')}"`;
    };

    const csv = rows
      .map((row) => row.map(csvValue).join(","))
      .join("\r\n");

    const blob = new Blob(["\uFEFF", csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `SmartBus-Report-${PERIODS[reportPeriod]}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="admin-reports-page">
      <div className="reports-header">
        <div className="reports-header-left">
          <button
            className="reports-back-btn"
            onClick={() => navigate("/admin-dashboard")}
          >
            <i className="bi bi-arrow-left"></i>
            Back to Dashboard
          </button>

          <div className="reports-title-area">
            <span className="reports-title-icon">
              <i className="bi bi-bar-chart-line"></i>
            </span>

            <div>
              <h1>Reports & Analytics</h1>
              <p>
                Monitor bookings, revenue, routes and overall SmartBus
                performance.
              </p>
            </div>
          </div>
        </div>

        <div className="reports-header-actions">
          <button
            className="reports-export-btn"
            onClick={handleExportReport}
            disabled={loading || Boolean(error)}
          >
            <i className="bi bi-download"></i>
            Export Report
          </button>

          <button
            className="reports-print-btn"
            onClick={handlePrintReport}
          >
            <i className="bi bi-printer"></i>
            Print
          </button>
        </div>
      </div>

      <main className="reports-content">
        <section className="reports-filter-section">
          <div>
            <h2>Overview</h2>
            <p>View SmartBus performance using live database records.</p>
          </div>

          <div className="reports-period-control">
            <label htmlFor="report-period">Report Period</label>

            <select
              id="report-period"
              value={reportPeriod}
              onChange={(event) => setReportPeriod(event.target.value)}
            >
              {Object.keys(PERIODS).map((period) => (
                <option key={period} value={period}>
                  {period}
                </option>
              ))}
            </select>
          </div>
        </section>

        {loading && (
          <p role="status">Loading reports from the database...</p>
        )}

        {error && (
          <div role="alert" className="reports-footer-note">
            <i className="bi bi-exclamation-triangle"></i>
            <p>{error}</p>
            <button onClick={fetchReports}>Try Again</button>
          </div>
        )}

        {!loading && !error && (
          <>
            <section className="report-summary-grid">
              <div className="report-summary-card bookings-card">
                <div className="report-card-icon">
                  <i className="bi bi-ticket-perforated"></i>
                </div>
                <div className="report-card-info">
                  <span>Total Bookings</span>
                  <strong>{total.toLocaleString()}</strong>
                  <small>
                    <i className="bi bi-database"></i> Database records
                  </small>
                </div>
              </div>

              <div className="report-summary-card confirmed-card">
                <div className="report-card-icon">
                  <i className="bi bi-check-circle"></i>
                </div>
                <div className="report-card-info">
                  <span>Confirmed</span>
                  <strong>{confirmed.toLocaleString()}</strong>
                  <small>
                    <i className="bi bi-check2"></i> Confirmed bookings
                  </small>
                </div>
              </div>

              <div className="report-summary-card completed-card">
                <div className="report-card-icon">
                  <i className="bi bi-check2-all"></i>
                </div>
                <div className="report-card-info">
                  <span>Completed</span>
                  <strong>{completed.toLocaleString()}</strong>
                  <small>
                    <i className="bi bi-check2"></i> Completed trips
                  </small>
                </div>
              </div>

              <div className="report-summary-card cancelled-card">
                <div className="report-card-icon">
                  <i className="bi bi-x-circle"></i>
                </div>
                <div className="report-card-info">
                  <span>Cancelled</span>
                  <strong>{cancelled.toLocaleString()}</strong>
                  <small>
                    <i className="bi bi-info-circle"></i> Cancelled bookings
                  </small>
                </div>
              </div>

              <div className="report-summary-card revenue-card">
                <div className="report-card-icon">
                  <i className="bi bi-currency-rupee"></i>
                </div>
                <div className="report-card-info">
                  <span>Total Revenue</span>
                  <strong>
                    Rs. {formatMoney(summary.totalRevenue)}
                  </strong>
                  <small>
                    <i className="bi bi-graph-up"></i> Confirmed/completed
                  </small>
                </div>
              </div>
            </section>

            <section className="reports-main-grid">
              <div className="report-panel booking-trend-panel">
                <div className="report-panel-header">
                  <div>
                    <h3>Booking Trend</h3>
                    <p>Monthly booking activity from the database.</p>
                  </div>
                  <span className="panel-header-icon">
                    <i className="bi bi-graph-up"></i>
                  </span>
                </div>

                {monthlyBookings.length === 0 ? (
                  <p>No monthly booking records found.</p>
                ) : (
                  <div className="booking-chart">
                    <div className="chart-y-labels">
                      <span>{Math.ceil(maxBookings)}</span>
                      <span>{Math.ceil(maxBookings * 0.75)}</span>
                      <span>{Math.ceil(maxBookings * 0.5)}</span>
                      <span>{Math.ceil(maxBookings * 0.25)}</span>
                      <span>0</span>
                    </div>

                    <div className="chart-area">
                      <div className="chart-grid-line line-160"></div>
                      <div className="chart-grid-line line-120"></div>
                      <div className="chart-grid-line line-80"></div>
                      <div className="chart-grid-line line-40"></div>
                      <div className="chart-grid-line line-0"></div>

                      <div className="chart-bars">
                        {monthlyBookings.map((item, index) => (
                          <div
                            className="chart-column"
                            key={`${item.year}-${item.month}-${index}`}
                          >
                            <div className="chart-bar-wrapper">
                              <div
                                className="chart-bar"
                                style={{
                                  height: `${
                                    (Number(item.bookings || 0) /
                                      maxBookings) *
                                    100
                                  }%`,
                                }}
                                title={`${item.month}: ${item.bookings} bookings`}
                              >
                                <span>{item.bookings}</span>
                              </div>
                            </div>
                            <span className="chart-month">{item.month}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="report-panel status-panel">
                <div className="report-panel-header">
                  <div>
                    <h3>Booking Status</h3>
                    <p>Booking distribution for the selected period.</p>
                  </div>
                  <span className="panel-header-icon">
                    <i className="bi bi-pie-chart"></i>
                  </span>
                </div>

                <div className="status-content">
                  <div className="status-circle">
                    <div className="status-circle-inner">
                      <strong>{total}</strong>
                      <span>Bookings</span>
                    </div>
                  </div>

                  <div className="status-legend">
                    <div className="status-legend-item">
                      <span className="legend-dot confirmed-dot"></span>
                      <div>
                        <strong>Confirmed</strong>
                        <span>{confirmed}</span>
                      </div>
                    </div>

                    <div className="status-legend-item">
                      <span className="legend-dot completed-dot"></span>
                      <div>
                        <strong>Completed</strong>
                        <span>{completed}</span>
                      </div>
                    </div>

                    <div className="status-legend-item">
                      <span className="legend-dot cancelled-dot"></span>
                      <div>
                        <strong>Cancelled</strong>
                        <span>{cancelled}</span>
                      </div>
                    </div>

                    <div className="status-legend-item">
                      <span className="legend-dot"></span>
                      <div>
                        <strong>Pending</strong>
                        <span>{pending}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="report-panel popular-routes-panel">
              <div className="report-panel-header">
                <div>
                  <h3>Popular Routes</h3>
                  <p>Routes with the highest number of bookings.</p>
                </div>
                <span className="panel-header-icon">
                  <i className="bi bi-signpost-2"></i>
                </span>
              </div>

              <div className="route-report-list">
                {popularRoutes.length === 0 ? (
                  <p>No route bookings found for this period.</p>
                ) : (
                  popularRoutes.map((route, index) => (
                    <div
                      className="route-report-item"
                      key={route.route}
                    >
                      <div className="route-rank">{index + 1}</div>

                      <div className="route-info">
                        <div className="route-name-row">
                          <strong>{route.route}</strong>
                          <span>{route.bookings} bookings</span>
                        </div>
                        <div className="route-progress">
                          <div
                            className="route-progress-fill"
                            style={{
                              width: `${
                                (Number(route.bookings || 0) /
                                  maxRouteBookings) *
                                100
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>

                      <div className="route-revenue">
                        <span>Revenue</span>
                        <strong>
                          Rs. {formatMoney(route.revenue)}
                        </strong>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section className="reports-bottom-grid">
              <div className="report-panel bus-performance-panel">
                <div className="report-panel-header">
                  <div>
                    <h3>Bus Performance</h3>
                    <p>Bookings and revenue grouped by bus registration.</p>
                  </div>
                  <span className="panel-header-icon">
                    <i className="bi bi-bus-front"></i>
                  </span>
                </div>

                <div className="report-table-wrapper">
                  <table className="report-table">
                    <thead>
                      <tr>
                        <th>Bus</th>
                        <th>Bookings</th>
                        <th>Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {busPerformance.length === 0 ? (
                        <tr>
                          <td colSpan="3">No bus booking records found.</td>
                        </tr>
                      ) : (
                        busPerformance.map((bus) => (
                          <tr key={bus.bus}>
                            <td>
                              <div className="bus-report-name">
                                <span className="bus-mini-icon">
                                  <i className="bi bi-bus-front"></i>
                                </span>
                                <div>
                                  <strong>{bus.bus}</strong>
                                </div>
                              </div>
                            </td>
                            <td>{bus.bookings}</td>
                            <td>Rs. {formatMoney(bus.revenue)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="report-panel payment-panel">
                <div className="report-panel-header">
                  <div>
                    <h3>Payment Methods</h3>
                    <p>Payment information available in the database.</p>
                  </div>
                  <span className="panel-header-icon">
                    <i className="bi bi-wallet2"></i>
                  </span>
                </div>

                <div className="payment-method-list">
                  <p>
                    Payment-method statistics are not available yet because
                    the current Booking entity does not contain a payment
                    method field.
                  </p>
                </div>
              </div>
            </section>

            <section className="report-panel recent-reports-panel">
              <div className="report-panel-header">
                <div>
                  <h3>Recent Bookings</h3>
                  <p>Latest bookings in the selected report period.</p>
                </div>
                <span className="panel-header-icon">
                  <i className="bi bi-file-earmark-bar-graph"></i>
                </span>
              </div>

              <div className="recent-report-list">
                {recentBookings.length === 0 ? (
                  <p>No bookings found for this period.</p>
                ) : (
                  recentBookings.map((booking) => (
                    <div
                      className="recent-report-item"
                      key={booking.bookingId}
                    >
                      <div className="recent-report-icon">
                        <i className="bi bi-ticket-perforated"></i>
                      </div>

                      <div className="recent-report-info">
                        <strong>
                          Booking #{booking.bookingId} —{" "}
                          {booking.passenger || "Unknown passenger"}
                        </strong>
                        <span>
                          {booking.route || "Unknown route"} ·{" "}
                          {formatDate(booking.bookingDate)}
                        </span>
                      </div>

                      <span className="recent-report-type">
                        {booking.status || "Unknown"}
                      </span>

                      <span>
                        Rs. {formatMoney(booking.totalPrice)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </section>

            <div className="reports-footer-note">
              <i className="bi bi-info-circle"></i>
              <p>
                Reports are loaded from the SmartBus backend. Figures depend
                on the booking records stored in your database.
              </p>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default AdminReports;