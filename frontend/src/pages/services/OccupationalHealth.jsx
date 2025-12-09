import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Home.css';
// High-quality hospital-related image from Unsplash - Medical facility/hospital setting
const occupationalImg = "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1920&q=90&auto=format&fit=crop";

const occServices = [
  {
    key: 'preemployment',
    title: 'Pre-Employment Screenings',
    desc: 'Physical exams, drug testing, and health assessments for new hires.',
    icon: 'badge',
  },
  {
    key: 'injury',
    title: 'Workplace Injury Care',
    desc: 'Treatment and management of work-related injuries and occupational illnesses.',
    icon: 'cross',
  },
  {
    key: 'surveillance',
    title: 'Health Surveillance Programs',
    desc: 'Regular health monitoring for employees exposed to workplace hazards.',
    icon: 'monitor',
  },
  {
    key: 'fitness',
    title: 'Fitness-for-Duty Exams',
    desc: "Assessments to determine an employee's ability to perform job duties safely.",
    icon: 'shield',
  },
  {
    key: 'wellness',
    title: 'Wellness Programs',
    desc: 'Workplace wellness initiatives, health education, and preventive care programs.',
    icon: 'heart',
  },
  {
    key: 'return',
    title: 'Return-to-Work Evaluations',
    desc: 'Assessments to safely return employees to work after injury or illness.',
    icon: 'arrow',
  },
];

const occWhy = [
  {
    key: 'business',
    title: 'Business-Focused',
    copy: 'Services designed to reduce workplace injuries, improve productivity, and support compliance.',
    tone: 'blue',
  },
  {
    key: 'efficient',
    title: 'Efficient Service',
    copy: 'Streamlined processes and quick turnaround times to minimize workplace disruption.',
    tone: 'blue',
  },
  {
    key: 'compliance',
    title: 'Compliance Support',
    copy: 'Help meeting OSHA and industry-specific health and safety regulations.',
    tone: 'blue',
  },
  {
    key: 'partnership',
    title: 'Partnership Approach',
    copy: 'Working closely with employers to develop customized health and safety programs.',
    tone: 'rose',
  },
];

const renderOccIcon = (icon) => {
  const stroke = '#a5b4fc';
  switch (icon) {
    case 'badge':
      return (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 2 4 5v6c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V5l-8-3Z" />
          <path d="M9 10h6" />
          <path d="M9 14h6" />
        </svg>
      );
    case 'cross':
      return (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <path d="M9 12h6" />
          <path d="M12 9v6" />
        </svg>
      );
    case 'monitor':
      return (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="4" width="18" height="14" rx="2" />
          <path d="M9 20h6" />
          <path d="M12 18v2" />
          <path d="M7 13l3-3 2 2 3-4 2 3" />
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
    case 'arrow':
      return (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 12h14" />
          <path d="M13 6l6 6-6 6" />
        </svg>
      );
    default:
      return null;
  }
};

const renderOccWhyIcon = (key, tone = 'blue') => {
  const stroke = tone === 'rose' ? '#fb7185' : '#93c5fd';
  switch (key) {
    case 'business':
      return (
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <path d="M14 14h4.5a1.5 1.5 0 0 1 1.5 1.5V21" />
          <path d="M14 14v7" />
        </svg>
      );
    case 'efficient':
      return (
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
    case 'compliance':
      return (
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <path d="M8 10h8" />
          <path d="M8 14h5" />
        </svg>
      );
    case 'partnership':
      return (
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M8 9a4 4 0 1 1 8 0" />
          <path d="M5 22v-4a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v4" />
          <path d="M12 12v3" />
        </svg>
      );
    default:
      return null;
  }
};

const OccupationalHealth = () => {
  return (
    <div className="page">
      {/* HERO SECTION */}
      <section
        className="hero-section"
        style={{ backgroundImage: `url(${occupationalImg})` }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content container">
          <h1>Occupational Health</h1>
          <p className="subheading">
            Workplace health programs and screenings for employees and employers
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
                Workplace Health & Safety
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
                  Our Occupational Health department provides comprehensive workplace health services 
                  designed to keep employees healthy, safe, and productive. We work with both employers 
                  and employees to create healthier work environments.
                </p>
                <p className="about-intro" style={{
                  color: '#2d3748',
                  marginBottom: '0',
                  fontSize: '18px',
                  lineHeight: '1.8',
                  fontWeight: '400'
                }}>
                  Our services include pre-employment screenings, workplace injury management, 
                  health surveillance programs, and wellness initiatives tailored to your industry.
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
              Occupational Health
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Services We Offer</h2>
            <p className="text-slate-200 text-lg leading-relaxed">
              Comprehensive occupational health services for businesses and employees
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {occServices.map((service) => (
              <div
                key={service.key}
                className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur p-5 shadow-xl transition duration-200 hover:-translate-y-1 hover:shadow-2xl">
                <div className="flex items-center justify-center mb-4">
                  {renderOccIcon(service.icon)}
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
              Trusted occupational health
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Why Choose Our Occupational Health Services?
            </h2>
            <p className="text-slate-200 text-lg leading-relaxed max-w-2xl mx-auto">
              Business-focused, compliant care that keeps your workforce safe, healthy, and productive.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {occWhy.map((card) => (
              <div
                key={card.key}
                className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur p-5 shadow-xl transition duration-200 hover:-translate-y-1 hover:shadow-2xl">
                <div className="flex items-center justify-center mb-3">
                  {renderOccWhyIcon(card.key, card.tone)}
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
            <h2 style={{ margin: 0, marginBottom: '10px', fontSize: '24px' }}>Partner With Us for Workplace Health</h2>
            <p style={{ margin: 0, opacity: 0.95 }}>Contact us to learn more about our occupational health services for your business.</p>
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

export default OccupationalHealth;
