import React, { useEffect } from "react";
import '../styles/Contact.css';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import heroImg from "../assets/images/hero2.jpg";

const Contact = () => {
  const contactCards = [
    {
      key: "location",
      title: "Our Location",
      lines: ["Hope Physicians Medical Center,", "Ojoto, Anambra State, Nigeria"],
      icon: <FaMapMarkerAlt size={24} color="#fff" />,
    },
    {
      key: "phone",
      title: "Phone Numbers",
      lines: ["+234 900 000 0000", "+234 901 111 1111"],
      icon: <FaPhoneAlt size={24} color="#fff" />,
    },
    {
      key: "email",
      title: "Email Us",
      lines: ["hopephysician90@gmail.com", "support@hopephysicians.com"],
      icon: <FaEnvelope size={24} color="#fff" />,
    },
  ];

  useEffect(() => {
    document.title = "Contact Us — Hope Physicians";

    const reveals = document.querySelectorAll('.reveal-on-scroll');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    reveals.forEach(r => observer.observe(r));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* HERO SECTION */}
      <section className="hero-section contact-hero" style={{ backgroundImage: `url(${heroImg})` }}>
        <div className="hero-overlay"></div>
        <div className="hero-content container reveal-on-scroll">
          <h1>Contact Us</h1>
          <p>We’re here to assist you with any questions or appointment needs.</p>
          <div className="hero-ctas">
            <a href="#contact-form" className="hero-btn">Send Message</a>
            <a href="/" className="hero-ghost">Home</a>
          </div>
        </div>
      </section>

      {/* CONTACT INFO CARDS */}
      <section className="relative overflow-hidden py-14 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white">
        <div className="pointer-events-none absolute inset-0">
          <span className="absolute -left-24 top-6 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" aria-hidden="true"></span>
          <span className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-indigo-500/18 blur-3xl" aria-hidden="true"></span>
          <span className="absolute inset-6 rounded-3xl border border-white/5 opacity-40" aria-hidden="true"></span>
          <span className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" aria-hidden="true"></span>
        </div>
        <div className="container relative z-10">
          <div className="text-center space-y-3 mb-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-500/15 text-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              Get in touch
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Contact Information</h2>
            <p className="text-slate-200 text-lg leading-relaxed max-w-2xl mx-auto">
              Reach us anytime for appointments, emergencies, or general inquiries.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {contactCards.map((card) => (
              <div
                key={card.key}
                className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur p-5 shadow-[0_14px_36px_rgba(0,0,0,0.28)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(0,0,0,0.32)] flex flex-col gap-3">
                <div className="relative flex items-center justify-center h-14 w-14 rounded-full bg-white/10 border border-white/15 shadow-[0_10px_24px_rgba(0,0,0,0.2)]">
                  <span className="absolute inset-0 rounded-full bg-white/10 blur-lg"></span>
                  {card.icon}
                </div>
                <h3 className="text-lg font-semibold text-white">{card.title}</h3>
                <p className="text-slate-200 text-base leading-relaxed m-0 space-y-1">
                  {card.lines.map((line, idx) => (
                    <span key={idx} className="block">
                      {line}
                    </span>
                  ))}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT FORM */}
      <section id="contact-form" className="contact-form-section section">
        <div className="container">
          <div className="message-card">
            <h2>Send Us a Message</h2>
            <p>We respond as quickly as possible.</p>
            <form className="contact-form">
              <input type="text" name="name" placeholder="Full Name" required />
              <input type="email" name="email" placeholder="Email Address" required />
              <input type="text" name="phone" placeholder="Phone Number" required />
              <textarea name="message" placeholder="Your Message..." required></textarea>
              <button type="submit" className="contact-btn">Send Message</button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
