
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/SeatSelection.css";

function SeatSelection() {
  const navigate = useNavigate();
  const location = useLocation();

  const bookingInfo = location.state || {};

  const {
    from,
    to,
    date,
    scheduleId,
    busId,
    busName,
    busType,
    price,
    currency,
    departure,
    arrival,
    duration,
    pickupPointId,
    dropPointId,
    routeId,
  } = bookingInfo;

  const [gender, setGender] = useState("");
  const [selectedSeat, setSelectedSeat] = useState(null);

  const [seats, setSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Seats reserved for passengers boarding along the route.
  const reservedSeatNumbers = [
    "B1",
    "B2",
    "C1",
    "C4",
    "C5",
    "D5",
  ];

  useEffect(() => {
    const loadSeatData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      if (!scheduleId || !busId) {
        setError(
          "Booking information is missing. Please search for a bus again."
        );
        setLoading(false);
        return;
      }

      try {
        // Load all seats.
        const seatsResponse = await fetch(
          "http://localhost:8080/api/seats",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (
          seatsResponse.status === 401 ||
          seatsResponse.status === 403
        ) {
          localStorage.removeItem("token");
          localStorage.removeItem("smartBusUser");
          navigate("/login");
          return;
        }

        if (!seatsResponse.ok) {
          throw new Error("Failed to load seats.");
        }

        const allSeats = await seatsResponse.json();

        // Get seats belonging to the selected bus.
        const busSeats = allSeats
          .filter(
            (seat) =>
              Number(seat.bus?.busId) === Number(busId)
          )
          .sort((a, b) => {
            const numberA = parseInt(
              a.seatNumber?.replace(/\D/g, "") || "0"
            );

            const numberB = parseInt(
              b.seatNumber?.replace(/\D/g, "") || "0"
            );

            const letterA = a.seatNumber?.replace(/[0-9]/g, "") || "";
            const letterB = b.seatNumber?.replace(/[0-9]/g, "") || "";

            if (letterA !== letterB) {
              return letterA.localeCompare(letterB);
            }

            return numberA - numberB;
          });

        setSeats(busSeats);

        // Load booked seats for this particular schedule.
        const bookedSeatsResponse = await fetch(
          `http://localhost:8080/api/bookings/schedule/${scheduleId}/booked-seats`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (
          bookedSeatsResponse.status === 401 ||
          bookedSeatsResponse.status === 403
        ) {
          localStorage.removeItem("token");
          localStorage.removeItem("smartBusUser");
          navigate("/login");
          return;
        }

        if (!bookedSeatsResponse.ok) {
          throw new Error("Failed to load booked seats.");
        }

        const bookedSeatData =
          await bookedSeatsResponse.json();

        setBookedSeats(
          Array.isArray(bookedSeatData)
            ? bookedSeatData
            : []
        );

      } catch (err) {
        console.error("Seat loading error:", err);

        setError(
          "Unable to load seat information. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    loadSeatData();
  }, [navigate, scheduleId, busId]);

  const handleGenderChange = (value) => {
    setGender(value);
    setSelectedSeat(null);
    setError("");
  };

  const handleSeatClick = (seat) => {
    if (!gender) {
      setError("Please select passenger gender first.");
      return;
    }

    const isReserved =
      seat.status?.trim().toUpperCase() === "RESERVED" ||
      reservedSeatNumbers.includes(
        seat.seatNumber?.trim().toUpperCase()
      );

    if (isReserved) {
      setError(
        "This seat is reserved for passengers boarding along the route."
      );
      return;
    }

    const bookedSeat = bookedSeats.find(
      (item) =>
        Number(item.seatId) === Number(seat.seatId)
    );

    if (bookedSeat) {
      return;
    }

    setSelectedSeat(seat);
    setError("");
  };

  const handleContinue = () => {
    if (!gender) {
      setError("Please select passenger gender.");
      return;
    }

    if (!selectedSeat) {
      setError(
        "Please select an available seat before continuing."
      );
      return;
    }

    const bookingData = {
      gender: gender,
      seat: selectedSeat.seatNumber,
      seatId: selectedSeat.seatId,
      scheduleId: scheduleId,
      busId: busId,
      routeId: routeId,
      from: from,
      to: to,
      date: date,
      busName: busName,
      busType: busType,
      departure: departure,
      arrival: arrival,
      duration: duration,
      price: price,
      currency: currency,
      pickupPointId: pickupPointId,
      dropPointId: dropPointId,
    };

    localStorage.setItem(
      "smartBusBooking",
      JSON.stringify(bookingData)
    );

    navigate("/booking-summary", {
      state: bookingData,
    });
  };

  return (
    <div className="seat-page">

      <section className="seat-header">
        <div className="container">
          <div className="seat-header-content">
            <span>SMARTBUS BOOKING</span>

            <h1>Select Your Seat</h1>

            <p>
              Select your passenger gender and choose an available seat.
            </p>
          </div>
        </div>
      </section>

      <section className="seat-section">
        <div className="container">

          <div className="row g-4">

            <div className="col-lg-8">

              <div className="seat-card">

                <div className="seat-card-header">
                  <div>
                    <span className="small-title">
                      STEP 2 OF 3
                    </span>

                    <h2>Choose Your Seat</h2>

                    <p>
                      Select your gender first, then choose an available seat.
                    </p>
                  </div>
                </div>

                <div className="gender-section">

                  <h3>Passenger Gender</h3>

                  <p className="gender-description">
                    Select your gender before choosing a seat.
                  </p>

                  <div className="gender-options">

                    <button
                      type="button"
                      className={
                        gender === "Male"
                          ? "gender-btn male active"
                          : "gender-btn male"
                      }
                      onClick={() =>
                        handleGenderChange("Male")
                      }
                    >
                      <span className="gender-icon">
                        👨
                      </span>

                      <span>Male</span>
                    </button>

                    <button
                      type="button"
                      className={
                        gender === "Female"
                          ? "gender-btn female active"
                          : "gender-btn female"
                      }
                      onClick={() =>
                        handleGenderChange("Female")
                      }
                    >
                      <span className="gender-icon">
                        👩
                      </span>

                      <span>Female</span>
                    </button>

                  </div>
                </div>

                {/* SEAT LEGEND */}
                <div className="seat-legend">

                  <div>
                    <span className="legend-box available"></span>
                    Available
                  </div>

                  <div>
                    <span className="legend-box male-booked"></span>
                    Male
                  </div>

                  <div>
                    <span className="legend-box female-booked"></span>
                    Female
                  </div>

                  <div>
                    <span className="legend-box reserved"></span>
                    Reserved
                  </div>

                </div>

                <div className="bus-wrapper">

                  <div className="bus-front-area">

                    <div className="bus-door">
                      <span className="door-icon">▥</span>
                      <strong>DOOR</strong>
                    </div>

                    <div className="front-label">
                      FRONT
                    </div>

                    <div className="driver-area">

                      <div className="steering-wheel">
                        <span>◉</span>
                      </div>

                      <strong>DRIVER</strong>

                    </div>

                  </div>

                  <div className="bus-body">

                    {loading ? (

                      <div
                        style={{
                          textAlign: "center",
                          padding: "30px",
                        }}
                      >
                        Loading seats...
                      </div>

                    ) : seats.length === 0 ? (

                      <div
                        style={{
                          textAlign: "center",
                          padding: "30px",
                        }}
                      >
                        No seats available for this bus.
                      </div>

                    ) : (

                      <div className="seat-grid">

                        {seats.map((seat) => {

                          const bookedSeat =
                            bookedSeats.find(
                              (item) =>
                                Number(item.seatId) ===
                                Number(seat.seatId)
                            );

                          const isBooked =
                            Boolean(bookedSeat);

                          const isReserved =
                            seat.status?.trim().toUpperCase() ===
                              "RESERVED" ||
                            reservedSeatNumbers.includes(
                              seat.seatNumber?.trim().toUpperCase()
                            );

                          const isSelected =
                            Number(selectedSeat?.seatId) ===
                            Number(seat.seatId);

                          let seatClass = "bus-seat";

                          if (isReserved) {

                            seatClass += " reserved";

                          } else if (isBooked) {

                            const bookingType =
                              bookedSeat.bookingType
                                ?.trim()
                                .toUpperCase();

                            const passengerGender =
                              bookedSeat.passengerGender
                                ?.trim()
                                .toLowerCase();

                            if (
                              bookingType === "ADMIN" ||
                              bookingType === "CONDUCTOR"
                            ) {

                              seatClass += " reserved";

                            } else if (
                              passengerGender === "male"
                            ) {

                              seatClass += " male-booked";

                            } else if (
                              passengerGender === "female"
                            ) {

                              seatClass += " female-booked";

                            } else {

                              seatClass += " reserved";
                            }

                          } else if (
                            isSelected &&
                            gender === "Male"
                          ) {

                            seatClass += " selected-male";

                          } else if (
                            isSelected &&
                            gender === "Female"
                          ) {

                            seatClass += " selected-female";

                          } else {

                            seatClass += " available";
                          }

                          return (
                            <button
                              key={seat.seatId}
                              type="button"
                              className={seatClass}
                              disabled={isBooked || isReserved}
                              onClick={() =>
                                handleSeatClick(seat)
                              }
                            >

                              <span className="seat-number">
                                {seat.seatNumber}
                              </span>

                              <span className="seat-line"></span>

                            </button>
                          );
                        })}

                      </div>
                    )}

                  </div>

                  <div className="bus-rear">
                    REAR
                  </div>

                </div>

                {error && (
                  <div className="seat-error">
                    ⚠️ {error}
                  </div>
                )}

                <div className="selected-information">

                  <div>
                    <span>Passenger Gender</span>

                    <strong>
                      {gender || "Not selected"}
                    </strong>
                  </div>

                  <div>
                    <span>Selected Seat</span>

                    <strong>
                      {selectedSeat
                        ? `Seat ${selectedSeat.seatNumber}`
                        : "Not selected"}
                    </strong>
                  </div>

                </div>

                <div className="seat-actions">

                  <button
                    type="button"
                    className="back-btn"
                    onClick={() =>
                      navigate("/search")
                    }
                  >
                    ← Back
                  </button>

                  <button
                    type="button"
                    className="continue-btn"
                    onClick={handleContinue}
                  >
                    Continue →
                  </button>

                </div>

              </div>
            </div>

            <div className="col-lg-4">

              <div className="booking-info-card">

                <div className="booking-bus-icon">
                  🚌
                </div>

                <h3>
                  Booking Information
                </h3>

                <div className="info-row">
                  <span>Route</span>

                  <strong>
                    {from && to
                      ? `${from} → ${to}`
                      : "Not selected"}
                  </strong>
                </div>

                <div className="info-row">
                  <span>Date</span>

                  <strong>
                    {date || "Selected Date"}
                  </strong>
                </div>

                <div className="info-row">
                  <span>Bus</span>

                  <strong>
                    {busName || "SmartBus Express"}
                  </strong>
                </div>

                <div className="info-row">
                  <span>Gender</span>

                  <strong>
                    {gender || "Not selected"}
                  </strong>
                </div>

                <div className="info-row">
                  <span>Seat</span>

                  <strong>
                    {selectedSeat
                      ? `No. ${selectedSeat.seatNumber}`
                      : "Not selected"}
                  </strong>
                </div>

                <div className="info-note">

                  <strong>
                    Seat Information
                  </strong>

                  <p>
                    White seats are available.
                    Blue seats represent male passengers.
                    Pink seats represent female passengers.
                    Red seats are reserved for onboard passengers,
                    admin or conductor reservations.
                    Your selected seat will use the colour for your selected gender.
                  </p>

                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      <footer className="seat-footer">
        <p>
          © 2026 SmartBus. All Rights Reserved.
        </p>
      </footer>

    </div>
  );
}

export default SeatSelection;
