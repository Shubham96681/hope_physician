import React, { useEffect } from "react";
import '../styles/Contact.css';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import heroImg from "../assets/images/hero2.jpg";

const Contact = () => {

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
      <section className="contact-info-section section">
        <div className="container contact-cards-wrapper">
          <div className="contact-card">
            <div className="icon-circle">
              <FaMapMarkerAlt size={24} color="#fff" />
            </div>
            <h3>Our Location</h3>
            <p>Hope Physicians Medical Center,<br />Ojoto, Anambra State, Nigeria</p>
          </div>

          <div className="contact-card">
            <div className="icon-circle">
              <FaPhoneAlt size={24} color="#fff" />
            </div>
            <h3>Phone Numbers</h3>
            <p>+234 900 000 0000<br />+234 901 111 1111</p>
          </div>

          <div className="contact-card">
            <div className="icon-circle">
              <FaEnvelope size={24} color="#fff" />
            </div>
            <h3>Email Us</h3>
            <p>hopephysician90@gmail.com<br />support@hopephysicians.com</p>
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
