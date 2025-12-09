import "../styles/Footer.css";

const Footer = () => {
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
            <h2 className="text-2xl font-bold text-white">Hope Physicians</h2>
            <p className="text-slate-300">Caring for Life</p>
            <div className="flex gap-3">
              <a href="#" className="h-10 w-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-white/15 transition">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-white/15 transition">
                <i className="bi bi-twitter-x"></i>
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-white/15 transition">
                <i className="bi bi-linkedin"></i>
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-white/15 transition">
                <i className="bi bi-instagram"></i>
              </a>
            </div>
          </div>

          {/* Middle: Quick Links */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2 text-slate-200">
              <li><a className="hover:text-white transition" href="#">Home</a></li>
              <li><a className="hover:text-white transition" href="#">Services</a></li>
              <li><a className="hover:text-white transition" href="#">Doctors</a></li>
              <li><a className="hover:text-white transition" href="#">Contact</a></li>
            </ul>
          </div>

          {/* Right: Contact Info */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white">Contact Info</h3>
            <ul className="space-y-2 text-slate-200">
              <li className="flex items-start gap-2">
                <i className="bi bi-geo-alt-fill text-blue-300 mt-1"></i>
                <span>2104 North Herritage Street, Kinston, NC 28501</span>
              </li>
              <li className="flex items-center gap-2">
                <i className="bi bi-telephone-fill text-blue-300"></i>
                <span>252-522-3663</span>
              </li>
              <li className="flex items-center gap-2">
                <i className="bi bi-telephone-fill text-blue-300"></i>
                <span>252-523-3660</span>
              </li>
              <li className="flex items-center gap-2">
                <i className="bi bi-envelope-fill text-blue-300"></i>
                <span>hopephysician90@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-sm text-slate-300 text-center">
          © 2025 Hope Physicians. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
