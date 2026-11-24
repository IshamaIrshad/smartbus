import { useNavigate } from "react-router-dom";
import "../styles/About.css";

function About() {
  const navigate = useNavigate();

  return (
    <div className="about-page">

      {/* =========================
          PAGE HERO
      ========================= */}

      <section
  className="about-hero"
  style={{
    backgroundImage:
      "linear-gradient(rgba(8, 48, 72, 0.78), rgba(8, 48, 72, 0.78)), url('/images/bus2.jpeg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>

  <div className="about-hero-overlay">

          <span>ABOUT SMARTBUS</span>

          <h1>Making Bus Travel Simple</h1>

          <p>
            A smarter and more convenient way to search,
            reserve and manage your bus journeys across Sri Lanka.
          </p>

        </div>

      </section>


      {/* =========================
          ABOUT INTRODUCTION
      ========================= */}

      <section className="about-intro">

        <div className="container">

          <div className="row align-items-center g-5">

            <div className="col-lg-6">

              <div className="about-image">

                <img
                  src="/images/bus1.jpg"
                  alt="SmartBus"
                />

              </div>

            </div>


            <div className="col-lg-6">

              <span className="about-label">
                WHO WE ARE
              </span>

              <h2>
                Your Journey, Our Priority
              </h2>

              <p>
                SmartBus is a modern bus reservation system
                designed to make travelling across Sri Lanka
                easier and more convenient.
              </p>

              <p>
                Our platform allows passengers to search for
                available buses, check journey information,
                select seats and reserve tickets through a
                simple online process.
              </p>

              <button
                type="button"
                className="about-button"
                onClick={() => navigate("/search")}
              >
                Find a Bus
              </button>

            </div>

          </div>

        </div>

      </section>


      {/* =========================
          WHAT WE OFFER
      ========================= */}

      <section className="about-services">

        <div className="container">

          <div className="about-section-title">

            <span>WHAT WE OFFER</span>

            <h2>Everything You Need for Your Journey</h2>

            <p>
              SmartBus brings the essential parts of bus
              reservation together in one convenient platform.
            </p>

          </div>


          <div className="row g-4">

            <div className="col-lg-4 col-md-6">

              <div className="about-service-card">

                <div className="about-service-icon">
                  🔎
                </div>

                <h3>Easy Bus Search</h3>

                <p>
                  Quickly search for buses by selecting your
                  pickup location, destination and journey date.
                </p>

              </div>

            </div>


            <div className="col-lg-4 col-md-6">

              <div className="about-service-card">

                <div className="about-service-icon">
                  💺
                </div>

                <h3>Seat Selection</h3>

                <p>
                  View available seats and select a suitable
                  seat before completing your reservation.
                </p>

              </div>

            </div>


            <div className="col-lg-4 col-md-6">

              <div className="about-service-card">

                <div className="about-service-icon">
                  🎫
                </div>

                <h3>Digital Tickets</h3>

                <p>
                  Access your booking information and receive
                  your digital ticket after completing your booking.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =========================
          OUR GOAL
      ========================= */}

      <section className="about-goal">

        <div className="container">

          <div className="about-goal-box">

            <div>

              <span>OUR GOAL</span>

              <h2>
                A Better Way to Travel
              </h2>

              <p>
                We aim to provide passengers with a simple,
                reliable and user-friendly bus reservation
                experience while making travel planning easier.
              </p>

            </div>

            <div className="goal-icon">
              🚌
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


            <div className="col-lg-2 col-md-6">

              <h4>Quick Links</h4>

              <div className="footer-links">

                <button onClick={() => navigate("/")}>
                  Home
                </button>

                <button onClick={() => navigate("/search")}>
                  Search Bus
                </button>

                <button onClick={() => navigate("/about")}>
                  About Us
                </button>

                <button onClick={() => navigate("/contact")}>
                  Contact
                </button>

              </div>

            </div>


            <div className="col-lg-3 col-md-6">

              <h4>Our Services</h4>

              <div className="footer-links">

                <span>Online Bus Booking</span>

                <span>Seat Selection</span>

                <span>Secure Payment</span>

                <span>Digital Ticket</span>

                <span>Booking History</span>

              </div>

            </div>


            <div className="col-lg-3 col-md-6">

              <h4>Contact Us</h4>

              <div className="footer-contact">

                <p>📍 Colombo, Sri Lanka</p>

                <p>📞 +94 11 234 5678</p>

                <p>✉️ support@smartbus.lk</p>

              </div>

            </div>

          </div>


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

export default About;