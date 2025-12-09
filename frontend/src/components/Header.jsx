import { Link } from "react-router-dom";
import logo from "../assets/images/hope_phy_logo.webp";

const Header = () => {
  return (
    <header className="relative z-20 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
      <div className="pointer-events-none absolute inset-0">
        <span
          className="absolute -left-20 top-0 h-56 w-56 rounded-full bg-blue-500/15 blur-3xl"
          aria-hidden="true"></span>
        <span
          className="absolute right-0 -bottom-16 h-64 w-64 rounded-full bg-indigo-500/18 blur-3xl"
          aria-hidden="true"></span>
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-6">
          {/* LEFT: Logo + Name */}
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-white/10 border border-white/15 flex items-center justify-center overflow-hidden">
              <img
                src={logo}
                className="h-full w-full object-cover"
                alt="Hope Physicians Logo"
              />
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white">
              Hope Physicians
            </h1>
          </div>

          {/* CENTER: Menu */}
          <nav className="hidden lg:block">
            <ul className="flex items-center gap-2 text-sm font-semibold text-white">
              <li>
                <Link
                  className="px-3 py-2 rounded-md hover:bg-white/10 transition"
                  to="/">
                  Home
                </Link>
              </li>

              <li className="relative group">
                <button className="flex items-center gap-1 px-3 py-2 rounded-md hover:bg-white/10 transition cursor-pointer text-white focus:outline-none">
                  Services <span className="text-xs">▼</span>
                </button>
                <ul className="absolute left-0 mt-2 min-w-[220px] rounded-xl bg-white text-slate-800 shadow-xl border border-slate-200 opacity-0 translate-y-1 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:translate-y-0 group-focus-within:pointer-events-auto transition duration-200 z-30">
                  <li>
                    <Link
                      className="block px-4 py-3 hover:bg-slate-50"
                      to="/family-medicine">
                      Family Medicine
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="block px-4 py-3 hover:bg-slate-50"
                      to="/pediatric-care">
                      Pediatric Care
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="block px-4 py-3 hover:bg-slate-50"
                      to="/mens-health">
                      Men's Health
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="block px-4 py-3 hover:bg-slate-50"
                      to="/womens-health">
                      Women's Health
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="block px-4 py-3 hover:bg-slate-50"
                      to="/occupational-health">
                      Occupational Health
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="block px-4 py-3 hover:bg-slate-50"
                      to="/geriatric-care">
                      Geriatric Care
                    </Link>
                  </li>
                </ul>
              </li>

              <li className="relative group">
                <button className="flex items-center gap-1 px-3 py-2 rounded-md hover:bg-white/10 transition cursor-pointer text-white focus:outline-none">
                  Resources <span className="text-xs">▼</span>
                </button>
                <ul className="absolute left-0 mt-2 min-w-[220px] rounded-xl bg-white text-slate-800 shadow-xl border border-slate-200 opacity-0 translate-y-1 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:translate-y-0 group-focus-within:pointer-events-auto transition duration-200 z-30">
                  <li>
                    <Link
                      className="block px-4 py-3 hover:bg-slate-50"
                      to="/patient-form">
                      Patient Form
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="block px-4 py-3 hover:bg-slate-50"
                      to="/insurance-inquiry">
                      Insurance Inquiry
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="block px-4 py-3 hover:bg-slate-50"
                      to="/payment-policy">
                      Payment Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="block px-4 py-3 hover:bg-slate-50"
                      to="/insurance">
                      Insurance
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="block px-4 py-3 hover:bg-slate-50"
                      to="/local-resources">
                      Local Resources
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="block px-4 py-3 hover:bg-slate-50"
                      to="/jobs-careers">
                      Jobs and Careers
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="block px-4 py-3 hover:bg-slate-50"
                      to="/faqs">
                      FAQs
                    </Link>
                  </li>
                </ul>
              </li>

              <li>
                <Link
                  className="px-3 py-2 rounded-md hover:bg-white/10 transition"
                  to="/doctors">
                  Doctors
                </Link>
              </li>
              <li>
                <Link
                  className="px-3 py-2 rounded-md hover:bg-white/10 transition"
                  to="/departments">
                  Departments
                </Link>
              </li>
              <li>
                <Link
                  className="px-3 py-2 rounded-md hover:bg-white/10 transition"
                  to="/contact">
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          {/* RIGHT: Action Buttons */}
          <div className="flex items-center gap-3">
            <Link
              to="/appointment"
              className="inline-flex items-center gap-2 rounded-full bg-white text-blue-700 px-4 py-2 font-semibold shadow-md hover:-translate-y-0.5 hover:shadow-lg transition">
              <span>Book</span>
              <span>Appointment</span>
            </Link>
            <Link
              to="/portal/login"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 text-white px-4 py-2 font-semibold hover:bg-white/10 transition">
              <span>Login</span>
              <span>Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
