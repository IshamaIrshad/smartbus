import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Contact.css";

function Contact() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
    setSuccess("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!formData.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!formData.subject.trim()) {
      setError("Please enter a subject.");
      return;
    }

    if (!formData.message.trim()) {
      setError("Please enter your message.");
      return;
    }

    setSuccess(
      "Thank you for contacting SmartBus. We will get back to you soon."
    );

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className="contact-page">

      {/* Hero Section */}

      <section
        className="contact-hero"
        style={{
          backgroundImage:
            "linear-gradient(rgba(8,48,72,0.78), rgba(8,48,72,0.78)), url('/images/bus3.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="contact-hero-content">

          <span>GET IN TOUCH</span>

          <h1>Contact Us</h1>

          <p>
            Have a question or need assistance?
            We're here to help.
          </p>

        </div>
      </section>


      {/* Contact Section */}

      <section className="contact-section">

        <div className="container">

          <div className="row g-5">

            {/* Contact Information */}

            <div className="col-lg-5">

              <div className="contact-info">

                <span className="contact-label">
                  CONTACT SMARTBUS
                </span>

                <h2>
                  We'd Love to Hear From You
                </h2>

                <p>
                  If you have questions about bus bookings,
                  seat selection or our services, feel free
                  to contact the SmartBus team.
                </p>


                <div className="contact-item">

                  <div className="contact-icon">
                    📍
                  </div>

                  <div>
                    <h4>Address</h4>
                    <p>Colombo, Sri Lanka</p>
                  </div>

                </div>


                <div className="contact-item">

                  <div className="contact-icon">
                    📞
                  </div>

                  <div>
                    <h4>Phone</h4>
                    <p>+94 11 234 5678</p>
                  </div>

                </div>


                <div className="contact-item">

                  <div className="contact-icon">
                    ✉️
                  </div>

                  <div>
                    <h4>Email</h4>
                    <p>support@smartbus.lk</p>
                  </div>

                </div>


                <div className="contact-item">

                  <div className="contact-icon">
                    🕐
                  </div>

                  <div>
                    <h4>Support Hours</h4>
                    <p>Monday - Friday, 8:00 AM - 5:00 PM</p>
                  </div>

                </div>

              </div>

            </div>


            {/* Contact Form */}

            <div className="col-lg-7">

              <div className="contact-form-card">

                <h2>Send Us a Message</h2>

                <p>
                  Fill in the form below and our team will
                  respond to your enquiry.
                </p>


                <form onSubmit={handleSubmit}>

                  <div className="row g-3">

                    <div className="col-md-6">

                      <label>Full Name</label>

                      <input
                        type="text"
                        name="name"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={handleChange}
                      />

                    </div>


                    <div className="col-md-6">

                      <label>Email Address</label>

                      <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                      />

                    </div>


                    <div className="col-12">

                      <label>Subject</label>

                      <input
                        type="text"
                        name="subject"
                        placeholder="Enter subject"
                        value={formData.subject}
                        onChange={handleChange}
                      />

                    </div>


                    <div className="col-12">

                      <label>Message</label>

                      <textarea
                        name="message"
                        rows="5"
                        placeholder="Write your message..."
                        value={formData.message}
                        onChange={handleChange}
                      ></textarea>

                    </div>

                  </div>


                  {error && (
                    <div className="contact-error">
                      {error}
                    </div>
                  )}


                  {success && (
                    <div className="contact-success">
                      {success}
                    </div>
                  )}


                  <button
                    type="submit"
                    className="contact-submit"
                  >
                    Send Message
                  </button>

                </form>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* Booking CTA */}

      <section className="contact-booking">

        <div className="container">

          <div className="contact-booking-box">

            <div>

              <span>READY TO TRAVEL?</span>

              <h2>
                Find Your Next Bus Journey
              </h2>

              <p>
                Search available buses and start your
                reservation today.
              </p>

            </div>

            <button
              onClick={() => navigate("/search")}
            >
              Search Buses
            </button>

          </div>

        </div>

      </section>


      {/* Footer */}

      <footer className="contact-footer">

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

              <p>
                SmartBus makes travelling across Sri Lanka
                easier, faster and more convenient.
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

              <h4>Services</h4>

              <div className="footer-links">

                <span>Online Bus Booking</span>
                <span>Seat Selection</span>
                <span>Secure Payment</span>
                <span>Digital Ticket</span>

              </div>

            </div>


            <div className="col-lg-3 col-md-6">

              <h4>Contact</h4>

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

            <p>
              Book • Travel • Enjoy
            </p>

          </div>

        </div>

      </footer>

    </div>
  );
}

export default Contact;