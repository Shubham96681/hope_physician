import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Home.css';
// High-quality image from Unsplash - Women's Health (Female patient with doctor)
const womensImg = "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1920&q=90&auto=format&fit=crop";

const womenServices = [
  {
    key: 'annual',
    title: 'Annual Well-Woman Exams',
    desc: 'Comprehensive gynecological exams, Pap smears, breast exams, and preventive screenings.',
    icon: 'flower',
  },
  {
    key: 'repro',
    title: 'Reproductive Health',
    desc: 'Contraception counseling, family planning, fertility evaluations, and preconception care.',
    icon: 'heart',
  },
  {
    key: 'prenatal',
    title: 'Prenatal & Postnatal Care',
    desc: 'Comprehensive maternity care, prenatal visits, and postpartum support for new mothers.',
    icon: 'baby',
  },
  {
    key: 'menopause',
    title: 'Menopause Management',
    desc: 'Support and treatment for menopausal symptoms, hormone therapy, and bone health.',
    icon: 'spark',
  },
  {
    key: 'gyn',
    title: 'Gynecological Conditions',
    desc: 'Treatment for PCOS, endometriosis, fibroids, and other gynecological conditions.',
    icon: 'shield',
  },
  {
    key: 'breast',
    title: 'Breast Health',
    desc: 'Breast exams, mammography referrals, and breast health education and support.',
    icon: 'ribbon',
  },
];

const womenWhy = [
  {
    key: 'compassion',
    title: 'Compassionate Care',
    copy: 'Understanding, supportive care in a comfortable, women-centered environment.',
    tone: 'rose',
  },
  {
    key: 'specialists',
    title: "Women's Health Specialists",
    copy: "Experienced gynecologists and women's health providers dedicated to your wellness.",
    tone: 'blue',
  },
  {
    key: 'confidential',
    title: 'Confidential & Private',
    copy: 'Respectful, confidential consultations addressing all your health concerns.',
    tone: 'blue',
  },
  {
    key: 'holistic',
    title: 'Holistic Approach',
    copy: 'Comprehensive care addressing physical, emotional, and reproductive health needs.',
    tone: 'blue',
  },
];

const renderWomenIcon = (icon) => {
  const stroke = '#a5b4fc';
  switch (icon) {
    case 'flower':
      return (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 22v-4" />
          <circle cx="12" cy="10" r="3" />
          <path d="M6.5 20a6.5 6.5 0 0 1 11 0" />
          <path d="M5 11c-1.5-2.5 1-5 3.5-3.5S12 4 12 4s2 1.5 3.5-.5S20.5 6.5 19 9c-1.2 2-4 3-7 3s-5.8-1-7-3Z" />
        </svg>
      );
    case 'heart':
      return (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 21s-7-4.35-7-10a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 5.65-7 10-7 10z" />
        </svg>
      );
    case 'baby':
      return (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="6" r="3" />
          <path d="M7 22v-4a5 5 0 0 1 10 0v4" />
          <path d="M5 11a7 7 0 0 1 14 0" />
        </svg>
      );
    case 'spark':
      return (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m12 2-1.5 4.5L6 7l3.5 3L8 15l4-2.5L16 15l-1.5-5 3.5-3-4.5-.5L12 2Z" />
        </svg>
      );
    case 'shield':
      return (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 3 4 7v5c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V7l-8-4Z" />
          <path d="m9.5 12.5 2 2 3-4" />
        </svg>
      );
    case 'ribbon':
      return (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 2C8.7 2 6 4.7 6 8c0 4.5 6 12 6 12s6-7.5 6-12c0-3.3-2.7-6-6-6Z" />
          <path d="M9.5 7.5 12 10l2.5-2.5" />
        </svg>
      );
    default:
      return null;
  }
};

const renderWomenWhyIcon = (key, tone = 'blue') => {
  const stroke = tone === 'rose' ? '#fb7185' : '#93c5fd';
  switch (key) {
    case 'compassion':
      return (
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 21s-7-4.35-7-10a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 5.65-7 10-7 10z" />
        </svg>
      );
    case 'specialists':
      return (
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="7" r="3" />
          <path d="M5.5 21v-1a6.5 6.5 0 0 1 13 0v1" />
          <path d="M10 11c-1.5.5-2.5 1.5-3 3" />
          <path d="M14 11c1.5.5 2.5 1.5 3 3" />
        </svg>
      );
    case 'confidential':
      return (
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="11" width="18" height="10" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      );
    case 'holistic':
      return (
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M9 12h6" />
          <path d="M12 9v6" />
        </svg>
      );
    default:
      return null;
  }
};

const WomensHealth = () => {
  return (
    <div className="page">
      {/* HERO SECTION */}
      <section
        className="hero-section"
        style={{ backgroundImage: `url(${womensImg})` }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content container">
          <h1>Women's Health</h1>
          <p className="subheading">
            Comprehensive gynecological and maternal health services for women
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
                Comprehensive Women's Healthcare
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
                  Our Women's Health department provides specialized medical care addressing 
                  the unique health needs of women throughout all stages of life. We offer 
                  comprehensive gynecological services, reproductive health care, and maternal health support.
                </p>
                <p className="about-intro" style={{
                  color: '#2d3748',
                  marginBottom: '0',
                  fontSize: '18px',
                  lineHeight: '1.8',
                  fontWeight: '400'
                }}>
                  Our compassionate team of women's health specialists provides personalized, 
                  confidential care in a supportive and comfortable environment.
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
              Women's Health
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Services We Offer</h2>
            <p className="text-slate-200 text-lg leading-relaxed">
              Comprehensive women's health services for every stage of life
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {womenServices.map((service) => (
              <div
                key={service.key}
                className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur p-5 shadow-xl transition duration-200 hover:-translate-y-1 hover:shadow-2xl">
                <div className="flex items-center justify-center mb-4">
                  {renderWomenIcon(service.icon)}
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
              Trusted women's health
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Why Choose Our Women's Health Services?
            </h2>
            <p className="text-slate-200 text-lg leading-relaxed max-w-2xl mx-auto">
              Compassionate, confidential care tailored to women at every stage of life.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {womenWhy.map((card) => (
              <div
                key={card.key}
                className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur p-5 shadow-xl transition duration-200 hover:-translate-y-1 hover:shadow-2xl">
                <div className="flex items-center justify-center mb-3">
                  {renderWomenWhyIcon(card.key, card.tone)}
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
            <h2 style={{ margin: 0, marginBottom: '10px', fontSize: '24px' }}>Schedule Your Women's Health Appointment</h2>
            <p style={{ margin: 0, opacity: 0.95 }}>Book a consultation with our women's health specialists today.</p>
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

export default WomensHealth;
