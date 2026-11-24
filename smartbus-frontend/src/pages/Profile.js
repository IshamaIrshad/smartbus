import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";

function Profile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    userId: null,
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    address: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // =========================
  // LOAD PROFILE FROM BACKEND
  // =========================
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:8080/api/passengers/profile",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("token");
          localStorage.removeItem("smartBusUser");
          navigate("/login");
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to load profile.");
        }

        const data = await response.json();

        setProfile({
          userId: data.userId,
          fullName: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          gender: data.gender || "",
          dateOfBirth: data.dateOfBirth || "",
          address: data.address || "",
        });
      } catch (error) {
        console.error("Profile loading error:", error);
        setError("Unable to load your profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  // =========================
  // PROFILE FIELD CHANGE
  // =========================
  const handleProfileChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });

    setSuccess("");
    setError("");
  };

  // =========================
  // SAVE PROFILE
  // =========================
  const handleSaveProfile = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setError("");
      setSuccess("");

      const response = await fetch(
        `http://localhost:8080/api/passengers/${profile.userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nic: null,
            dateOfBirth: profile.dateOfBirth || null,
            address: profile.address || null,
          }),
        }
      );

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("smartBusUser");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Failed to update profile."
        );
      }

      const data = await response.json();

      setProfile({
        userId: data.userId,
        fullName: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        gender: data.gender || "",
        dateOfBirth: data.dateOfBirth || "",
        address: data.address || "",
      });

      setIsEditing(false);
      setSuccess("Profile updated successfully.");
    } catch (error) {
      console.error("Profile update error:", error);
      setError(error.message || "Unable to update profile.");
    }
  };

  // =========================
  // PASSWORD FIELD CHANGE
  // =========================
  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });

    setPasswordError("");
    setPasswordSuccess("");
  };

  // =========================
  // CHANGE PASSWORD
  // =========================
  const handleChangePassword = (e) => {
    e.preventDefault();

    if (!passwordData.currentPassword) {
      setPasswordError("Please enter your current password.");
      return;
    }

    if (!passwordData.newPassword) {
      setPasswordError("Please enter a new password.");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError(
        "New password must contain at least 6 characters."
      );
      return;
    }

    if (
      passwordData.newPassword !== passwordData.confirmPassword
    ) {
      setPasswordError("Passwords do not match.");
      return;
    }

    setPasswordError("");
    setPasswordSuccess("Password changed successfully.");

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("smartBusUser");
    navigate("/login");
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="profile-page">
        <section className="profile-header">
          <div className="container">
            <p>PASSENGER ACCOUNT</p>
            <h1>My Profile</h1>
            <span>
              Manage your personal information and account settings.
            </span>
          </div>
        </section>

        <main className="container profile-container">
          <div className="profile-success">
            Loading profile...
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="profile-page">

      {/* Header */}
      <section className="profile-header">
        <div className="container">
          <p>PASSENGER ACCOUNT</p>
          <h1>My Profile</h1>
          <span>
            Manage your personal information and account settings.
          </span>
        </div>
      </section>

      <main className="container profile-container">

        {/* Profile Overview */}
        <section className="profile-overview">

          <div className="profile-avatar-large">
            <i className="bi bi-person-fill"></i>
          </div>

          <div className="profile-main-info">
            <h2>{profile.fullName}</h2>
            <p>{profile.email}</p>

            <span className="passenger-badge">
              <i className="bi bi-person-check-fill"></i>
              Passenger
            </span>
          </div>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-right"></i>
            Logout
          </button>

        </section>

        {/* Success Message */}
        {success && (
          <div className="profile-success">
            <i className="bi bi-check-circle-fill"></i>
            {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="password-error">
            <i className="bi bi-exclamation-circle"></i>
            {error}
          </div>
        )}

        {/* Personal Information */}
        <section className="profile-card">

          <div className="card-heading">
            <div>
              <span>ACCOUNT INFORMATION</span>
              <h2>Personal Information</h2>
            </div>

            {!isEditing ? (
              <button
                className="edit-btn"
                onClick={() => setIsEditing(true)}
              >
                <i className="bi bi-pencil"></i>
                Edit Profile
              </button>
            ) : (
              <div className="edit-actions">

                <button
                  className="cancel-btn"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>

                <button
                  className="save-btn"
                  onClick={handleSaveProfile}
                >
                  <i className="bi bi-check-lg"></i>
                  Save Changes
                </button>

              </div>
            )}
          </div>

          <div className="profile-fields">

            {/* Full Name */}
            <div className="profile-field">
              <label>Full Name</label>

              <div className="field-value">
                <i className="bi bi-person"></i>
                {profile.fullName}
              </div>
            </div>

            {/* Email */}
            <div className="profile-field">
              <label>Email Address</label>

              <div className="field-value">
                <i className="bi bi-envelope"></i>
                {profile.email}
              </div>
            </div>

            {/* Phone */}
            <div className="profile-field">
              <label>Phone Number</label>

              <div className="field-value">
                <i className="bi bi-telephone"></i>
                {profile.phone}
              </div>
            </div>

            {/* Gender */}
            <div className="profile-field">
              <label>Gender</label>

              <div className="field-value">
                <i className="bi bi-gender-ambiguous"></i>
                {profile.gender}
              </div>
            </div>

            {/* Date of Birth */}
            <div className="profile-field">
              <label>Date of Birth</label>

              {isEditing ? (
                <input
                  type="date"
                  name="dateOfBirth"
                  value={profile.dateOfBirth || ""}
                  onChange={handleProfileChange}
                />
              ) : (
                <div className="field-value">
                  <i className="bi bi-calendar3"></i>
                  {profile.dateOfBirth || "Not provided"}
                </div>
              )}
            </div>

            {/* Address */}
            <div className="profile-field full-width">
              <label>Address</label>

              {isEditing ? (
                <textarea
                  name="address"
                  value={profile.address || ""}
                  onChange={handleProfileChange}
                  rows="3"
                ></textarea>
              ) : (
                <div className="field-value">
                  <i className="bi bi-geo-alt"></i>
                  {profile.address || "Not provided"}
                </div>
              )}
            </div>

          </div>
        </section>

        {/* Change Password */}
        <section className="profile-card password-card">

          <div className="card-heading">
            <div>
              <span>SECURITY</span>
              <h2>Change Password</h2>
            </div>
          </div>

          <p className="security-description">
            Update your password regularly to help keep your
            SmartBus account secure.
          </p>

          <form onSubmit={handleChangePassword}>

            <div className="password-fields">

              <div className="profile-field">
                <label>Current Password</label>

                <input
                  type="password"
                  name="currentPassword"
                  placeholder="Enter current password"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                />
              </div>

              <div className="profile-field">
                <label>New Password</label>

                <input
                  type="password"
                  name="newPassword"
                  placeholder="Enter new password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                />
              </div>

              <div className="profile-field">
                <label>Confirm New Password</label>

                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm new password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                />
              </div>

            </div>

            {passwordError && (
              <div className="password-error">
                <i className="bi bi-exclamation-circle"></i>
                {passwordError}
              </div>
            )}

            {passwordSuccess && (
              <div className="password-success">
                <i className="bi bi-check-circle"></i>
                {passwordSuccess}
              </div>
            )}

            <button
              type="submit"
              className="change-password-btn"
            >
              <i className="bi bi-shield-lock"></i>
              Change Password
            </button>

          </form>
        </section>

        {/* Back to Dashboard */}
        <div className="back-dashboard">
          <button
            onClick={() => navigate("/passenger-dashboard")}
          >
            <i className="bi bi-arrow-left"></i>
            Back to Passenger Dashboard
          </button>
        </div>

      </main>

    </div>
  );
}

export default Profile;