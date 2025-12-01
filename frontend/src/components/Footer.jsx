import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-container">
        {/* Left: Brand + Motto */}
        <div className="footer-section">
          <h2 className="footer-title">Hope Physicians</h2>
          <p className="footer-motto">Caring for Life</p>

          {/* Social Media Icons - Ash Colored */}
          <div className="footer-socials">
            <a href="#" className="social-icon">
              <i className="bi bi-facebook"></i>
            </a>
            <a href="#" className="social-icon">
              <i className="bi bi-twitter-x"></i>
            </a>
            <a href="#" className="social-icon">
              <i className="bi bi-linkedin"></i>
            </a>
            <a href="#" className="social-icon">
              <i className="bi bi-instagram"></i>
            </a>
          </div>
        </div>

        {/* Middle: Quick Links */}
        <div className="footer-section">
          <h3 className="footer-heading">Quick Links</h3>
          <ul className="footer-links">
            <li>
              <a href="#">Home</a>
            </li>
            <li>
              <a href="#">Services</a>
            </li>
            <li>
              <a href="#">Doctors</a>
            </li>
            <li>
              <a href="#">Contact</a>
            </li>
          </ul>
        </div>

        {/* Right: Contact Info */}
        <div className="footer-section">
          <h3 className="footer-heading">Contact Info</h3>
          <ul className="footer-contact">
            <li>
              <i className="bi bi-geo-alt-fill contact-icon"></i> 2104 North
              Herritage Street, Kinston, NC 28501
            </li>
            <li>
              <i className="bi bi-telephone-fill contact-icon"></i> 252-522-3663
            </li>
            <li>
              <i className="bi bi-telephone-fill contact-icon"></i> 252-523-3660
            </li>
            <li>
              <i className="bi bi-envelope-fill contact-icon"></i>{" "}
              hopephysician90@gmail.com
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        © 2025 Hope Physicians. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
