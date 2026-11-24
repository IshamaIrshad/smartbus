import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/DriverProfile.css";

function DriverProfile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: "Kasun Perera",
    email: "kasun.perera@gmail.com",
    phone: "077 123 4567",
    nic: "199812345678",
    employeeId: "DRV001",
    licenseNumber: "B1234567",
    licenseExpiry: "2028-06-15",
    address: "Colombo, Sri Lanka",
    joinedDate: "January 15, 2024",
  });

  const [editing, setEditing] = useState(false);

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
    navigate("/login");
  };

  return (
    <div className="driver-profile-page">

      {/* Sidebar */}
      <aside className="driver-profile-sidebar">

        <div className="driver-profile-logo">
          <div className="driver-profile-logo-icon">
            <i className="bi bi-bus-front-fill"></i>
          </div>

          <div>
            <h2>SmartBus</h2>
            <span>Driver Portal</span>
          </div>
        </div>

        <nav className="driver-profile-navigation">

          <p className="driver-profile-nav-title">MAIN MENU</p>

          <button
            className="driver-profile-nav-item"
            onClick={() => navigate("/driver-dashboard")}
          >
            <i className="bi bi-grid-1x2-fill"></i>
            <span>Dashboard</span>
          </button>

          <button
            className="driver-profile-nav-item"
            onClick={() => navigate("/driver-my-trip")}
          >
            <i className="bi bi-signpost-2-fill"></i>
            <span>My Trip</span>
          </button>

          <button
            className="driver-profile-nav-item"
            onClick={() => navigate("/driver-passengers")}
          >
            <i className="bi bi-people-fill"></i>
            <span>Passengers</span>
          </button>

          <button
            className="driver-profile-nav-item"
            onClick={() => navigate("/driver-track-bus")}
          >
            <i className="bi bi-geo-alt-fill"></i>
            <span>Track Bus</span>
          </button>

          <button
            className="driver-profile-nav-item active"
            onClick={() => navigate("/driver-profile")}
          >
            <i className="bi bi-person-fill"></i>
            <span>Profile</span>
          </button>
        </nav>

        <div className="driver-profile-sidebar-bottom">

          <button
            className="driver-profile-bottom-link"
            onClick={() => navigate("/")}
          >
            <i className="bi bi-globe2"></i>
            <span>View Website</span>
          </button>

          <button
            className="driver-profile-logout-btn"
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-right"></i>
            <span>Logout</span>
          </button>

        </div>
      </aside>

      {/* Main Content */}
      <main className="driver-profile-main">

        {/* Top Bar */}
        <header className="driver-profile-topbar">

          <div>
            <span className="driver-profile-page-label">
              DRIVER PORTAL
            </span>

            <h1>My Profile</h1>
          </div>

          <div className="driver-profile-user">

            <div className="driver-profile-avatar">
              KP
            </div>

            <div className="driver-profile-user-info">
              <strong>{profile.name}</strong>
              <span>Driver</span>
            </div>

          </div>
        </header>

        {/* Page Content */}
        <section className="driver-profile-content">

          {/* Profile Header */}
          <div className="driver-profile-header-card">

            <div className="driver-profile-large-avatar">
              KP
            </div>

            <div className="driver-profile-header-info">
              <h2>{profile.name}</h2>
              <p>
                <i className="bi bi-person-badge-fill"></i>
                Professional Driver
              </p>

              <span className="driver-profile-status">
                <span></span>
                Active
              </span>
            </div>

            <div className="driver-profile-header-action">
              {!editing ? (
                <button
                  className="driver-profile-edit-btn"
                  onClick={() => setEditing(true)}
                >
                  <i className="bi bi-pencil-fill"></i>
                  Edit Profile
                </button>
              ) : (
                <div className="driver-profile-edit-actions">

                  <button
                    className="driver-profile-cancel-btn"
                    onClick={() => setEditing(false)}
                  >
                    Cancel
                  </button>

                  <button
                    className="driver-profile-save-btn"
                    onClick={handleSave}
                  >
                    <i className="bi bi-check-lg"></i>
                    Save Changes
                  </button>

                </div>
              )}
            </div>

          </div>

          {/* Personal Information */}
          <div className="driver-profile-section">

            <div className="driver-profile-section-title">
              <div className="driver-profile-section-icon">
                <i className="bi bi-person-fill"></i>
              </div>

              <div>
                <h3>Personal Information</h3>
                <p>Your basic personal details</p>
              </div>
            </div>

            <div className="driver-profile-form-grid">

              <div className="driver-profile-field">
                <label>Full Name</label>

                {editing ? (
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                  />
                ) : (
                  <div className="driver-profile-value">
                    <i className="bi bi-person"></i>
                    {profile.name}
                  </div>
                )}
              </div>

              <div className="driver-profile-field">
                <label>Employee ID</label>

                <div className="driver-profile-value disabled-value">
                  <i className="bi bi-person-badge"></i>
                  {profile.employeeId}
                </div>
              </div>

              <div className="driver-profile-field">
                <label>Email Address</label>

                {editing ? (
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                  />
                ) : (
                  <div className="driver-profile-value">
                    <i className="bi bi-envelope"></i>
                    {profile.email}
                  </div>
                )}
              </div>

              <div className="driver-profile-field">
                <label>Phone Number</label>

                {editing ? (
                  <input
                    type="text"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                  />
                ) : (
                  <div className="driver-profile-value">
                    <i className="bi bi-telephone"></i>
                    {profile.phone}
                  </div>
                )}
              </div>

              <div className="driver-profile-field">
                <label>NIC Number</label>

                <div className="driver-profile-value disabled-value">
                  <i className="bi bi-card-text"></i>
                  {profile.nic}
                </div>
              </div>

              <div className="driver-profile-field">
                <label>Address</label>

                {editing ? (
                  <input
                    type="text"
                    name="address"
                    value={profile.address}
                    onChange={handleChange}
                  />
                ) : (
                  <div className="driver-profile-value">
                    <i className="bi bi-geo-alt"></i>
                    {profile.address}
                  </div>
                )}
              </div>

            </div>

          </div>

          {/* Driver Information */}
          <div className="driver-profile-section">

            <div className="driver-profile-section-title">
              <div className="driver-profile-section-icon">
                <i className="bi bi-steering-wheel"></i>
              </div>

              <div>
                <h3>Driver Information</h3>
                <p>Your driving and employment details</p>
              </div>
            </div>

            <div className="driver-profile-form-grid">

              <div className="driver-profile-field">
                <label>Driving License Number</label>

                <div className="driver-profile-value disabled-value">
                  <i className="bi bi-card-heading"></i>
                  {profile.licenseNumber}
                </div>
              </div>

              <div className="driver-profile-field">
                <label>License Expiry Date</label>

                <div className="driver-profile-value disabled-value">
                  <i className="bi bi-calendar-event"></i>
                  {profile.licenseExpiry}
                </div>
              </div>

              <div className="driver-profile-field">
                <label>Joined Date</label>

                <div className="driver-profile-value disabled-value">
                  <i className="bi bi-calendar-check"></i>
                  {profile.joinedDate}
                </div>
              </div>

              <div className="driver-profile-field">
                <label>Account Status</label>

                <div className="driver-profile-account-status">
                  <span></span>
                  Active
                </div>
              </div>

            </div>

          </div>

          {/* Account Security */}
          <div className="driver-profile-section">

            <div className="driver-profile-section-title">
              <div className="driver-profile-section-icon">
                <i className="bi bi-shield-lock-fill"></i>
              </div>

              <div>
                <h3>Account Security</h3>
                <p>Manage your account security</p>
              </div>
            </div>

            <div className="driver-profile-security-row">

              <div className="driver-profile-security-info">
                <div className="driver-profile-security-icon">
                  <i className="bi bi-key-fill"></i>
                </div>

                <div>
                  <h4>Password</h4>
                  <p>Keep your password secure and up to date.</p>
                </div>
              </div>

              <button
                className="driver-profile-password-btn"
                onClick={() => alert("Password change feature coming soon.")}
              >
                Change Password
              </button>

            </div>

          </div>

        </section>

      </main>
    </div>
  );
}

export default DriverProfile;