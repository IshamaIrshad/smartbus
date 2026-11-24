
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const email = formData.email.trim();
    const password = formData.password;
    const selectedRole = formData.role.toUpperCase();

    if (!email || !password || !selectedRole) {
      setError("Please fill in all fields.");
      return;
    }

    const emailPattern = /^\S+@\S+\.\S+$/;

    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      // Read the response safely, even if the backend
      // returns an empty response or non-JSON text.
      const responseText = await response.text();

      let data = {};

      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch {
          data = { message: responseText };
        }
      }

      // Handle failed login requests.
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error(
            "Invalid email or password. Please check your details or create an account."
          );
        }

        if (response.status === 403) {
          throw new Error(
            "Login was denied. Please check your account status and selected role, or contact the administrator."
          );
        }

        if (response.status === 404) {
          throw new Error(
            "Login service or account was not found. Please check your details."
          );
        }

        if (response.status >= 500) {
          throw new Error(
            "A server error occurred. Please try again later."
          );
        }

        throw new Error(
          data.message ||
          data.error ||
          "Unable to login. Please check your details and try again."
        );
      }

      const token = data.token;

      if (!token) {
        throw new Error(
          "The server did not return an authentication token. Please try again."
        );
      }

      // Normalize the role returned by the backend.
      const backendRole = String(
        data.role || data.roleName || ""
      )
        .toUpperCase()
        .replace(/^ROLE_/, "");

      // Do not allow the user to select a different role
      // from the role assigned to their account.
      if (!backendRole) {
        throw new Error(
          "Your account role could not be verified. Please contact the administrator."
        );
      }

      if (backendRole !== selectedRole) {
        throw new Error(
          `This account is registered as ${backendRole}. Please select the correct role.`
        );
      }

      // Save authentication details only after validation.
      localStorage.setItem("token", token);

      localStorage.setItem(
        "smartBusUser",
        JSON.stringify({
          email: data.email || email,
          role: backendRole,
        })
      );

      setSuccess("Login successful! Redirecting...");

      setTimeout(() => {
        switch (backendRole) {
          case "ADMIN":
            navigate("/admin-dashboard");
            break;

          case "PASSENGER":
            navigate("/passenger-dashboard");
            break;

          case "DRIVER":
            navigate("/driver-dashboard");
            break;

          case "CONDUCTOR":
            navigate("/conductor-dashboard");
            break;

          default:
            localStorage.removeItem("token");
            localStorage.removeItem("smartBusUser");
            setError("Your account role is not supported.");
            setSuccess("");
        }
      }, 700);
    } catch (err) {
      if (err instanceof TypeError) {
        setError(
          "Unable to connect to the server. Please make sure the SmartBus backend is running."
        );
      } else {
        setError(
          err.message || "Unable to login. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-icon">
          <i className="bi bi-bus-front-fill"></i>
        </div>

        <h1>Welcome Back</h1>

        <p className="login-subtitle">
          Login to your SmartBus account
        </p>

        {error && (
          <div
            className="login-message error"
            role="alert"
            aria-live="assertive"
          >
            <i className="bi bi-exclamation-circle-fill"></i>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div
            className="login-message success"
            role="status"
            aria-live="polite"
          >
            <i className="bi bi-check-circle-fill"></i>
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div className="login-field">
            <label htmlFor="login-email">Email Address</label>

            <div className="login-input-wrapper">
              <i className="bi bi-envelope"></i>

              <input
                id="login-email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="username"
                disabled={loading}
              />
            </div>
          </div>

          {/* Password */}
          <div className="login-field">
            <label htmlFor="login-password">Password</label>

            <div className="login-input-wrapper">
              <i className="bi bi-lock"></i>

              <input
                id="login-password"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                disabled={loading}
              />
            </div>
          </div>

          {/* Role */}
          <div className="login-field">
            <label htmlFor="login-role">Login As</label>

            <div className="login-input-wrapper">
              <i className="bi bi-person-badge"></i>

              <select
                id="login-role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="">Select your role</option>
                <option value="Passenger">Passenger</option>
                <option value="Admin">Admin</option>
                <option value="Driver">Driver</option>
                <option value="Conductor">Conductor</option>
              </select>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}

            {!loading && (
              <i className="bi bi-arrow-right"></i>
            )}
          </button>
        </form>

        <div className="login-register">
          <span>Don't have an account?</span>

          <button
            type="button"
            onClick={() => navigate("/register")}
            disabled={loading}
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
