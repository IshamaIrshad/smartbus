import { Link } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  return (
    <nav className="smart-navbar">

      <Link to="/" className="smart-brand">
        <span className="bus-icon">🚌</span>

        <span>
          <strong>SmartBus</strong>
          <small>Reservation System</small>
        </span>
      </Link>

      <div className="smart-nav-links">

        <Link to="/" className="smart-nav-link">
          Home
        </Link>

        <Link to="/search" className="smart-nav-link">
          Search Bus
        </Link>

        <Link to="/about" className="smart-nav-link">
          About
        </Link>

        <Link to="/contact" className="smart-nav-link">
          Contact
        </Link>

      </div>

      <div className="smart-nav-buttons">

        <Link to="/login" className="smart-login">
          Login
        </Link>

        <Link to="/register" className="smart-register">
          Register
        </Link>

      </div>

    </nav>
  );
}

export default Navbar;