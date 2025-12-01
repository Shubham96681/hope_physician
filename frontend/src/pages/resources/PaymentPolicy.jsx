import React, { useState } from 'react';
import '../../styles/Home.css';
import '../../styles/Forms.css';
import heroImg from "../../assets/images/hero2.jpg";

const PaymentPolicy = () => {
  const [formData, setFormData] = useState({
    printName: '',
    signature: '',
    date: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for acknowledging the financial policies. Your form has been submitted.');
    setFormData({
      printName: '',
      signature: '',
      date: ''
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
          <h1>Financial Policies</h1>
          <p className="subheading">
            Understanding our payment policies and financial responsibilities
          </p>
        </div>
      </section>

      {/* FINANCIAL POLICY CONTENT */}
      <section className="section">
        <div className="container">
          <div style={{ maxWidth: '900px', margin: '0 auto', background: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 6px 20px rgba(0,0,0,0.08)' }}>
            <h2 className="section-title" style={{ marginBottom: '30px' }}>Financial Policy</h2>

            <div style={{ marginBottom: '30px', lineHeight: '1.8', color: '#333' }}>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '20px', paddingLeft: '30px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0, color: '#004aad', fontSize: '20px' }}>•</span>
                  Patients must arrive at their scheduled appointment with their insurance card, and insurance co-pay if applicable. 
                  Co-pays required by the patient's insurance plan must be paid at the time of service.
                </li>
                <li style={{ marginBottom: '20px', paddingLeft: '30px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0, color: '#004aad', fontSize: '20px' }}>•</span>
                  Patients with deductibles will be responsible for paying <strong>$100.00</strong> of their bill at the time of service.
                </li>
                <li style={{ marginBottom: '20px', paddingLeft: '30px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0, color: '#004aad', fontSize: '20px' }}>•</span>
                  The patient is ultimately responsible for all charges associated with their medical care regardless of insurance coverage.
                </li>
                <li style={{ marginBottom: '20px', paddingLeft: '30px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0, color: '#004aad', fontSize: '20px' }}>•</span>
                  Hope Physicians of Kinston providers participate in a large variety of insurance plans; accept assignment and are 
                  participating providers with Medicare. If the patient has an insurance plan that Hope Physicians of Kinston providers 
                  do not participate with, the patient will be expected to pay <strong>$100.00</strong> of the charges on the day of the visit. 
                  We do not file Out-Of-Network Claims.
                </li>
                <li style={{ marginBottom: '20px', paddingLeft: '30px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0, color: '#004aad', fontSize: '20px' }}>•</span>
                  We participate with Medicare. We will file Medicare Advantage plans as a courtesy to our patients. There are some Medicare 
                  Advantage plans that we are not contracted with and you could be charged a deductible if we are considered Out-Of-Network. 
                  If you are unsure, please ask if we are In-Network with your Medicare Advantage Plan.
                </li>
                <li style={{ marginBottom: '20px', paddingLeft: '30px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0, color: '#004aad', fontSize: '20px' }}>•</span>
                  Patients that do not have insurance coverage and/or cannot provide proof of insurance at the time of service will be 
                  considered Self-Pay. New Self-Pay patients will be required to pay <strong>$247.00</strong> prior to being seen. If the patient 
                  is not prepared to pay this, the appointment will be rescheduled, and a payment of <strong>$247.00</strong> will be expected 
                  at the newly scheduled appointment. The <strong>$247.00</strong> payment will be applied to your charges for your new patient 
                  visit and you will pay any balance over the <strong>$247.00</strong> at the time of check-out.
                </li>
                <li style={{ marginBottom: '20px', paddingLeft: '30px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0, color: '#004aad', fontSize: '20px' }}>•</span>
                  You will be billed in full for services that your health plan deems to be not covered services; any balances due after 
                  we have received payment from your insurance carrier and/or balances for self-pay services and supplies or if your insurance is inactive.
                </li>
                <li style={{ marginBottom: '20px', paddingLeft: '30px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0, color: '#004aad', fontSize: '20px' }}>•</span>
                  All balances are payable within <strong>30 days</strong> of receipt of the patient statement.
                </li>
                <li style={{ marginBottom: '20px', paddingLeft: '30px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0, color: '#004aad', fontSize: '20px' }}>•</span>
                  We accept cash and all major credit cards.
                </li>
                <li style={{ marginBottom: '20px', paddingLeft: '30px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0, color: '#004aad', fontSize: '20px' }}>•</span>
                  Hope Physicians of Kinston reserves the right to submit any payment account to collections if it is deemed that the account 
                  had been in default of payment obligations or compliance with this policy.
                </li>
                <li style={{ marginBottom: '20px', paddingLeft: '30px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0, color: '#004aad', fontSize: '20px' }}>•</span>
                  A no-show fee of <strong>$25.00</strong> will be charged for appointments not cancelled or rescheduled 24 hours prior to the scheduled appointment.
                </li>
              </ul>
            </div>

            <div style={{ marginTop: '40px', paddingTop: '30px', borderTop: '2px solid #eee' }}>
              <h2 className="section-title" style={{ marginBottom: '30px' }}>Timely Filing Policy</h2>
              <div style={{ lineHeight: '1.8', color: '#333' }}>
                <p style={{ marginBottom: '20px' }}>
                  In order to properly file your insurance claim(s), we require that you provide us with your current health insurance card(s), 
                  including coordination of benefits if more than one insurance. If the patient is a child covered by both parents, we will need 
                  to know which Insurance is Primary. Usually, the parent whose birthday comes first in the year provides the primary insurance coverage.
                </p>
                <p style={{ marginBottom: '20px' }}>
                  If you provide us with your current insurance card within <strong>ten business days</strong> of your visit, we will file your claim.
                </p>
              </div>
            </div>

            <div style={{ marginTop: '40px', paddingTop: '30px', borderTop: '2px solid #eee' }}>
              <h2 className="section-title" style={{ marginBottom: '30px' }}>Treatment of a Minor</h2>
              <div style={{ lineHeight: '1.8', color: '#333' }}>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  <li style={{ marginBottom: '20px', paddingLeft: '30px', position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 0, color: '#004aad', fontSize: '20px' }}>•</span>
                    If the patient is a minor (under the age of 18) a parent/legal guardian must be present at each appointment.
                  </li>
                  <li style={{ marginBottom: '20px', paddingLeft: '30px', position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 0, color: '#004aad', fontSize: '20px' }}>•</span>
                    We must have a signed consent form on file if a parent or legal guardian does not accompany a minor child.
                  </li>
                  <li style={{ marginBottom: '20px', paddingLeft: '30px', position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 0, color: '#004aad', fontSize: '20px' }}>•</span>
                    The Parent/Guardian is responsible for all charges not covered by insurance.
                  </li>
                </ul>
              </div>
            </div>

            <div style={{ marginTop: '40px', paddingTop: '30px', borderTop: '2px solid #eee' }}>
              <h2 className="section-title" style={{ marginBottom: '20px' }}>Acknowledgement</h2>
              <p style={{ lineHeight: '1.8', color: '#333', marginBottom: '20px' }}>
                Our practice believes that good patient/provider relationships are based on understanding and good communication. If you have any 
                questions about financial arrangements, please feel free to contact the Insurance/Billing Department. We will make every effort 
                to assist you concerning your account.
              </p>
              <p style={{ lineHeight: '1.8', color: '#333', marginBottom: '30px' }}>
                By signing this form, I acknowledge that I understand the policies outlined within this document. In addition, my signature permits 
                Hope Physicians of Kinston to file claims to my insurance (if applicable). I also understand that I accept financial responsibility 
                for all services rendered regardless of insurance coverage.
              </p>

              {/* ACKNOWLEDGEMENT FORM */}
              <form className="appointment-form" onSubmit={handleSubmit} style={{ background: '#f6f8fb', padding: '30px', borderRadius: '10px', marginTop: '30px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                  <div className="form-group">
                    <label>Print Name *</label>
                    <input
                      type="text"
                      name="printName"
                      value={formData.printName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Signature *</label>
                    <input
                      type="text"
                      name="signature"
                      value={formData.signature}
                      onChange={handleChange}
                      placeholder="Type your full name as signature"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Date *</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="form-btn" style={{ marginTop: '20px' }}>Submit Acknowledgement</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PaymentPolicy;
