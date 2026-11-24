
import "../styles/Home.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Home() {
  const navigate = useNavigate();
  const [loginMessage, setLoginMessage] = useState("");

  // Check whether the user is logged in
  const handleSearchBus = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoginMessage("Please login first to search for buses.");
      return;
    }

    setLoginMessage("");
    navigate("/search");
  };

  return (
    <div>

      {/* =========================
          HERO SECTION
      ========================= */}

      <section
        className="hero"
        style={{
          backgroundImage: "url('/images/hero.jpg')",
        }}
      >
        <div className="hero-overlay">

          <h1>Travel Across Sri Lanka with SmartBus</h1>

          <p>
            Book your bus tickets online quickly, safely and conveniently
            across Sri Lanka.
          </p>

          <div className="search-box">

            <select defaultValue="">
              <option value="" disabled>
                Select Pickup
              </option>
              <option value="Colombo">Colombo</option>
              <option value="Kandy">Kandy</option>
              <option value="Galle">Galle</option>
              <option value="Jaffna">Jaffna</option>
              <option value="Matara">Matara</option>
            </select>

            <select defaultValue="">
              <option value="" disabled>
                Select Destination
              </option>
              <option value="Colombo">Colombo</option>
              <option value="Kandy">Kandy</option>
              <option value="Galle">Galle</option>
              <option value="Jaffna">Jaffna</option>
              <option value="Matara">Matara</option>
            </select>

            <input type="date" />

            <button
              type="button"
              onClick={handleSearchBus}
            >
              Search Bus
            </button>

          </div>

          {/* Login message */}
          {loginMessage && (
            <p
              role="alert"
              style={{
                color: "#ffffff",
                backgroundColor: "#dc3545",
                padding: "10px 15px",
                borderRadius: "6px",
                marginTop: "12px",
                textAlign: "center",
                fontWeight: "600"
              }}
            >
              {loginMessage}
            </p>
          )}

        </div>
      </section>


      {/* =========================
          FEATURES
      ========================= */}

      <section className="features container">

        <div className="section-title">

          <span>WHY CHOOSE US</span>

          <h2>Why Choose SmartBus?</h2>

          <p>
            Everything you need for a simple and convenient bus
            reservation experience.
          </p>

        </div>

        <div className="row g-4">

          <div className="col-lg-3 col-md-6">

            <div className="feature-card">

              <div className="feature-icon">
                🚌
              </div>

              <h4>Easy Booking</h4>

              <p>
                Search buses and reserve your preferred seats
                quickly and easily.
              </p>

            </div>

          </div>


          <div className="col-lg-3 col-md-6">

            <div className="feature-card">

              <div className="feature-icon">
                📍
              </div>

              <h4>Live Tracking</h4>

              <p>
                Track your bus journey and stay updated with
                your travel information.
              </p>

            </div>

          </div>


          <div className="col-lg-3 col-md-6">

            <div className="feature-card">

              <div className="feature-icon">
                💳
              </div>

              <h4>Secure Payment</h4>

              <p>
                Enjoy a safe and convenient payment process
                for your bus reservation.
              </p>

            </div>

          </div>


          <div className="col-lg-3 col-md-6">

            <div className="feature-card">

              <div className="feature-icon">
                🎫
              </div>

              <h4>Digital Ticket</h4>

              <p>
                Receive your booking details and download your
                ticket after completing your reservation.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =========================
          POPULAR ROUTES
      ========================= */}

      <section className="popular-routes">

        <div className="container">

          <div className="section-title">

            <span>EXPLORE SRI LANKA</span>

            <h2>Popular Routes</h2>

            <p>
              Discover popular destinations and book your next
              journey with SmartBus.
            </p>

          </div>


          <div className="row g-4">


            {/* Colombo - Kandy */}

            <div className="col-lg-4 col-md-6">

              <div className="route-card">

                <div className="route-image">

                  <img
                    src="/images/bus5.jpg"
                    alt="Colombo to Kandy bus"
                  />

                  <span className="route-badge">
                    Popular
                  </span>

                </div>


                <div className="route-content">

                  <div className="route-names">

                    <div>
                      <small>FROM</small>
                      <strong>Colombo</strong>
                    </div>

                    <span className="route-arrow">
                      →
                    </span>

                    <div className="destination">
                      <small>TO</small>
                      <strong>Kandy</strong>
                    </div>

                  </div>


                  <div className="route-info">

                    <span>
                      🕐 3h 30m
                    </span>

                    <span>
                      📅 Daily
                    </span>

                  </div>


                  <div className="route-footer">

                    <div>
                      <small>Starting from</small>

                      <strong>
                        Rs. 1,500
                      </strong>
                    </div>

                    <button
                      type="button"
                      className="route-button"
                      onClick={handleSearchBus}
                    >
                      View Seats
                    </button>

                  </div>

                </div>

              </div>

            </div>


            {/* Colombo - Galle */}

            <div className="col-lg-4 col-md-6">

              <div className="route-card">

                <div className="route-image">

                  <img
                    src="/images/bus2.jpeg"
                    alt="Colombo to Galle bus"
                  />

                  <span className="route-badge">
                    Popular
                  </span>

                </div>


                <div className="route-content">

                  <div className="route-names">

                    <div>
                      <small>FROM</small>
                      <strong>Colombo</strong>
                    </div>

                    <span className="route-arrow">
                      →
                    </span>

                    <div className="destination">
                      <small>TO</small>
                      <strong>Galle</strong>
                    </div>

                  </div>


                  <div className="route-info">

                    <span>
                      🕐 2h 15m
                    </span>

                    <span>
                      📅 Daily
                    </span>

                  </div>


                  <div className="route-footer">

                    <div>
                      <small>Starting from</small>

                      <strong>
                        Rs. 1,200
                      </strong>
                    </div>

                    <button
                      type="button"
                      className="route-button"
                      onClick={handleSearchBus}
                    >
                      View Seats
                    </button>

                  </div>

                </div>

              </div>

            </div>


            {/* Kandy - Jaffna */}

            <div className="col-lg-4 col-md-6">

              <div className="route-card">

                <div className="route-image">

                  <img
                    src="/images/bus3.jpg"
                    alt="Kandy to Jaffna bus"
                  />

                  <span className="route-badge">
                    Popular
                  </span>

                </div>


                <div className="route-content">

                  <div className="route-names">

                    <div>
                      <small>FROM</small>
                      <strong>Kandy</strong>
                    </div>

                    <span className="route-arrow">
                      →
                    </span>

                    <div className="destination">
                      <small>TO</small>
                      <strong>Jaffna</strong>
                    </div>

                  </div>


                  <div className="route-info">

                    <span>
                      🕐 7h 00m
                    </span>

                    <span>
                      📅 Daily
                    </span>

                  </div>


                  <div className="route-footer">

                    <div>
                      <small>Starting from</small>

                      <strong>
                        Rs. 2,800
                      </strong>
                    </div>

                    <button
                      type="button"
                      className="route-button"
                      onClick={handleSearchBus}
                    >
                      View Seats
                    </button>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =========================
          FOOTER
      ========================= */}

      <footer className="smart-footer">

        <div className="container">

          <div className="row g-5">


            {/* Brand */}

            <div className="col-lg-4 col-md-6">

              <div className="footer-brand">

                <div className="footer-logo">
                  🚌
                </div>

                <div>
                  <h3>SmartBus</h3>
                  <span>Reservation System</span>
                </div>

              </div>

              <p className="footer-description">
                SmartBus makes travelling across Sri Lanka easier.
                Search buses, select your preferred seats and book
                your journey quickly and conveniently.
              </p>

            </div>


            {/* Quick Links */}

            <div className="col-lg-2 col-md-6">

              <h4>Quick Links</h4>

              <ul className="footer-links">

                <li>
                  <button
                    type="button"
                    onClick={() => navigate("/")}
                  >
                    Home
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    onClick={handleSearchBus}
                  >
                    Search Bus
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    onClick={() => navigate("/about")}
                  >
                    About Us
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    onClick={() => navigate("/contact")}
                  >
                    Contact
                  </button>
                </li>

              </ul>

            </div>


            {/* Services */}

            <div className="col-lg-3 col-md-6">

              <h4>Our Services</h4>

              <ul className="footer-links">

                <li>Online Bus Booking</li>

                <li>Seat Selection</li>

                <li>Secure Payment</li>

                <li>Digital Ticket</li>

                <li>Booking History</li>

              </ul>

            </div>


            {/* Contact */}

            <div className="col-lg-3 col-md-6">

              <h4>Contact Us</h4>

              <div className="footer-contact">

                <p>
                  📍 Colombo, Sri Lanka
                </p>

                <p>
                  📞 +94 11 234 5678
                </p>

                <p>
                  ✉️ support@smartbus.lk
                </p>

              </div>


              <div className="footer-social">

                <a href="#facebook" aria-label="Facebook">
                  f
                </a>

                <a href="#instagram" aria-label="Instagram">
                  ◎
                </a>

                <a href="#twitter" aria-label="Twitter">
                  𝕏
                </a>

              </div>

            </div>

          </div>


          {/* Bottom Footer */}

          <div className="footer-bottom">

            <p>
              © 2026 SmartBus. All Rights Reserved.
            </p>

            <div>

              <a href="#privacy">
                Privacy Policy
              </a>

              <a href="#terms">
                Terms & Conditions
              </a>

            </div>

          </div>

        </div>

      </footer>

    </div>
  );
}

export default Home;
