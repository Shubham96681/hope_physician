import React, { useState } from 'react';
import '../../styles/Home.css';
import heroImg from "../../assets/images/hero2.jpg";

const FAQs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      id: 1,
      category: 'appointments',
      question: 'How do I schedule an appointment?',
      answer: 'You can schedule an appointment by calling our office at (252) 522-3663 during business hours, or by using our online appointment booking system. We also accept walk-in patients, though scheduled appointments are preferred.'
    },
    {
      id: 2,
      category: 'appointments',
      question: 'What should I bring to my first appointment?',
      answer: 'Please bring a valid photo ID, your insurance card(s), a list of current medications, any relevant medical records from previous providers, and your co-payment if required by your insurance plan.'
    },
    {
      id: 3,
      category: 'appointments',
      question: 'What is your cancellation policy?',
      answer: 'We require 24 hours notice for appointment cancellations or rescheduling. A $25.00 no-show fee will be charged for appointments not cancelled or rescheduled 24 hours prior to the scheduled appointment time.'
    },
    {
      id: 4,
      category: 'insurance',
      question: 'What insurance plans do you accept?',
      answer: 'Hope Physicians participates in a large variety of insurance plans including Medicare, Medicaid, and most major commercial insurance plans. We accept assignment and are participating providers with Medicare. Please contact our office to verify if we accept your specific insurance plan.'
    },
    {
      id: 5,
      category: 'insurance',
      question: 'What if I don\'t have insurance?',
      answer: 'Patients without insurance coverage are considered Self-Pay. New Self-Pay patients will be required to pay $247.00 prior to being seen. This payment will be applied to your charges for your new patient visit, and you will pay any balance over $247.00 at the time of check-out.'
    },
    {
      id: 6,
      category: 'insurance',
      question: 'Do you file insurance claims?',
      answer: 'Yes, we file insurance claims as a courtesy to our patients. If you provide us with your current insurance card within ten business days of your visit, we will file your claim. However, we do not file Out-Of-Network claims.'
    },
    {
      id: 7,
      category: 'billing',
      question: 'What payment methods do you accept?',
      answer: 'We accept cash and all major credit cards. Co-pays required by your insurance plan must be paid at the time of service. Patients with deductibles will be responsible for paying $100.00 of their bill at the time of service.'
    },
    {
      id: 8,
      category: 'billing',
      question: 'When is payment due?',
      answer: 'All balances are payable within 30 days of receipt of the patient statement. You will be billed in full for services that your health plan deems to be not covered services, any balances due after we have received payment from your insurance carrier, or balances for self-pay services.'
    },
    {
      id: 9,
      category: 'services',
      question: 'What services do you provide?',
      answer: 'Hope Physicians provides comprehensive primary care services including Family Medicine, Pediatric Care, Men\'s Health, Women\'s Health, Occupational Health, and Geriatric Care. We also offer preventive care, chronic disease management, and minor procedures.'
    },
    {
      id: 10,
      category: 'services',
      question: 'Do you provide urgent care services?',
      answer: 'Yes, we provide urgent care services for non-life-threatening conditions. For life-threatening emergencies, please call 911 or go to the nearest emergency room.'
    },
    {
      id: 11,
      category: 'medical-records',
      question: 'How do I request my medical records?',
      answer: 'You can request your medical records by completing our Authorization for Release of Information form, which is available on our website or at our office. Please allow 5-7 business days for processing. There may be a fee for copying records.'
    },
    {
      id: 12,
      category: 'medical-records',
      question: 'Can I access my medical records online?',
      answer: 'We are working on implementing a patient portal for online access to medical records. Please contact our office for more information about accessing your records.'
    },
    {
      id: 13,
      category: 'prescriptions',
      question: 'How do I get a prescription refill?',
      answer: 'You can request prescription refills by calling our office, using our patient portal (if available), or having your pharmacy send us a refill request. Please allow 24-48 hours for prescription refills to be processed.'
    },
    {
      id: 14,
      category: 'prescriptions',
      question: 'Do you prescribe controlled substances?',
      answer: 'Yes, our physicians can prescribe controlled substances when medically appropriate. We follow all state and federal regulations regarding controlled substance prescriptions and may require additional documentation or monitoring.'
    },
    {
      id: 15,
      category: 'minors',
      question: 'Can a minor be seen without a parent?',
      answer: 'If the patient is a minor (under the age of 18), a parent/legal guardian must be present at each appointment. We must have a signed consent form on file if a parent or legal guardian does not accompany a minor child.'
    },
    {
      id: 16,
      category: 'contact',
      question: 'What are your office hours?',
      answer: 'Our office hours are Monday through Friday, 8:00 AM to 5:00 PM. We are closed on weekends and major holidays. For urgent matters outside of business hours, please call our main number for instructions.'
    },
    {
      id: 17,
      category: 'contact',
      question: 'How do I contact the billing department?',
      answer: 'You can contact our Insurance/Billing Department by calling (252) 522-3663 during business hours. Our billing staff can assist you with insurance questions, payment arrangements, and account inquiries.'
    },
    {
      id: 18,
      category: 'privacy',
      question: 'How is my health information protected?',
      answer: 'We are committed to protecting your health information in accordance with HIPAA regulations. We maintain strict confidentiality policies and only share your information with your authorization or as required by law. You can review our complete Privacy Practices Notice on our website.'
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'appointments', label: 'Appointments' },
    { value: 'insurance', label: 'Insurance' },
    { value: 'billing', label: 'Billing' },
    { value: 'services', label: 'Services' },
    { value: 'medical-records', label: 'Medical Records' },
    { value: 'prescriptions', label: 'Prescriptions' },
    { value: 'minors', label: 'Minors' },
    { value: 'contact', label: 'Contact' },
    { value: 'privacy', label: 'Privacy' }
  ];

  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
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
          <h1>Frequently Asked Questions</h1>
          <p className="subheading">
            Find answers to common questions about our services, policies, and procedures
          </p>
        </div>
      </section>

      {/* SEARCH AND FILTER SECTION */}
      <section className="section" style={{ background: '#f6f8fb' }}>
        <div className="container">
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '15px', marginBottom: '30px' }}>
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px',
                  border: '1.5px solid #dcdcdc',
                  borderRadius: '10px',
                  fontSize: '15px'
                }}
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px',
                  border: '1.5px solid #dcdcdc',
                  borderRadius: '10px',
                  fontSize: '15px',
                  background: '#fff'
                }}
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>
              Found {filteredFAQs.length} question{filteredFAQs.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </section>

      {/* FAQ LIST */}
      <section className="section">
        <div className="container">
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((faq, index) => (
                <div
                  key={faq.id}
                  style={{
                    marginBottom: '15px',
                    background: '#fff',
                    borderRadius: '10px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    style={{
                      width: '100%',
                      padding: '20px',
                      background: openIndex === index ? '#004aad' : '#fff',
                      color: openIndex === index ? '#fff' : '#333',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '16px',
                      fontWeight: '600',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <span>{faq.question}</span>
                    <span style={{ fontSize: '20px', marginLeft: '15px' }}>
                      {openIndex === index ? '−' : '+'}
                    </span>
                  </button>
                  {openIndex === index && (
                    <div
                      style={{
                        padding: '20px',
                        background: '#f6f8fb',
                        borderTop: '1px solid #e0e0e0',
                        lineHeight: '1.8',
                        color: '#333'
                      }}
                    >
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <p style={{ fontSize: '18px', color: '#666' }}>No FAQs found matching your search.</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }}
                  style={{
                    marginTop: '20px',
                    padding: '12px 24px',
                    background: '#004aad',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="section" style={{ background: '#f6f8fb' }}>
        <div className="container">
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <h2 className="section-title center">Still Have Questions?</h2>
            <p style={{ marginBottom: '30px', color: '#666' }}>
              If you couldn't find the answer you're looking for, please don't hesitate to contact us.
            </p>
            <a href="/contact" className="hero-btn" style={{ display: 'inline-block', textDecoration: 'none', marginRight: '15px' }}>
              Contact Us
            </a>
            <a href="/insurance-inquiry" className="hero-ghost" style={{ display: 'inline-block', textDecoration: 'none' }}>
              Insurance Inquiry
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQs;
