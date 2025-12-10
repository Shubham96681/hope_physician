import { Link } from "react-router-dom";
import "../styles/Footer.css";

const Footer = () => {
  // Social media links (can be configured via environment variables or config)
  const socialLinks = {
    facebook: "https://www.facebook.com/hopephysicians",
    twitter: "https://twitter.com/hopephysicians",
    linkedin: "https://www.linkedin.com/company/hopephysicians",
    instagram: "https://www.instagram.com/hopephysicians",
  };

  // Contact information
  const contactInfo = {
    address: "2104 North Herritage Street, Kinston, NC 28501",
    addressUrl: "https://www.google.com/maps/search/?api=1&query=2104+North+Herritage+Street+Kinston+NC+28501",
    phone1: "252-522-3663",
    phone2: "252-523-3660",
    email: "hopephysician90@gmail.com",
  };

  // Quick links
  const quickLinks = [
    { label: "Home", path: "/" },
    { label: "Services", path: "/departments" },
    { label: "Doctors", path: "/doctors" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <footer className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <span className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" aria-hidden="true"></span>
        <span className="absolute right-0 -bottom-20 h-80 w-80 rounded-full bg-indigo-500/18 blur-3xl" aria-hidden="true"></span>
        <span className="absolute inset-6 rounded-3xl border border-white/5 opacity-30" aria-hidden="true"></span>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-10 lg:grid-cols-[1.2fr,1fr,1fr]">
          {/* Left: Brand + Motto */}
          <div className="space-y-4">
            <Link to="/" className="block">
              <h2 className="text-2xl font-bold text-white hover:text-blue-300 transition-colors">Hope Physicians</h2>
            </Link>
            <p className="text-slate-300">Caring for Life</p>
            <div className="flex gap-3">
              <a 
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-white/15 hover:border-blue-400 transition-all"
                aria-label="Visit our Facebook page"
              >
                <i className="bi bi-facebook"></i>
              </a>
              <a 
                href={socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-white/15 hover:border-blue-400 transition-all"
                aria-label="Visit our Twitter page"
              >
                <i className="bi bi-twitter-x"></i>
              </a>
              <a 
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-white/15 hover:border-blue-400 transition-all"
                aria-label="Visit our LinkedIn page"
              >
                <i className="bi bi-linkedin"></i>
              </a>
              <a 
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-white/15 hover:border-blue-400 transition-all"
                aria-label="Visit our Instagram page"
              >
                <i className="bi bi-instagram"></i>
              </a>
            </div>
          </div>

          {/* Middle: Quick Links */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2 text-slate-200">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path}
                    className="hover:text-white transition-colors inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Contact Info */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white">Contact Info</h3>
            <ul className="space-y-2 text-slate-200">
              <li className="flex items-start gap-2">
                <i className="bi bi-geo-alt-fill text-blue-300 mt-1 flex-shrink-0"></i>
                <a 
                  href={contactInfo.addressUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors hover:underline"
                >
                  {contactInfo.address}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <i className="bi bi-telephone-fill text-blue-300 flex-shrink-0"></i>
                <a 
                  href={`tel:${contactInfo.phone1.replace(/-/g, '')}`}
                  className="hover:text-white transition-colors hover:underline"
                >
                  {contactInfo.phone1}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <i className="bi bi-telephone-fill text-blue-300 flex-shrink-0"></i>
                <a 
                  href={`tel:${contactInfo.phone2.replace(/-/g, '')}`}
                  className="hover:text-white transition-colors hover:underline"
                >
                  {contactInfo.phone2}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <i className="bi bi-envelope-fill text-blue-300 flex-shrink-0"></i>
                <a 
                  href={`mailto:${contactInfo.email}`}
                  className="hover:text-white transition-colors hover:underline break-all"
                >
                  {contactInfo.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-sm text-slate-300 text-center">
          © {new Date().getFullYear()} Hope Physicians. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
