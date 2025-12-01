import { Link } from "react-router-dom";
import "../styles/Header.css";
import logo from "../assets/images/hope_phy_logo.webp";

const Header = () => {
  return (
    <header className="navbar">
      <div className="container nav-row">
        {/* LEFT: Logo + Name */}
        <div className="nav-left">
          <img src={logo} className="logo-img" alt="Hope Physicians Logo" />
          <h1 className="hospital-name">Hope Physicians</h1>
        </div>

        {/* CENTER: Menu */}
        <nav className="nav-center">
          <ul className="nav-links">
            <li>
              <Link to="/">Home</Link>
            </li>

            {/* SERVICES Dropdown - No link, just dropdown trigger */}
            <li className="dropdown">
              <span className="dropdown-toggle">
                Services <span className="arrow">▼</span>
              </span>
              <ul className="dropdown-menu">
                <li>
                  <Link to="/family-medicine">Family Medicine</Link>
                </li>
                <li>
                  <Link to="/pediatric-care">Pediatric Care</Link>
                </li>
                <li>
                  <Link to="/mens-health">Men's Health</Link>
                </li>
                <li>
                  <Link to="/womens-health">Women's Health</Link>
                </li>
                <li>
                  <Link to="/occupational-health">Occupational Health</Link>
                </li>
                <li>
                  <Link to="/geriatric-care">Geriatric Care</Link>
                </li>
              </ul>
            </li>

            {/* RESOURCES Dropdown - No link, just dropdown trigger */}
            <li className="dropdown">
              <span className="dropdown-toggle">
                Resources <span className="arrow">▼</span>
              </span>
              <ul className="dropdown-menu">
                <li>
                  <Link to="/patient-form">Patient Form</Link>
                </li>
                <li>
                  <Link to="/insurance-inquiry">Insurance Inquiry</Link>
                </li>
                <li>
                  <Link to="/payment-policy">Payment Policy</Link>
                </li>
                <li>
                  <Link to="/insurance">Insurance</Link>
                </li>
                <li>
                  <Link to="/local-resources">Local Resources</Link>
                </li>
                <li>
                  <Link to="/jobs-careers">Jobs and Careers</Link>
                </li>
                <li>
                  <Link to="/faqs">FAQs</Link>
                </li>
              </ul>
            </li>

            <li>
              <Link to="/doctors">Doctors</Link>
            </li>
            <li>
              <Link to="/departments">Departments</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>
        </nav>

        {/* RIGHT: Action Buttons */}
        <div className="nav-buttons">
          <Link to="/appointment" className="btn-appointment">
            <span>Book</span>
            <span>Appointment</span>
          </Link>
          <Link to="/portal/login" className="btn-portal">
            <span>Login</span>
            <span>Portal</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
