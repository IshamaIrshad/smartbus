import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ManagePassengers.css";

function ManagePassengers() {
  const navigate = useNavigate();

  const [passengers, setPassengers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedPassenger, setSelectedPassenger] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================
  // LOAD PASSENGERS
  // =========================
  useEffect(() => {
    fetchPassengers();
  }, []);

  // =========================
  // LOGIN REDIRECT
  // =========================
  const handleUnauthorized = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("smartBusUser");

    navigate("/login");
  };

  // =========================
  // LOAD PASSENGERS
  // =========================
  const fetchPassengers = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      // =========================
      // GET PASSENGERS
      // =========================
      const passengerResponse = await fetch(
        "http://localhost:8080/api/passengers",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "Passenger API status:",
        passengerResponse.status
      );

      // Token expired / invalid
      if (passengerResponse.status === 401) {
        handleUnauthorized();
        return;
      }

      // Admin does not have permission
      if (passengerResponse.status === 403) {
        throw new Error(
          "Admin is not authorized to access /api/passengers"
        );
      }

      if (!passengerResponse.ok) {
        const errorText = await passengerResponse.text();

        throw new Error(
          errorText || "Failed to load passengers"
        );
      }

      const passengerData =
        await passengerResponse.json();

      console.log(
        "Passengers from backend:",
        passengerData
      );

      // =========================
      // GET BOOKINGS
      // =========================
      let bookingData = [];

      const bookingResponse = await fetch(
        "http://localhost:8080/api/bookings",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "Booking API status:",
        bookingResponse.status
      );

      // Token expired / invalid
      if (bookingResponse.status === 401) {
        handleUnauthorized();
        return;
      }

      // Admin is not authorized
      if (bookingResponse.status === 403) {
        console.warn(
          "Admin is not authorized to access /api/bookings"
        );

        // Do not redirect.
        // We can still display passengers.
        bookingData = [];
      } else if (bookingResponse.ok) {
        bookingData = await bookingResponse.json();

        console.log(
          "Bookings from backend:",
          bookingData
        );
      }

      // =========================
      // MAP PASSENGER DATA
      // =========================
      const mappedPassengers = passengerData.map(
        (passenger) => {

          const bookingCount =
            bookingData.filter(
              (booking) =>
                booking.passengerName ===
                passenger.name
            ).length;

          return {
            id: `P${String(
              passenger.userId
            ).padStart(3, "0")}`,

            userId: passenger.userId,

            name:
              passenger.name || "—",

            email:
              passenger.email || "—",

            phone:
              passenger.phone || "—",

            gender:
              passenger.gender || "—",

            bookings:
              bookingCount,

            // Passenger entity currently
            // does not have a status field.
            status: "Active",
          };
        }
      );

      setPassengers(mappedPassengers);

    } catch (error) {

      console.error(
        "Error loading passengers:",
        error
      );

      alert(
        error.message ||
        "Unable to load passengers."
      );

    } finally {
      setLoading(false);
    }
  };

  // =========================
  // ACTIVE COUNT
  // =========================
  const activeCount =
    passengers.filter(
      (passenger) =>
        passenger.status === "Active"
    ).length;

  // =========================
  // TOTAL BOOKINGS
  // =========================
  const totalBookings =
    passengers.reduce(
      (total, passenger) =>
        total + passenger.bookings,
      0
    );

  // =========================
  // SEARCH + FILTER
  // =========================
  const filteredPassengers =
    passengers.filter((passenger) => {

      const search =
        searchTerm.toLowerCase();

      const matchesSearch =
        passenger.id
          .toLowerCase()
          .includes(search) ||

        passenger.name
          .toLowerCase()
          .includes(search) ||

        passenger.email
          .toLowerCase()
          .includes(search) ||

        passenger.phone
          .toLowerCase()
          .includes(search);

      const matchesStatus =
        statusFilter === "All" ||
        passenger.status ===
          statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });

  // =========================
  // TOGGLE STATUS
  // =========================
  const toggleStatus = (id) => {

    setPassengers(
      (currentPassengers) =>
        currentPassengers.map(
          (passenger) =>
            passenger.id === id
              ? {
                  ...passenger,

                  status:
                    passenger.status ===
                    "Active"
                      ? "Inactive"
                      : "Active",
                }
              : passenger
        )
    );

    if (
      selectedPassenger &&
      selectedPassenger.id === id
    ) {

      setSelectedPassenger(
        (current) => ({
          ...current,

          status:
            current.status ===
            "Active"
              ? "Inactive"
              : "Active",
        })
      );
    }
  };

  // =========================
  // DELETE PASSENGER
  // =========================
  const deletePassenger = async (
    userId,
    passengerId
  ) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this passenger?"
      );

    if (!confirmed) {
      return;
    }

    const token =
      localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {

      const response =
        await fetch(
          `http://localhost:8080/api/passengers/${userId}`,
          {
            method: "DELETE",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      console.log(
        "Delete passenger status:",
        response.status
      );

      // Token expired
      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      // Admin permission problem
      if (response.status === 403) {
        throw new Error(
          "Admin is not authorized to delete this passenger."
        );
      }

      if (!response.ok) {

        const errorText =
          await response.text();

        throw new Error(
          errorText ||
          "Failed to delete passenger"
        );
      }

      // Remove from UI
      setPassengers(
        (currentPassengers) =>
          currentPassengers.filter(
            (passenger) =>
              passenger.id !== passengerId
          )
      );

      setSelectedPassenger(null);

      alert(
        "Passenger deleted successfully."
      );

    } catch (error) {

      console.error(
        "Error deleting passenger:",
        error
      );

      alert(
        error.message ||
        "Unable to delete passenger."
      );
    }
  };

  return (
    <div className="passengers-page">

      {/* =========================
          HEADER
      ========================= */}

      <header className="passengers-header">

        <div className="passengers-header-left">

          <button
            className="passengers-back-btn"
            onClick={() =>
              navigate(
                "/admin-dashboard"
              )
            }
          >
            <i className="bi bi-arrow-left"></i>
          </button>

          <div>

            <h1>
              Manage Passengers
            </h1>

            <p>
              View and manage registered
              SmartBus passengers.
            </p>

          </div>

        </div>

        <button
          className="passengers-dashboard-btn"
          onClick={() =>
            navigate(
              "/admin-dashboard"
            )
          }
        >
          <i className="bi bi-grid-1x2-fill"></i>
          Dashboard
        </button>

      </header>


      {/* =========================
          MAIN CONTENT
      ========================= */}

      <main className="passengers-content">

        {/* =========================
            SUMMARY
        ========================= */}

        <div className="passenger-summary-grid">

          {/* Total Passengers */}

          <div className="passenger-summary-card">

            <div className="passenger-summary-icon total">

              <i className="bi bi-people-fill"></i>

            </div>

            <div>

              <span>
                Total Passengers
              </span>

              <h2>
                {passengers.length}
              </h2>

            </div>

          </div>


          {/* Active Passengers */}

          <div className="passenger-summary-card">

            <div className="passenger-summary-icon active">

              <i className="bi bi-person-check-fill"></i>

            </div>

            <div>

              <span>
                Active Passengers
              </span>

              <h2>
                {activeCount}
              </h2>

            </div>

          </div>


          {/* Total Bookings */}

          <div className="passenger-summary-card">

            <div className="passenger-summary-icon bookings">

              <i className="bi bi-ticket-perforated-fill"></i>

            </div>

            <div>

              <span>
                Total Bookings
              </span>

              <h2>
                {totalBookings}
              </h2>

            </div>

          </div>

        </div>


        {/* =========================
            PASSENGER SECTION
        ========================= */}

        <section className="passengers-section">

          <div className="passengers-section-heading">

            <div>

              <h2>
                Passenger List
              </h2>

              <p>
                Search and manage passenger
                accounts.
              </p>

            </div>

          </div>


          {/* =========================
              FILTERS
          ========================= */}

          <div className="passenger-filters">

            <div className="passenger-search">

              <i className="bi bi-search"></i>

              <input
                type="text"
                placeholder="Search by ID, name, email or phone..."
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(
                    event.target.value
                  )
                }
              />

            </div>


            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value
                )
              }
            >

              <option value="All">
                All Status
              </option>

              <option value="Active">
                Active
              </option>

              <option value="Inactive">
                Inactive
              </option>

            </select>

          </div>


          {/* =========================
              TABLE
          ========================= */}

          <div className="passenger-table-wrapper">

            <table className="passenger-table">

              <thead>

                <tr>

                  <th>
                    Passenger
                  </th>

                  <th>
                    Contact
                  </th>

                  <th>
                    Gender
                  </th>

                  <th>
                    Bookings
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody>

                {/* LOADING */}

                {loading ? (

                  <tr>

                    <td
                      colSpan="6"
                      className="passenger-empty"
                    >

                      <i className="bi bi-hourglass-split"></i>

                      <h3>
                        Loading passengers...
                      </h3>

                      <p>
                        Please wait.
                      </p>

                    </td>

                  </tr>

                ) : filteredPassengers.length > 0 ? (

                  /* PASSENGERS */

                  filteredPassengers.map(
                    (passenger) => (

                      <tr
                        key={
                          passenger.id
                        }
                      >

                        {/* Passenger */}

                        <td>

                          <div className="passenger-profile">

                            <div className="passenger-avatar">

                              {passenger.name.charAt(
                                0
                              )}

                            </div>

                            <div>

                              <strong>
                                {passenger.name}
                              </strong>

                              <span>
                                {passenger.id}
                              </span>

                            </div>

                          </div>

                        </td>


                        {/* Contact */}

                        <td>

                          <div className="passenger-contact">

                            <span>

                              <i className="bi bi-envelope"></i>

                              {passenger.email}

                            </span>


                            <span>

                              <i className="bi bi-telephone"></i>

                              {passenger.phone}

                            </span>

                          </div>

                        </td>


                        {/* Gender */}

                        <td>

                          <span className="gender-badge">

                            <i
                              className={
                                passenger.gender ===
                                "Female"
                                  ? "bi bi-gender-female"
                                  : "bi bi-gender-male"
                              }
                            ></i>

                            {passenger.gender}

                          </span>

                        </td>


                        {/* Bookings */}

                        <td>

                          <strong className="booking-count">

                            {passenger.bookings}

                          </strong>

                        </td>


                        {/* Status */}

                        <td>

                          <span
                            className={`passenger-status ${
                              passenger.status ===
                              "Active"
                                ? "active"
                                : "inactive"
                            }`}
                          >

                            <i className="bi bi-circle-fill"></i>

                            {passenger.status}

                          </span>

                        </td>


                        {/* Actions */}

                        <td>

                          <div className="passenger-actions">

                            {/* View */}

                            <button
                              className="passenger-action-btn view"
                              title="View Details"
                              onClick={() =>
                                setSelectedPassenger(
                                  passenger
                                )
                              }
                            >

                              <i className="bi bi-eye"></i>

                            </button>


                            {/* Status */}

                            <button
                              className="passenger-action-btn status"
                              title="Change Status"
                              onClick={() =>
                                toggleStatus(
                                  passenger.id
                                )
                              }
                            >

                              <i className="bi bi-arrow-repeat"></i>

                            </button>


                            {/* Delete */}

                            <button
                              className="passenger-action-btn delete"
                              title="Delete"
                              onClick={() =>
                                deletePassenger(
                                  passenger.userId,
                                  passenger.id
                                )
                              }
                            >

                              <i className="bi bi-trash3"></i>

                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  )

                ) : (

                  /* EMPTY */

                  <tr>

                    <td
                      colSpan="6"
                      className="passenger-empty"
                    >

                      <i className="bi bi-person-x"></i>

                      <h3>
                        No passengers found
                      </h3>

                      <p>
                        Try changing your
                        search or filter.
                      </p>

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </section>

      </main>


      {/* =========================
          DETAILS MODAL
      ========================= */}

      {selectedPassenger && (

        <div
          className="passenger-modal-overlay"
          onClick={() =>
            setSelectedPassenger(
              null
            )
          }
        >

          <div
            className="passenger-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* Modal Header */}

            <div className="passenger-modal-header">

              <div>

                <h2>
                  Passenger Details
                </h2>

                <p>
                  Passenger account
                  information
                </p>

              </div>


              <button
                onClick={() =>
                  setSelectedPassenger(
                    null
                  )
                }
              >

                <i className="bi bi-x-lg"></i>

              </button>

            </div>


            {/* Profile */}

            <div className="passenger-modal-profile">

              <div className="modal-avatar">

                {selectedPassenger.name.charAt(
                  0
                )}

              </div>


              <div>

                <h3>
                  {selectedPassenger.name}
                </h3>

                <span>
                  {selectedPassenger.id}
                </span>

              </div>

            </div>


            {/* Details */}

            <div className="passenger-details-grid">

              <div>

                <span>
                  Email
                </span>

                <strong>
                  {selectedPassenger.email}
                </strong>

              </div>


              <div>

                <span>
                  Phone
                </span>

                <strong>
                  {selectedPassenger.phone}
                </strong>

              </div>


              <div>

                <span>
                  Gender
                </span>

                <strong>
                  {selectedPassenger.gender}
                </strong>

              </div>


              <div>

                <span>
                  Total Bookings
                </span>

                <strong>
                  {selectedPassenger.bookings}
                </strong>

              </div>


              <div>

                <span>
                  Account Status
                </span>

                <strong>
                  {selectedPassenger.status}
                </strong>

              </div>

            </div>


            {/* Close */}

            <button
              className="passenger-modal-close"
              onClick={() =>
                setSelectedPassenger(
                  null
                )
              }
            >
              Close
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

export default ManagePassengers;