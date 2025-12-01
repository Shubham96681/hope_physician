import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Home.css';
import heroImg from "../../assets/images/hero2.jpg";

const Insurance = () => {
  const acceptedPlans = [
    'Medicare',
    'Medicaid',
    'Blue Cross Blue Shield',
    'Aetna',
    'Cigna',
    'UnitedHealthcare',
    'Humana',
    'Tricare',
    'Most Medicare Advantage Plans',
    'Many Commercial Insurance Plans'
  ];

  return (
    <div className="page">
      {/* HERO SECTION */}
      <section
        className="hero-section"
        style={{ backgroundImage: `url(${heroImg})` }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content container">
          <h1>Insurance Information</h1>
          <p className="subheading">
            Understanding your insurance coverage and accepted plans
          </p>
        </div>
      </section>

      {/* INSURANCE INFORMATION */}
      <section className="section">
        <div className="container">
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            {/* ACCEPTED INSURANCE PLANS */}
            <div style={{ background: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 6px 20px rgba(0,0,0,0.08)', marginBottom: '30px' }}>
              <h2 className="section-title" style={{ marginBottom: '30px' }}>Accepted Insurance Plans</h2>
              <p style={{ marginBottom: '25px', lineHeight: '1.8', color: '#333' }}>
                Hope Physicians of Kinston participates in a large variety of insurance plans. We accept assignment and are 
                participating providers with Medicare. We will file Medicare Advantage plans as a courtesy to our patients.
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px', marginTop: '30px' }}>
                {acceptedPlans.map((plan, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '15px',
                      background: '#f6f8fb',
                      borderRadius: '8px',
                      border: '1px solid #e0e0e0'
                    }}
                  >
                    <p style={{ margin: 0, color: '#004aad', fontWeight: '500' }}>✓ {plan}</p>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '30px', padding: '20px', background: '#fff3cd', borderRadius: '8px', border: '1px solid #ffc107' }}>
                <p style={{ margin: 0, color: '#856404' }}>
                  <strong>Note:</strong> There are some Medicare Advantage plans that we are not contracted with and you could be 
                  charged a deductible if we are considered Out-Of-Network. If you are unsure, please ask if we are In-Network 
                  with your Medicare Advantage Plan.
                </p>
              </div>
            </div>

            {/* INSURANCE REQUIREMENTS */}
            <div style={{ background: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 6px 20px rgba(0,0,0,0.08)', marginBottom: '30px' }}>
              <h2 className="section-title" style={{ marginBottom: '30px' }}>What to Bring to Your Appointment</h2>
              <ul style={{ listStyle: 'none', padding: 0, lineHeight: '2' }}>
                <li style={{ marginBottom: '15px', paddingLeft: '30px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0, color: '#004aad', fontSize: '20px' }}>•</span>
                  <strong>Current Insurance Card(s)</strong> - Please bring your insurance card to every visit
                </li>
                <li style={{ marginBottom: '15px', paddingLeft: '30px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0, color: '#004aad', fontSize: '20px' }}>•</span>
                  <strong>Photo ID</strong> - Driver's license or other government-issued ID
                </li>
                <li style={{ marginBottom: '15px', paddingLeft: '30px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0, color: '#004aad', fontSize: '20px' }}>•</span>
                  <strong>Co-payment</strong> - If required by your insurance plan
                </li>
                <li style={{ marginBottom: '15px', paddingLeft: '30px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0, color: '#004aad', fontSize: '20px' }}>•</span>
                  <strong>List of Current Medications</strong> - Including dosages
                </li>
                <li style={{ marginBottom: '15px', paddingLeft: '30px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0, color: '#004aad', fontSize: '20px' }}>•</span>
                  <strong>Previous Medical Records</strong> - If this is your first visit
                </li>
              </ul>
            </div>

            {/* COORDINATION OF BENEFITS */}
            <div style={{ background: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 6px 20px rgba(0,0,0,0.08)', marginBottom: '30px' }}>
              <h2 className="section-title" style={{ marginBottom: '30px' }}>Coordination of Benefits</h2>
              <p style={{ marginBottom: '20px', lineHeight: '1.8', color: '#333' }}>
                If you have more than one insurance plan, please bring both insurance cards to your appointment. 
                We will need to know which insurance is primary.
              </p>
              <p style={{ marginBottom: '20px', lineHeight: '1.8', color: '#333' }}>
                <strong>For children covered by both parents:</strong> Usually, the parent whose birthday comes first 
                in the year provides the primary insurance coverage.
              </p>
            </div>

            {/* OUT-OF-NETWORK POLICY */}
            <div style={{ background: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 6px 20px rgba(0,0,0,0.08)', marginBottom: '30px' }}>
              <h2 className="section-title" style={{ marginBottom: '30px' }}>Out-of-Network Policy</h2>
              <p style={{ marginBottom: '20px', lineHeight: '1.8', color: '#333' }}>
                If you have an insurance plan that Hope Physicians of Kinston providers do not participate with, 
                you will be expected to pay <strong>$100.00</strong> of the charges on the day of the visit. 
                We do not file Out-Of-Network Claims.
              </p>
            </div>

            {/* SELF-PAY POLICY */}
            <div style={{ background: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 6px 20px rgba(0,0,0,0.08)', marginBottom: '30px' }}>
              <h2 className="section-title" style={{ marginBottom: '30px' }}>Self-Pay Patients</h2>
              <p style={{ marginBottom: '20px', lineHeight: '1.8', color: '#333' }}>
                Patients that do not have insurance coverage and/or cannot provide proof of insurance at the time of 
                service will be considered Self-Pay. New Self-Pay patients will be required to pay <strong>$247.00</strong> 
                prior to being seen.
              </p>
            </div>

            {/* CTA */}
            <div style={{ textAlign: 'center', marginTop: '40px' }}>
              <Link to="/insurance-inquiry" className="hero-btn" style={{ display: 'inline-block', textDecoration: 'none', marginRight: '15px' }}>
                Submit Insurance Inquiry
              </Link>
              <Link to="/contact" className="hero-ghost" style={{ display: 'inline-block', textDecoration: 'none' }}>
                Contact Insurance Department
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Insurance;
