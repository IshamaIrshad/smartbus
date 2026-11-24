import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Register.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    password: "",
    confirmPassword: "",
    terms: false
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full Name is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email Address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone Number is required.";
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone Number must contain exactly 10 digits.";
    }

    if (!formData.gender) {
      newErrors.gender = "Please select your gender.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (!formData.terms) {
      newErrors.terms = "Please accept the Terms & Conditions.";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccess("");
    setServerError("");

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: formData.fullName,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            gender: formData.gender
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Registration failed. Please try again."
        );
      }

      setSuccess("🎉 Registration Successful!");

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        gender: "",
        password: "",
        confirmPassword: "",
        terms: false
      });

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      console.error("Registration error:", error);

      setServerError(
        error.message || "Unable to connect to the server."
      );
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">

        <div className="register-banner">
          <img
            src="/images/bus2.jpeg"
            alt="SmartBus"
          />

          <div className="banner-text">
            <h2>SmartBus Reservation</h2>
            <p>Create Your Account</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="mb-3">
            <label>Full Name</label>

            <input
              type="text"
              name="fullName"
              className="form-control"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
            />

            {errors.fullName && (
              <small className="text-danger">
                {errors.fullName}
              </small>
            )}
          </div>

          <div className="mb-3">
            <label>Email Address</label>

            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />

            {errors.email && (
              <small className="text-danger">
                {errors.email}
              </small>
            )}
          </div>

          <div className="mb-3">
            <label>Phone Number</label>

            <input
              type="text"
              name="phone"
              className="form-control"
              placeholder="07XXXXXXXX"
              value={formData.phone}
              onChange={handleChange}
            />

            {errors.phone && (
              <small className="text-danger">
                {errors.phone}
              </small>
            )}
          </div>

          <div className="mb-3">
            <label>Gender</label>

            <select
              className="form-select"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>

            {errors.gender && (
              <small className="text-danger">
                {errors.gender}
              </small>
            )}
          </div>

          <div className="mb-3">
            <label>Password</label>

            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Create Password"
              value={formData.password}
              onChange={handleChange}
            />

            {errors.password && (
              <small className="text-danger">
                {errors.password}
              </small>
            )}
          </div>

          <div className="mb-3">
            <label>Confirm Password</label>

            <input
              type="password"
              name="confirmPassword"
              className="form-control"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />

            {errors.confirmPassword && (
              <small className="text-danger">
                {errors.confirmPassword}
              </small>
            )}
          </div>

          <div className="form-check mb-3">

            <input
              className="form-check-input"
              type="checkbox"
              name="terms"
              checked={formData.terms}
              onChange={handleChange}
            />

            <label className="form-check-label ms-2">
              I agree to the Terms & Conditions
            </label>

            <br />

            {errors.terms && (
              <small className="text-danger">
                {errors.terms}
              </small>
            )}

          </div>

          {serverError && (
            <div className="alert alert-danger">
              {serverError}
            </div>
          )}

          {success && (
            <div className="alert alert-success">
              {success}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-success w-100 register-btn"
          >
            <i className="bi bi-person-plus-fill"></i>{" "}
            Create Account
          </button>

        </form>

        <div className="login-link">
          Already have an account?{" "}
          <Link to="/login">
            Login Here
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Register;