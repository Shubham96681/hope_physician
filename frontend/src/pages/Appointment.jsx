import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';
import '../styles/Forms.css';
import { submitAppointment } from '../api/appointmentApi';
import heroImg from "../assets/images/hero2.jpg";

const Appointment = () => {
  const navigate = useNavigate();
  const [formStatus, setFormStatus] = useState("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    preferredDate: "",
    preferredTime: "",
    message: ""
  });
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  // Departments matching actual services
  const departments = [
    "Family Medicine",
    "Pediatric Care",
    "Men's Health",
    "Women's Health",
    "Occupational Health",
    "Geriatric Care"
  ];

  // Available time slots
  const timeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM"
  ];

  useEffect(() => {
    document.title = "Book Appointment — Hope Physicians";
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!formData.department) {
      newErrors.department = "Please select a department";
    }

    if (!formData.preferredDate) {
      newErrors.preferredDate = "Please select a preferred date";
    } else {
      // Check if date is in the past
      const selectedDate = new Date(formData.preferredDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.preferredDate = "Please select a future date";
      }
    }

    if (!formData.preferredTime) {
      newErrors.preferredTime = "Please select a preferred time";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Show toast message
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
    }, 5000);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      showToast("Please fill in all required fields correctly", "error");
      return;
    }

    setFormStatus("sending");

    try {
      await submitAppointment({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        department: formData.department,
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTime,
        message: formData.message || ""
      });

      // Success
      showToast("Appointment request submitted successfully! We will contact you soon to confirm.", "success");
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        department: "",
        preferredDate: "",
        preferredTime: "",
        message: ""
      });
      
      // Optionally redirect after a delay
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (err) {
      console.error("Appointment submission error:", err);
      
      // Show error message
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          "Failed to submit appointment. Please try again or call us at 252-522-3663.";
      showToast(errorMessage, "error");
    } finally {
      setFormStatus("idle");
    }
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="page">
      {/* HERO SECTION */}
      <section
        className="hero-section"
        style={{ backgroundImage: `url(${heroImg})` }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content container">
          <h1>Book an Appointment</h1>
          <p className="subheading">
            Schedule your visit with our healthcare professionals
          </p>
        </div>
      </section>

      {/* APPOINTMENT FORM SECTION */}
      <section className="section" id="appointment-form">
        <div className="container">
          <div className="appointment-box">
            <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '30px' }}>
              Schedule Your Appointment
            </h2>
            <p style={{ textAlign: 'center', marginBottom: '30px', color: '#666' }}>
              Please fill out the form below and we'll contact you to confirm your appointment time.
            </p>

            {/* Toast Notification */}
            {toast.show && (
              <div 
                className={`form-toast ${toast.type}`}
                style={{
                  marginBottom: '20px',
                  padding: '15px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  animation: 'fadeIn 0.3s ease'
                }}
                role="alert"
              >
                {toast.message}
              </div>
            )}

            <form
              id="appointmentForm"
              className="appointment-form"
              onSubmit={handleSubmit}
              aria-live="polite"
              noValidate
            >
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Your Name *</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    aria-invalid={errors.name ? "true" : "false"}
                    aria-describedby={errors.name ? "name-error" : undefined}
                  />
                  {errors.name && (
                    <span id="name-error" className="error-message" style={{ color: '#d32f2f', fontSize: '12px', marginTop: '4px' }}>
                      {errors.name}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="example@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    aria-invalid={errors.email ? "true" : "false"}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                  {errors.email && (
                    <span id="email-error" className="error-message" style={{ color: '#d32f2f', fontSize: '12px', marginTop: '4px' }}>
                      {errors.email}
                    </span>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="(252) 522-3663"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    aria-invalid={errors.phone ? "true" : "false"}
                    aria-describedby={errors.phone ? "phone-error" : undefined}
                  />
                  {errors.phone && (
                    <span id="phone-error" className="error-message" style={{ color: '#d32f2f', fontSize: '12px', marginTop: '4px' }}>
                      {errors.phone}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="department">Select Department *</label>
                  <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                    aria-invalid={errors.department ? "true" : "false"}
                    aria-describedby={errors.department ? "department-error" : undefined}
                  >
                    <option value="">Choose a department</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                  {errors.department && (
                    <span id="department-error" className="error-message" style={{ color: '#d32f2f', fontSize: '12px', marginTop: '4px' }}>
                      {errors.department}
                    </span>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="preferredDate">Preferred Date *</label>
                  <input
                    id="preferredDate"
                    name="preferredDate"
                    type="date"
                    value={formData.preferredDate}
                    onChange={handleChange}
                    min={getMinDate()}
                    required
                    aria-invalid={errors.preferredDate ? "true" : "false"}
                    aria-describedby={errors.preferredDate ? "date-error" : undefined}
                  />
                  {errors.preferredDate && (
                    <span id="date-error" className="error-message" style={{ color: '#d32f2f', fontSize: '12px', marginTop: '4px' }}>
                      {errors.preferredDate}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="preferredTime">Preferred Time *</label>
                  <select
                    id="preferredTime"
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleChange}
                    required
                    aria-invalid={errors.preferredTime ? "true" : "false"}
                    aria-describedby={errors.preferredTime ? "time-error" : undefined}
                  >
                    <option value="">Select Time</option>
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                  {errors.preferredTime && (
                    <span id="time-error" className="error-message" style={{ color: '#d32f2f', fontSize: '12px', marginTop: '4px' }}>
                      {errors.preferredTime}
                    </span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">Additional Message (Optional)</label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Write any details you want us to know..."
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                />
              </div>

              <div className="form-actions">
                <button 
                  type="submit" 
                  className="form-btn" 
                  disabled={formStatus === "sending"}
                  style={{
                    opacity: formStatus === "sending" ? 0.7 : 1,
                    cursor: formStatus === "sending" ? "not-allowed" : "pointer",
                    width: '100%',
                    padding: '15px',
                    fontSize: '16px'
                  }}
                >
                  {formStatus === "sending" ? (
                    <>
                      <span style={{ marginRight: '8px' }}>⏳</span>
                      Sending...
                    </>
                  ) : (
                    "Submit Appointment Request"
                  )}
                </button>
              </div>

              <p style={{ 
                marginTop: '20px', 
                fontSize: '13px', 
                color: '#666', 
                textAlign: 'center',
                lineHeight: '1.6'
              }}>
                By submitting this form, you agree to be contacted by Hope Physicians regarding your appointment request. 
                We will call or email you to confirm your appointment time.
              </p>
            </form>
          </div>

          {/* CONTACT INFO */}
          <div style={{ 
            marginTop: '40px', 
            textAlign: 'center',
            padding: '30px',
            background: '#f6f8fb',
            borderRadius: '12px'
          }}>
            <h3 style={{ marginBottom: '15px', color: '#004aad' }}>Prefer to Call?</h3>
            <p style={{ marginBottom: '10px', fontSize: '18px', fontWeight: '600', color: '#333' }}>
              Phone: <a href="tel:2525223663" style={{ color: '#004aad', textDecoration: 'none' }}>252-522-3663</a>
            </p>
            <p style={{ marginBottom: '10px', fontSize: '16px', color: '#666' }}>
              Office Hours: Monday - Thursday: 8:00 AM - 5:00 PM | Friday: 8:00 AM - 12:00 PM
            </p>
            <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
              For emergencies, please call 911
            </p>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .form-group input:invalid:not(:placeholder-shown),
        .form-group select:invalid:not(:placeholder-shown) {
          border-color: #d32f2f;
        }

        .form-group input:valid:not(:placeholder-shown),
        .form-group select:valid:not(:placeholder-shown) {
          border-color: #4caf50;
        }

        .form-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .form-btn:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 74, 173, 0.3);
        }
      `}</style>
    </div>
  );
};

export default Appointment;

