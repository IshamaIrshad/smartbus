import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ConductorProfile.css";

function ConductorProfile() {
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: "Chamara Silva",
    email: "chamara.silva@gmail.com",
    phone: "077 234 5678",
    employeeId: "CON001",
    nic: "199512345678",
    address: "Colombo, Sri Lanka",
    joinedDate: "March 10, 2024",
  });

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    setEditing(false);
    alert("Profile updated successfully!");
  };

  const handleLogout = () => {
    localStorage.removeItem("smartBusUser");
    navigate("/login");
  };

  return (
    <div className="conductor-profile-page">

      <aside className="conductor-profile-sidebar">

        <div className="conductor-profile-logo">
          <div>
            <i className="bi bi-bus-front-fill"></i>
          </div>

          <section>
            <h2>SmartBus</h2>
            <span>Conductor Portal</span>
          </section>
        </div>

        <nav className="conductor-profile-navigation">

          <p>MAIN MENU</p>

          <button onClick={() => navigate("/conductor-dashboard")}>
            <i className="bi bi-grid-1x2-fill"></i>
            Dashboard
          </button>

          <button onClick={() => navigate("/conductor-my-trip")}>
            <i className="bi bi-signpost-2-fill"></i>
            My Trip
          </button>

          <button onClick={() => navigate("/conductor-passengers")}>
            <i className="bi bi-people-fill"></i>
            Passengers
          </button>

          <button onClick={() => navigate("/conductor-tickets")}>
            <i className="bi bi-ticket-perforated-fill"></i>
            Tickets
          </button>

          <button onClick={() => navigate("/conductor-track-bus")}>
            <i className="bi bi-geo-alt-fill"></i>
            Track Bus
          </button>

          <button
            className="active"
            onClick={() => navigate("/conductor-profile")}
          >
            <i className="bi bi-person-fill"></i>
            Profile
          </button>

        </nav>

        <div className="conductor-profile-sidebar-bottom">

          <button onClick={() => navigate("/")}>
            <i className="bi bi-globe2"></i>
            View Website
          </button>

          <button onClick={handleLogout}>
            <i className="bi bi-box-arrow-right"></i>
            Logout
          </button>

        </div>

      </aside>

      <main className="conductor-profile-main">

        <header className="conductor-profile-topbar">

          <div>
            <span>CONDUCTOR PORTAL</span>
            <h1>My Profile</h1>
          </div>

          <div className="conductor-profile-user">
            <div>CS</div>

            <section>
              <strong>Chamara Silva</strong>
              <small>Conductor</small>
            </section>
          </div>

        </header>

        <div className="conductor-profile-content">

          <div className="conductor-profile-header">

            <div className="conductor-profile-avatar">
              CS
            </div>

            <div className="conductor-profile-header-info">

              <h2>{profile.name}</h2>

              <p>
                <i className="bi bi-person-badge-fill"></i>
                Professional Conductor
              </p>

              <span>
                <b></b>
                Active
              </span>

            </div>

            {!editing ? (
              <button
                className="conductor-profile-edit-btn"
                onClick={() => setEditing(true)}
              >
                <i className="bi bi-pencil-fill"></i>
                Edit Profile
              </button>
            ) : (
              <div className="profile-actions">

                <button
                  className="cancel-btn"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </button>

                <button
                  className="save-btn"
                  onClick={handleSave}
                >
                  <i className="bi bi-check-lg"></i>
                  Save
                </button>

              </div>
            )}

          </div>

          <div className="conductor-profile-section">

            <div className="profile-section-title">

              <div>
                <i className="bi bi-person-fill"></i>
              </div>

              <section>
                <h3>Personal Information</h3>
                <p>Your personal details</p>
              </section>

            </div>

            <div className="profile-grid">

              <div>
                <label>Full Name</label>

                {editing ? (
                  <input
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                  />
                ) : (
                  <span>
                    <i className="bi bi-person"></i>
                    {profile.name}
                  </span>
                )}
              </div>

              <div>
                <label>Employee ID</label>
                <span className="disabled">
                  <i className="bi bi-person-badge"></i>
                  {profile.employeeId}
                </span>
              </div>

              <div>
                <label>Email Address</label>

                {editing ? (
                  <input
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                  />
                ) : (
                  <span>
                    <i className="bi bi-envelope"></i>
                    {profile.email}
                  </span>
                )}
              </div>

              <div>
                <label>Phone Number</label>

                {editing ? (
                  <input
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                  />
                ) : (
                  <span>
                    <i className="bi bi-telephone"></i>
                    {profile.phone}
                  </span>
                )}
              </div>

              <div>
                <label>NIC Number</label>
                <span className="disabled">
                  <i className="bi bi-card-text"></i>
                  {profile.nic}
                </span>
              </div>

              <div>
                <label>Address</label>

                {editing ? (
                  <input
                    name="address"
                    value={profile.address}
                    onChange={handleChange}
                  />
                ) : (
                  <span>
                    <i className="bi bi-geo-alt"></i>
                    {profile.address}
                  </span>
                )}
              </div>

            </div>

          </div>

          <div className="conductor-profile-section">

            <div className="profile-section-title">

              <div>
                <i className="bi bi-person-workspace"></i>
              </div>

              <section>
                <h3>Employment Information</h3>
                <p>Your SmartBus employment details</p>
              </section>

            </div>

            <div className="profile-grid">

              <div>
                <label>Employee ID</label>

                <span className="disabled">
                  <i className="bi bi-person-badge"></i>
                  {profile.employeeId}
                </span>
              </div>

              <div>
                <label>Position</label>

                <span className="disabled">
                  <i className="bi bi-briefcase"></i>
                  Conductor
                </span>
              </div>

              <div>
                <label>Joined Date</label>

                <span className="disabled">
                  <i className="bi bi-calendar-check"></i>
                  {profile.joinedDate}
                </span>
              </div>

              <div>
                <label>Account Status</label>

                <span className="account-active">
                  <b></b>
                  Active
                </span>
              </div>

            </div>

          </div>

          <div className="conductor-profile-section">

            <div className="profile-section-title">

              <div>
                <i className="bi bi-shield-lock-fill"></i>
              </div>

              <section>
                <h3>Account Security</h3>
                <p>Manage your account security</p>
              </section>

            </div>

            <div className="security-row">

              <div>
                <i className="bi bi-key-fill"></i>

                <section>
                  <strong>Password</strong>
                  <span>
                    Keep your account password secure.
                  </span>
                </section>
              </div>

              <button
                onClick={() =>
                  alert("Password change feature coming soon.")
                }
              >
                Change Password
              </button>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

export default ConductorProfile;