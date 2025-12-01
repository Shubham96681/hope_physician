import React, { useState } from 'react';
import '../../styles/Home.css';
import '../../styles/Forms.css';
import heroImg from "../../assets/images/hero2.jpg";

const JobsCareers = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicationForm, setApplicationForm] = useState({
    jobTitle: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    resume: null,
    coverLetter: ''
  });

  const jobOpenings = [
    {
      id: 1,
      title: 'Family Medicine Physician',
      department: 'Family Medicine',
      type: 'Full-time',
      location: 'Kinston, NC',
      description: 'We are seeking a board-certified Family Medicine Physician to join our team. The ideal candidate will provide comprehensive primary care services to patients of all ages.',
      requirements: [
        'MD or DO degree from accredited medical school',
        'Board certification in Family Medicine',
        'Active North Carolina medical license',
        'DEA registration',
        'Minimum 2 years of clinical experience preferred',
        'Strong communication and interpersonal skills'
      ],
      benefits: [
        'Competitive salary and benefits package',
        'Malpractice insurance coverage',
        'CME allowance',
        'Paid time off and holidays',
        'Health, dental, and vision insurance',
        '401(k) retirement plan'
      ],
      postedDate: '2024-01-15'
    },
    {
      id: 2,
      title: 'Registered Nurse (RN)',
      department: 'Clinical Services',
      type: 'Full-time',
      location: 'Kinston, NC',
      description: 'Seeking an experienced Registered Nurse to provide patient care and support our clinical team. Must be able to work in a fast-paced environment.',
      requirements: [
        'Current RN license in North Carolina',
        'BLS certification required',
        'Minimum 1 year of nursing experience',
        'Excellent clinical skills',
        'Ability to work flexible hours'
      ],
      benefits: [
        'Competitive hourly wage',
        'Health insurance',
        'Paid time off',
        'Shift differential pay',
        'Professional development opportunities'
      ],
      postedDate: '2024-01-20'
    },
    {
      id: 3,
      title: 'Medical Assistant',
      department: 'Clinical Services',
      type: 'Full-time',
      location: 'Kinston, NC',
      description: 'Join our team as a Medical Assistant. You will assist physicians with patient care, perform basic clinical tasks, and ensure smooth clinic operations.',
      requirements: [
        'Medical Assistant certification (CMA or RMA)',
        'High school diploma or equivalent',
        'Basic computer skills',
        'Excellent customer service skills',
        'Ability to multitask'
      ],
      benefits: [
        'Competitive salary',
        'Health insurance',
        'Paid time off',
        'On-the-job training',
        'Career advancement opportunities'
      ],
      postedDate: '2024-01-25'
    },
    {
      id: 4,
      title: 'Front Office Receptionist',
      department: 'Administration',
      type: 'Full-time',
      location: 'Kinston, NC',
      description: 'We are looking for a friendly and organized Front Office Receptionist to greet patients, schedule appointments, and handle administrative tasks.',
      requirements: [
        'High school diploma or equivalent',
        'Previous medical office experience preferred',
        'Excellent communication skills',
        'Proficiency in Microsoft Office',
        'Strong organizational skills'
      ],
      benefits: [
        'Competitive hourly wage',
        'Health insurance',
        'Paid time off',
        'Monday-Friday schedule',
        'Friendly work environment'
      ],
      postedDate: '2024-02-01'
    },
    {
      id: 5,
      title: 'Billing Specialist',
      department: 'Billing',
      type: 'Full-time',
      location: 'Kinston, NC',
      description: 'Seeking an experienced Billing Specialist to handle insurance claims, patient billing, and accounts receivable management.',
      requirements: [
        'High school diploma or equivalent',
        '2+ years of medical billing experience',
        'Knowledge of insurance claims processing',
        'Proficiency in medical billing software',
        'Attention to detail'
      ],
      benefits: [
        'Competitive salary',
        'Health insurance',
        'Paid time off',
        'Remote work options available',
        'Professional development'
      ],
      postedDate: '2024-02-05'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'resume') {
      setApplicationForm({ ...applicationForm, resume: files[0] });
    } else {
      setApplicationForm({ ...applicationForm, [name]: value });
    }
  };

  const handleJobSelect = (job) => {
    setSelectedJob(job);
    setApplicationForm({ ...applicationForm, jobTitle: job.title });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you for your application for ${applicationForm.jobTitle}. We will review your application and contact you soon.`);
    setApplicationForm({
      jobTitle: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      resume: null,
      coverLetter: ''
    });
    setSelectedJob(null);
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
          <h1>Jobs and Careers</h1>
          <p className="subheading">
            Join our team and make a difference in healthcare
          </p>
        </div>
      </section>

      {/* WHY WORK WITH US */}
      <section className="section">
        <div className="container">
          <h2 className="section-title center">Why Work at Hope Physicians?</h2>
          <p className="section-subtitle center">
            We're committed to providing excellent patient care and supporting our team members
          </p>

          <div className="services-grid" style={{ marginTop: '30px' }}>
            <div className="service-card">
              <div className="service-body">
                <h3>🏥 Excellent Benefits</h3>
                <p>Comprehensive health insurance, retirement plans, and paid time off for all full-time employees.</p>
              </div>
            </div>
            <div className="service-card">
              <div className="service-body">
                <h3>📚 Professional Development</h3>
                <p>Ongoing training opportunities and support for continuing education and career growth.</p>
              </div>
            </div>
            <div className="service-card">
              <div className="service-body">
                <h3>🤝 Supportive Environment</h3>
                <p>Work with a collaborative team dedicated to providing compassionate patient care.</p>
              </div>
            </div>
            <div className="service-card">
              <div className="service-body">
                <h3>⚖️ Work-Life Balance</h3>
                <p>Flexible scheduling options and competitive compensation packages.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CURRENT OPENINGS */}
      <section className="section" style={{ background: '#f6f8fb' }}>
        <div className="container">
          <h2 className="section-title center">Current Job Openings</h2>
          <p className="section-subtitle center">
            Explore our available positions and find your next career opportunity
          </p>

          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            {jobOpenings.map((job) => (
              <div
                key={job.id}
                className="service-card"
                style={{ marginBottom: '20px', cursor: 'pointer' }}
                onClick={() => handleJobSelect(job)}
              >
                <div className="service-body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                    <div>
                      <h3 style={{ margin: 0, color: '#004aad' }}>{job.title}</h3>
                      <p style={{ margin: '5px 0', color: '#666', fontSize: '14px' }}>
                        {job.department} • {job.type} • {job.location}
                      </p>
                    </div>
                    <span style={{
                      padding: '6px 12px',
                      background: '#e3f2fd',
                      color: '#004aad',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      Posted: {new Date(job.postedDate).toLocaleDateString()}
                    </span>
                  </div>
                  <p style={{ marginBottom: '15px', color: '#333' }}>{job.description}</p>
                  <button
                    className="service-link"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#004aad',
                      fontWeight: '600',
                      cursor: 'pointer',
                      padding: 0,
                      textDecoration: 'none'
                    }}
                  >
                    View Details & Apply →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* JOB APPLICATION FORM */}
      {selectedJob && (
        <section className="section">
          <div className="container">
            <div className="appointment-box">
              <h2 style={{ textAlign: 'center', marginBottom: '10px', color: '#004aad' }}>
                Application for {selectedJob.title}
              </h2>
              <p style={{ textAlign: 'center', marginBottom: '30px', color: '#666' }}>
                Please fill out the form below to apply for this position
              </p>

              <form className="appointment-form" onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div className="form-group">
                    <label>First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={applicationForm.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={applicationForm.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div className="form-group">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={applicationForm.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={applicationForm.phone}
                      onChange={handleInputChange}
                      placeholder="(XXX) XXX-XXXX"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Resume/CV *</label>
                  <input
                    type="file"
                    name="resume"
                    accept=".pdf,.doc,.docx"
                    onChange={handleInputChange}
                    required
                  />
                  <small style={{ color: '#666', fontSize: '12px' }}>
                    Accepted formats: PDF, DOC, DOCX (Max 5MB)
                  </small>
                </div>

                <div className="form-group">
                  <label>Cover Letter</label>
                  <textarea
                    name="coverLetter"
                    value={applicationForm.coverLetter}
                    onChange={handleInputChange}
                    rows="6"
                    placeholder="Tell us why you're interested in this position..."
                  />
                </div>

                <div style={{ marginTop: '30px', padding: '20px', background: '#f6f8fb', borderRadius: '10px' }}>
                  <h4 style={{ marginBottom: '15px' }}>Job Requirements:</h4>
                  <ul style={{ marginLeft: '20px', lineHeight: '1.8' }}>
                    {selectedJob.requirements.map((req, index) => (
                      <li key={index} style={{ marginBottom: '8px' }}>{req}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
                  <button type="submit" className="form-btn" style={{ flex: 1 }}>
                    Submit Application
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedJob(null)}
                    style={{
                      flex: 1,
                      padding: '15px',
                      background: '#f0f0f0',
                      color: '#333',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      )}

      {/* GENERAL APPLICATION */}
      {!selectedJob && (
        <section className="section">
          <div className="container">
            <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
              <h2 className="section-title center">Don't See a Position That Fits?</h2>
              <p style={{ marginBottom: '30px', color: '#666' }}>
                We're always looking for talented individuals. Send us your resume and we'll keep it on file for future opportunities.
              </p>
              <a href="/contact" className="hero-btn" style={{ display: 'inline-block', textDecoration: 'none' }}>
                Contact HR Department
              </a>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default JobsCareers;
