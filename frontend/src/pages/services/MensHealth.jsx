import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Home.css';
// High-quality image from Unsplash - Men's Health (Male patient consultation)
const mensImg = "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=1920&q=90&auto=format&fit=crop";

const menServices = [
  {
    key: 'annual',
    title: 'Annual Physical Exams',
    desc: 'Comprehensive health screenings, blood work, and preventive care assessments.',
    icon: 'heartbeat',
  },
  {
    key: 'prostate',
    title: 'Prostate Health',
    desc: 'Prostate screenings, PSA testing, and management of prostate-related conditions.',
    icon: 'shield',
  },
  {
    key: 'cardio',
    title: 'Cardiovascular Health',
    desc: 'Heart health assessments, cholesterol management, and cardiovascular risk evaluation.',
    icon: 'heart',
  },
  {
    key: 'hormone',
    title: 'Hormone Therapy',
    desc: 'Testosterone level testing and hormone replacement therapy when appropriate.',
    icon: 'atom',
  },
  {
    key: 'sexual',
    title: 'Sexual Health',
    desc: 'Confidential evaluation and treatment of sexual health concerns and erectile dysfunction.',
    icon: 'spark',
  },
  {
    key: 'mental',
    title: 'Mental Health Support',
    desc: 'Counseling and support for stress, anxiety, depression, and mental wellness.',
    icon: 'brain',
  },
];

const menWhy = [
  {
    key: 'confidential',
    title: 'Confidential Care',
    copy: 'Private, confidential consultations in a comfortable, judgment-free environment.',
    tone: 'blue',
  },
  {
    key: 'preventive',
    title: 'Preventive Focus',
    copy: "Early detection and prevention of common men's health issues through regular screenings.",
    tone: 'blue',
  },
  {
    key: 'comprehensive',
    title: 'Comprehensive Approach',
    copy: 'Addressing physical, mental, and emotional health needs specific to men.',
    tone: 'blue',
  },
  {
    key: 'expert',
    title: 'Expert Care',
    copy: "Experienced physicians specializing in men's health and wellness.",
    tone: 'rose',
  },
];

const renderMenWhyIcon = (key, tone = 'blue') => {
  const stroke = tone === 'rose' ? '#fb7185' : '#93c5fd';
  switch (key) {
    case 'confidential':
      return (
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="11" width="18" height="10" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      );
    case 'preventive':
      return (
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 3 4 7v5c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V7l-8-4Z" />
          <path d="m10 12.5 2 1.5 3-3.5" />
        </svg>
      );
    case 'comprehensive':
      return (
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="9" cy="7" r="3" />
          <circle cx="17" cy="7" r="3" />
          <path d="M4 21v-3a4 4 0 0 1 4-4h.5" />
          <path d="M19 21v-3a4 4 0 0 0-4-4h-.5" />
          <path d="M12 14v7" />
        </svg>
      );
    case 'expert':
      return (
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 2 2 7l10 5 10-5-10-5Z" />
          <path d="M2 12l10 5 10-5" />
          <path d="M2 17l10 5 10-5" />
        </svg>
      );
    default:
      return null;
  }
};

const renderMenIcon = (icon) => {
  const stroke = '#a5b4fc';
  switch (icon) {
    case 'heartbeat':
      return (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 10.5C3 6.9 5.9 4 9.5 4c1.9 0 3.6.9 4.7 2.3C15.3 4.9 17 4 18.9 4 22.5 4 25.4 6.9 25.4 10.5c0 5.7-9.4 10.5-9.4 10.5S3 16.2 3 10.5Z" transform="translate(-1 -1)" />
          <path d="M5 12h3l2-3 3 6 2-3h3" />
        </svg>
      );
    case 'shield':
      return (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 3 4 7v5c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V7l-8-4Z" />
          <path d="m9.5 12.5 2 2 3-4" />
        </svg>
      );
    case 'heart':
      return (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 21s-7-4.35-7-10a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 5.65-7 10-7 10z" />
        </svg>
      );
    case 'atom':
      return (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="2" />
          <path d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.36-7.36-1.42 1.42M8.06 17.94l-1.42 1.42m0-12.72 1.42 1.42m10.66 10.66-1.42-1.42" />
        </svg>
      );
    case 'spark':
      return (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m12 2-1.5 4.5L6 7l3.5 3L8 15l4-2.5L16 15l-1.5-5 3.5-3-4.5-.5L12 2Z" />
        </svg>
      );
    case 'brain':
      return (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M15 4c0-1.1-.9-2-2-2-1 0-1.85.75-1.98 1.72A2.5 2.5 0 0 0 6.5 6.5c-.17 0-.34.02-.5.05A3 3 0 0 0 4 9v1.5c0 .5.14.97.38 1.37A2.5 2.5 0 0 0 6.5 18H7" />
          <path d="M9 5.5c.9 0 1.7.4 2.26 1M9 9h1" />
          <path d="M12 12v7" />
          <path d="M18 18h-.5a2.5 2.5 0 0 1-2.12-3.75A2 2 0 0 1 15 13V9a3 3 0 0 0-3-3" />
          <path d="M12 6c0-1.1.9-2 2-2 .74 0 1.39.4 1.74 1" />
        </svg>
      );
    default:
      return null;
  }
};

const MensHealth = () => {
  return (
    <div className="page">
      {/* HERO SECTION */}
      <section
        className="hero-section"
        style={{ backgroundImage: `url(${mensImg})` }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content container">
          <h1>Men's Health</h1>
          <p className="subheading">
            Preventive and specialized healthcare services tailored for men
          </p>
        </div>
      </section>

      {/* OVERVIEW */}
      <section className="section" style={{ background: '#fff' }}>
        <div className="container">
          <div className="about-wrapper" style={{ gridTemplateColumns: '1fr', display: 'block' }}>
            <div className="about-content" style={{ 
              maxWidth: '900px', 
              margin: '0 auto',
              textAlign: 'center',
              padding: '40px 20px'
            }}>
              <h2 className="section-title" style={{ 
                fontSize: '36px',
                color: '#004aad',
                marginBottom: '24px',
                fontWeight: '700',
                lineHeight: '1.2'
              }}>
                Comprehensive Men's Healthcare
              </h2>
              <div style={{ 
                textAlign: 'left',
                maxWidth: '800px',
                margin: '0 auto'
              }}>
                <p className="about-intro" style={{
                  color: '#2d3748',
                  marginBottom: '20px',
                  fontSize: '18px',
                  lineHeight: '1.8',
                  fontWeight: '400'
                }}>
                  Our Men's Health department provides specialized medical care addressing 
                  the unique health needs of men at every stage of life. We focus on preventive care, 
                  early detection, and treatment of conditions that commonly affect men.
                </p>
                <p className="about-intro" style={{
                  color: '#2d3748',
                  marginBottom: '0',
                  fontSize: '18px',
                  lineHeight: '1.8',
                  fontWeight: '400'
                }}>
                  Our experienced physicians understand men's health concerns and provide 
                  confidential, compassionate care in a comfortable environment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES OFFERED */}
      <section className="relative overflow-hidden py-16 md:py-20 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-slate-50">
        <div className="pointer-events-none absolute inset-0">
          <span className="absolute -left-24 top-6 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" aria-hidden="true"></span>
          <span className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-indigo-500/18 blur-3xl" aria-hidden="true"></span>
          <span className="absolute inset-8 rounded-3xl border border-white/5 opacity-40" aria-hidden="true"></span>
        </div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-500/15 text-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              Men's Health
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Services We Offer</h2>
            <p className="text-slate-200 text-lg leading-relaxed">
              Comprehensive men's health services for optimal wellness
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {menServices.map((service) => (
              <div
                key={service.key}
                className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur p-5 shadow-xl transition duration-200 hover:-translate-y-1 hover:shadow-2xl">
                <div className="flex items-center justify-center mb-4">
                  {renderMenIcon(service.icon)}
                </div>
                <h3 className="text-lg font-semibold text-white text-center">
                  {service.title}
                </h3>
                <p className="text-slate-200 text-center mt-2">
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="relative overflow-hidden py-16 md:py-20 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-slate-50">
        <div className="pointer-events-none absolute inset-0">
          <span className="absolute -left-24 top-6 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" aria-hidden="true"></span>
          <span className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-indigo-500/18 blur-3xl" aria-hidden="true"></span>
          <span className="absolute inset-8 rounded-3xl border border-white/5 opacity-40" aria-hidden="true"></span>
        </div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-500/15 text-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              Trusted men's health
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Why Choose Our Men's Health Services?
            </h2>
            <p className="text-slate-200 text-lg leading-relaxed max-w-2xl mx-auto">
              Confidential, comprehensive care tailored to men's health across every stage of life.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {menWhy.map((card) => (
              <div
                key={card.key}
                className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur p-5 shadow-xl transition duration-200 hover:-translate-y-1 hover:shadow-2xl">
                <div className="flex items-center justify-center mb-3">
                  {renderMenWhyIcon(card.key, card.tone)}
                </div>
                <h3 className="text-lg font-semibold text-white text-center">
                  {card.title}
                </h3>
                <p className="text-slate-200 text-center mt-2">
                  {card.copy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section section">
        <div className="container cta-container">
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: 0, marginBottom: '10px', fontSize: '24px' }}>Take Charge of Your Health Today</h2>
            <p style={{ margin: 0, opacity: 0.95 }}>Schedule your men's health screening or consultation with our team.</p>
          </div>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <a href="/appointment" className="cta-btn" style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              padding: '14px 24px',
              minWidth: '160px'
            }}>
              <span style={{ fontWeight: '700', fontSize: '16px' }}>Book</span>
              <span style={{ fontWeight: '700', fontSize: '16px' }}>Appointment</span>
            </a>
            <Link 
              to="/contact" 
              style={{ 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '12px 22px',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                color: 'rgba(255, 255, 255, 0.9)',
                textDecoration: 'none',
                fontWeight: '600',
                minWidth: '140px',
                transition: 'all 0.3s ease',
                background: 'rgba(255, 255, 255, 0.1)'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                e.target.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                e.target.style.color = 'rgba(255, 255, 255, 0.9)';
              }}
            >
              <span style={{ fontWeight: '600', fontSize: '16px' }}>Contact</span>
              <span style={{ fontWeight: '600', fontSize: '16px' }}>Us</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MensHealth;
