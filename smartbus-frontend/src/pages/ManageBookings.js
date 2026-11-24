
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ManageBookings.css";

function ManageBookings() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingBookingId, setDeletingBookingId] = useState(null);

  // ==============================
  // HANDLE AUTHENTICATION ERRORS
  // ==============================

  const handleUnauthorized = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("smartBusUser");
    navigate("/login");
  };

  // ==============================
  // LOAD BOOKINGS
  // ==============================

  useEffect(() => {
    let cancelled = false;

    const loadBookings = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          "http://localhost:8080/api/bookings",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 401) {
          handleUnauthorized();
          return;
        }

        // Do not log the admin out for a 403 response.
        if (response.status === 403) {
          throw new Error(
            "Access denied. Your account does not have permission to view bookings. Please check the backend security configuration."
          );
        }

        if (!response.ok) {
          throw new Error(
            `Failed to load bookings. Server returned ${response.status}.`
          );
        }

        const data = await response.json();

        if (!cancelled) {
          setBookings(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Load bookings error:", err);

        if (!cancelled) {
          setError(
            err.message || "Unable to load bookings. Please try again."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadBookings();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  // ==============================
  // FORMAT BOOKING ID
  // ==============================

  const getBookingReference = (bookingId) =>
    `SB${String(bookingId).padStart(6, "0")}`;

  // ==============================
  // FORMAT DATE
  // ==============================

  const formatDate = (date) => {
    if (!date) return "—";

    const dateObject = new Date(date);

    if (Number.isNaN(dateObject.getTime())) {
      return date;
    }

    return dateObject.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ==============================
  // FORMAT TIME
  // ==============================

  const formatTime = (time) => {
    if (!time) return "—";

    const timeParts = String(time).split(":");

    if (timeParts.length < 2) return time;

    const hours = Number(timeParts[0]);
    const minutes = timeParts[1];
    const period = hours >= 12 ? "PM" : "AM";
    const displayHour = hours % 12 === 0 ? 12 : hours % 12;

    return `${String(displayHour).padStart(2, "0")}:${minutes} ${period}`;
  };

  // ==============================
  // FORMAT AMOUNT
  // ==============================

  const formatAmount = (amount) => {
    if (amount === null || amount === undefined) {
      return "Rs. 0.00";
    }

    return `Rs. ${Number(amount).toLocaleString("en-LK", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // ==============================
  // FORMAT STATUS
  // ==============================

  const getDisplayStatus = (status) => {
    if (String(status).toUpperCase() === "BOOKED") {
      return "Confirmed";
    }

    if (String(status).toUpperCase() === "CANCELLED") {
      return "Cancelled";
    }

    return status || "Unknown";
  };

  // ==============================
  // FORMAT PAYMENT METHOD
  // ==============================

  const getPaymentMethod = (bookingType) => {
    if (String(bookingType).toUpperCase() === "PAY_ON_BOARDING") {
      return "Pay on Boarding";
    }

    if (String(bookingType).toUpperCase() === "ONLINE") {
      return "Card Payment";
    }

    return bookingType || "—";
  };

  // ==============================
  // SEARCH AND FILTER BOOKINGS
  // ==============================

  const filteredBookings = bookings.filter((booking) => {
    const search = searchTerm.toLowerCase().trim();

    const bookingId = getBookingReference(
      booking.bookingId
    ).toLowerCase();

    const passenger = String(
      booking.passengerName || ""
    ).toLowerCase();

    const route = String(
      booking.routeName || ""
    ).toLowerCase();

    const bus = String(
      booking.busName || ""
    ).toLowerCase();

    const seat = String(
      booking.seatNumber || ""
    ).toLowerCase();

    const matchesSearch =
      bookingId.includes(search) ||
      passenger.includes(search) ||
      route.includes(search) ||
      bus.includes(search) ||
      seat.includes(search);

    const displayStatus = getDisplayStatus(booking.status);

    const matchesStatus =
      statusFilter === "All" ||
      displayStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // ==============================
  // SUMMARY COUNTS
  // ==============================

  const confirmedCount = bookings.filter(
    (booking) =>
      String(booking.status).toUpperCase() === "BOOKED"
  ).length;

  const completedCount = bookings.filter((booking) => {
    if (!booking.travelDate) return false;

    const travelDate = new Date(
      `${booking.travelDate}T${booking.arrivalTime || "23:59:59"}`
    );

    return (
      String(booking.status).toUpperCase() === "BOOKED" &&
      travelDate < new Date()
    );
  }).length;

  const cancelledCount = bookings.filter(
    (booking) =>
      String(booking.status).toUpperCase() === "CANCELLED"
  ).length;

  // ==============================
  // VIEW BOOKING DETAILS
  // ==============================

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetails(true);
  };

  // ==============================
  // DELETE BOOKING
  // ==============================

  const handleDeleteBooking = async (bookingId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this booking?"
    );

    if (!confirmDelete) return;

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    setDeletingBookingId(bookingId);

    try {
      const response = await fetch(
        `http://localhost:8080/api/bookings/${bookingId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      // A 403 means the server denied this operation.
      // Keep the admin's login session intact.
      if (response.status === 403) {
        throw new Error(
          "Access denied. Your login is still active, but the backend is not allowing this account to delete bookings. Check the backend security rules and delete endpoint permissions."
        );
      }

      if (!response.ok) {
        let message = `Failed to delete booking. Server returned ${response.status}.`;

        try {
          const responseText = await response.text();

          if (responseText) {
            try {
              const responseData = JSON.parse(responseText);
              message =
                responseData.message ||
                responseData.error ||
                message;
            } catch {
              message = responseText;
            }
          }
        } catch {
          // Keep the default error message.
        }

        throw new Error(message);
      }

      setBookings((currentBookings) =>
        currentBookings.filter(
          (booking) => booking.bookingId !== bookingId
        )
      );

      if (
        selectedBooking &&
        selectedBooking.bookingId === bookingId
      ) {
        setSelectedBooking(null);
        setShowDetails(false);
      }

      window.alert("Booking deleted successfully.");
    } catch (err) {
      console.error("Delete booking error:", err);

      window.alert(
        err.message ||
          "Unable to delete the booking. Please try again."
      );
    } finally {
      setDeletingBookingId(null);
    }
  };

  // ==============================
  // GET STATUS CSS CLASS
  // ==============================

  const getStatusClass = (status) => {
    const displayStatus = getDisplayStatus(status);

    if (displayStatus === "Confirmed") return "confirmed";
    if (displayStatus === "Completed") return "completed";
    if (displayStatus === "Cancelled") return "cancelled";

    return "";
  };

  // ==============================
  // PAGE UI
  // ==============================

  return (
    <div className="manage-bookings-page">
      {/* HEADER */}

      <header className="manage-bookings-header">
        <div className="manage-bookings-header-left">
          <button
            className="back-dashboard-btn"
            onClick={() => navigate("/admin-dashboard")}
            title="Back to Dashboard"
          >
            <i className="bi bi-arrow-left"></i>
          </button>

          <div>
            <h1>Manage Bookings</h1>
            <p>View and manage passenger bookings</p>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}

      <main className="manage-bookings-content">
        {/* SUMMARY CARDS */}

        <div className="booking-summary-grid">
          <div className="booking-summary-card">
            <div className="booking-summary-icon total">
              <i className="bi bi-ticket-perforated-fill"></i>
            </div>
            <div>
              <span>Total Bookings</span>
              <h2>{bookings.length}</h2>
            </div>
          </div>

          <div className="booking-summary-card">
            <div className="booking-summary-icon confirmed">
              <i className="bi bi-check-circle-fill"></i>
            </div>
            <div>
              <span>Confirmed</span>
              <h2>{confirmedCount}</h2>
            </div>
          </div>

          <div className="booking-summary-card">
            <div className="booking-summary-icon completed">
              <i className="bi bi-check2-all"></i>
            </div>
            <div>
              <span>Completed</span>
              <h2>{completedCount}</h2>
            </div>
          </div>

          <div className="booking-summary-card">
            <div className="booking-summary-icon cancelled">
              <i className="bi bi-x-circle-fill"></i>
            </div>
            <div>
              <span>Cancelled</span>
              <h2>{cancelledCount}</h2>
            </div>
          </div>
        </div>

        {/* BOOKINGS SECTION */}

        <section className="manage-bookings-section">
          <div className="manage-bookings-section-header">
            <div>
              <h2>All Bookings</h2>
              <p>
                View passenger booking information and status.
              </p>
            </div>

            <div className="booking-tools">
              {/* SEARCH */}

              <div className="booking-search">
                <i className="bi bi-search"></i>
                <input
                  type="text"
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* STATUS FILTER */}

              <div className="booking-filter">
                <i className="bi bi-funnel"></i>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All Status</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          {/* BOOKINGS TABLE */}

          <div className="manage-bookings-table-wrapper">
            {loading ? (
              <div className="no-bookings">
                <i className="bi bi-arrow-repeat"></i>
                <h3>Loading bookings...</h3>
              </div>
            ) : error ? (
              <div className="no-bookings">
                <i className="bi bi-exclamation-circle"></i>
                <h3>Unable to load bookings</h3>
                <p>{error}</p>
              </div>
            ) : (
              <table className="manage-bookings-table">
                <thead>
                  <tr>
                    <th>Booking</th>
                    <th>Passenger</th>
                    <th>Route</th>
                    <th>Date</th>
                    <th>Seat</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredBookings.length > 0 ? (
                    filteredBookings.map((booking) => {
                      const bookingReference =
                        getBookingReference(booking.bookingId);

                      const displayStatus =
                        getDisplayStatus(booking.status);

                      return (
                        <tr key={booking.bookingId}>
                          {/* BOOKING */}

                          <td>
                            <div className="booking-id-cell">
                              <div className="booking-ticket-icon">
                                <i className="bi bi-ticket-perforated-fill"></i>
                              </div>
                              <div>
                                <strong>{bookingReference}</strong>
                                <span>{booking.busName || "Bus"}</span>
                              </div>
                            </div>
                          </td>

                          {/* PASSENGER */}

                          <td>
                            <div className="booking-passenger-cell">
                              <div className="booking-passenger-avatar">
                                {(booking.passengerName || "P")
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>
                              <div>
                                <strong>
                                  {booking.passengerName ||
                                    "Unknown Passenger"}
                                </strong>
                                <span>
                                  {booking.passengerEmail || "—"}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* ROUTE */}

                          <td>
                            <div className="booking-route-cell">
                              <i className="bi bi-signpost-2"></i>
                              <span>{booking.routeName || "—"}</span>
                            </div>
                          </td>

                          {/* DATE */}

                          <td>
                            <div className="booking-date-cell">
                              <i className="bi bi-calendar3"></i>
                              <span>
                                {formatDate(booking.travelDate)}
                              </span>
                            </div>
                          </td>

                          {/* SEAT */}

                          <td>
                            <span className="booking-seat">
                              {booking.seatNumber || "—"}
                            </span>
                          </td>

                          {/* AMOUNT */}

                          <td>
                            <strong className="booking-amount">
                              {formatAmount(booking.totalPrice)}
                            </strong>
                          </td>

                          {/* STATUS */}

                          <td>
                            <span
                              className={`booking-status-select ${getStatusClass(
                                booking.status
                              )}`}
                            >
                              {displayStatus}
                            </span>
                          </td>

                          {/* ACTIONS */}

                          <td>
                            <div className="booking-actions">
                              <button
                                className="booking-action view"
                                title="View Details"
                                onClick={() =>
                                  handleViewDetails(booking)
                                }
                              >
                                <i className="bi bi-eye"></i>
                              </button>

                              <button
                                className="booking-action delete"
                                title="Delete Booking"
                                disabled={
                                  deletingBookingId === booking.bookingId
                                }
                                onClick={() =>
                                  handleDeleteBooking(
                                    booking.bookingId
                                  )
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
                        <div className="no-bookings">
                          <i className="bi bi-ticket-perforated"></i>
                          <h3>No bookings found</h3>
                          <p>
                            Try searching with a different keyword or
                            status.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>

      {/* BOOKING DETAILS MODAL */}

      {showDetails && selectedBooking && (
        <div
          className="booking-modal-overlay"
          onClick={() => setShowDetails(false)}
        >
          <div
            className="booking-details-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* MODAL HEADER */}

            <div className="booking-details-header">
              <div>
                <h2>Booking Details</h2>
                <p>
                  Booking ID:{" "}
                  <strong>
                    {getBookingReference(
                      selectedBooking.bookingId
                    )}
                  </strong>
                </p>
              </div>

              <button
                className="close-booking-modal"
                onClick={() => setShowDetails(false)}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            {/* MODAL CONTENT */}

            <div className="booking-details-content">
              {/* PASSENGER INFORMATION */}

              <div className="details-block">
                <div className="details-block-title">
                  <i className="bi bi-person-fill"></i>
                  <h3>Passenger Information</h3>
                </div>

                <div className="details-grid">
                  <div>
                    <span>Full Name</span>
                    <strong>
                      {selectedBooking.passengerName || "—"}
                    </strong>
                  </div>

                  <div>
                    <span>Email</span>
                    <strong>
                      {selectedBooking.passengerEmail || "—"}
                    </strong>
                  </div>

                  <div>
                    <span>Gender</span>
                    <strong>
                      {selectedBooking.passengerGender || "—"}
                    </strong>
                  </div>

                  <div>
                    <span>Booking Type</span>
                    <strong>
                      {getPaymentMethod(
                        selectedBooking.bookingType
                      )}
                    </strong>
                  </div>
                </div>
              </div>

              {/* TRIP INFORMATION */}

              <div className="details-block">
                <div className="details-block-title">
                  <i className="bi bi-bus-front-fill"></i>
                  <h3>Trip Information</h3>
                </div>

                <div className="details-grid">
                  <div>
                    <span>Route</span>
                    <strong>
                      {selectedBooking.routeName || "—"}
                    </strong>
                  </div>

                  <div>
                    <span>Bus</span>
                    <strong>
                      {selectedBooking.busName || "—"}
                    </strong>
                  </div>

                  <div>
                    <span>Registration Number</span>
                    <strong>
                      {selectedBooking.registrationNumber || "—"}
                    </strong>
                  </div>

                  <div>
                    <span>Travel Date</span>
                    <strong>
                      {formatDate(selectedBooking.travelDate)}
                    </strong>
                  </div>

                  <div>
                    <span>Seat Number</span>
                    <strong>
                      Seat {selectedBooking.seatNumber || "—"}
                    </strong>
                  </div>

                  <div>
                    <span>Departure</span>
                    <strong>
                      {formatTime(selectedBooking.departureTime)}
                    </strong>
                  </div>

                  <div>
                    <span>Arrival</span>
                    <strong>
                      {formatTime(selectedBooking.arrivalTime)}
                    </strong>
                  </div>

                  <div>
                    <span>Pickup Point</span>
                    <strong>
                      {selectedBooking.pickupPoint || "—"}
                    </strong>
                  </div>

                  <div>
                    <span>Drop Point</span>
                    <strong>
                      {selectedBooking.dropPoint || "—"}
                    </strong>
                  </div>
                </div>
              </div>

              {/* PAYMENT INFORMATION */}

              <div className="details-block">
                <div className="details-block-title">
                  <i className="bi bi-credit-card-fill"></i>
                  <h3>Payment Information</h3>
                </div>

                <div className="details-grid">
                  <div>
                    <span>Amount</span>
                    <strong>
                      {formatAmount(selectedBooking.totalPrice)}
                    </strong>
                  </div>

                  <div>
                    <span>Payment Method</span>
                    <strong>
                      {getPaymentMethod(
                        selectedBooking.bookingType
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>Booking Status</span>
                    <span
                      className={`modal-booking-status ${getStatusClass(
                        selectedBooking.status
                      )}`}
                    >
                      {getDisplayStatus(selectedBooking.status)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* MODAL FOOTER */}

            <div className="booking-details-footer">
              <button
                className="close-details-btn"
                onClick={() => setShowDetails(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageBookings;
