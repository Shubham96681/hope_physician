import React, { useState } from 'react';
import '../../styles/Home.css';
import '../../styles/Forms.css';
import heroImg from "../../assets/images/hero2.jpg";

const InsuranceInquiry = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    insuranceProvider: '',
    policyNumber: '',
    groupNumber: '',
    inquiryType: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    alert('Thank you for your inquiry. We will contact you shortly.');
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      insuranceProvider: '',
      policyNumber: '',
      groupNumber: '',
      inquiryType: '',
      message: ''
    });
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
          <h1>Insurance Inquiry</h1>
          <p className="subheading">
            Have questions about your insurance coverage? We're here to help.
          </p>
        </div>
      </section>

      {/* INQUIRY FORM */}
      <section className="section">
        <div className="container">
          <div className="appointment-box">
            <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#004aad' }}>
              Insurance Coverage Inquiry
            </h2>
            <p style={{ textAlign: 'center', marginBottom: '30px', color: '#666' }}>
              Please fill out the form below and our insurance department will contact you within 1-2 business days.
            </p>

            <form className="appointment-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(XXX) XXX-XXXX"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Insurance Provider *</label>
                <input
                  type="text"
                  name="insuranceProvider"
                  value={formData.insuranceProvider}
                  onChange={handleChange}
                  placeholder="e.g., Blue Cross Blue Shield, Aetna, etc."
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="form-group">
                  <label>Policy Number</label>
                  <input
                    type="text"
                    name="policyNumber"
                    value={formData.policyNumber}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Group Number</label>
                  <input
                    type="text"
                    name="groupNumber"
                    value={formData.groupNumber}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Type of Inquiry *</label>
                <select
                  name="inquiryType"
                  value={formData.inquiryType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select an option</option>
                  <option value="coverage">Coverage Verification</option>
                  <option value="network">Network Participation</option>
                  <option value="benefits">Benefits & Deductibles</option>
                  <option value="claim">Claim Status</option>
                  <option value="billing">Billing Question</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Message / Additional Information</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Please provide any additional details about your inquiry..."
                />
              </div>

              <button type="submit" className="form-btn">Submit Inquiry</button>
            </form>
          </div>

          {/* CONTACT INFO */}
          <div style={{ marginTop: '40px', textAlign: 'center' }}>
            <div style={{ background: '#f6f8fb', padding: '30px', borderRadius: '12px', maxWidth: '600px', margin: '0 auto' }}>
              <h3 style={{ marginBottom: '15px', color: '#004aad' }}>Insurance/Billing Department</h3>
              <p style={{ marginBottom: '10px' }}>
                <strong>Phone:</strong> 252.522.3663
              </p>
              <p style={{ marginBottom: '10px' }}>
                <strong>Fax:</strong> 252.522.3660
              </p>
              <p style={{ marginBottom: '10px' }}>
                <strong>Office Hours:</strong> Monday - Friday, 8:00 AM - 5:00 PM
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InsuranceInquiry;
