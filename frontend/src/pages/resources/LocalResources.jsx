import React, { useState } from 'react';
import '../../styles/Home.css';
import heroImg from "../../assets/images/hero2.jpg";

const LocalResources = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const resources = [
    {
      id: 1,
      category: 'healthcare',
      name: 'Kinston Community Health Center',
      description: 'Comprehensive primary care services for the community',
      address: '324 N Queen St, Kinston, NC 28501',
      phone: '(252) 522-9800',
      website: 'https://www.kinstonchc.org',
      hours: 'Mon-Fri: 8:00 AM - 5:00 PM'
    },
    {
      id: 2,
      category: 'healthcare',
      name: 'Lenoir Memorial Hospital',
      description: 'Full-service hospital with emergency department',
      address: '100 Airport Rd, Kinston, NC 28501',
      phone: '(252) 522-7000',
      website: 'https://www.unchealth.org',
      hours: '24/7 Emergency Services'
    },
    {
      id: 3,
      category: 'pharmacy',
      name: 'CVS Pharmacy',
      description: 'Full-service pharmacy with prescription services',
      address: '2104 N Heritage St, Kinston, NC 28501',
      phone: '(252) 522-3663',
      website: 'https://www.cvs.com',
      hours: 'Mon-Sun: 8:00 AM - 9:00 PM'
    },
    {
      id: 4,
      category: 'pharmacy',
      name: 'Walgreens Pharmacy',
      description: 'Pharmacy services and health products',
      address: '101 E New Bern Rd, Kinston, NC 28501',
      phone: '(252) 522-1234',
      website: 'https://www.walgreens.com',
      hours: 'Mon-Sun: 8:00 AM - 10:00 PM'
    },
    {
      id: 5,
      category: 'mental-health',
      name: 'Eastpointe Mental Health Services',
      description: 'Mental health and substance abuse services',
      address: '2501 N Queen St, Kinston, NC 28501',
      phone: '(252) 522-3000',
      website: 'https://www.eastpointe.net',
      hours: 'Mon-Fri: 8:00 AM - 5:00 PM'
    },
    {
      id: 6,
      category: 'social-services',
      name: 'Lenoir County Department of Social Services',
      description: 'Social services, Medicaid, and assistance programs',
      address: '201 N Queen St, Kinston, NC 28501',
      phone: '(252) 527-7000',
      website: 'https://www.ncdhhs.gov',
      hours: 'Mon-Fri: 8:00 AM - 5:00 PM'
    },
    {
      id: 7,
      category: 'transportation',
      name: 'Kinston Area Transit System',
      description: 'Public transportation services',
      address: '327 E New Bern Rd, Kinston, NC 28501',
      phone: '(252) 522-9400',
      website: 'https://www.kinstonnc.gov',
      hours: 'Mon-Fri: 6:00 AM - 6:00 PM'
    },
    {
      id: 8,
      category: 'food-assistance',
      name: 'Food Bank of Central & Eastern North Carolina',
      description: 'Food assistance and nutrition programs',
      address: '1924 W Vernon Ave, Kinston, NC 28504',
      phone: '(252) 208-2500',
      website: 'https://www.foodbankcenc.org',
      hours: 'Mon-Fri: 9:00 AM - 4:00 PM'
    },
    {
      id: 9,
      category: 'senior-services',
      name: 'Lenoir County Council on Aging',
      description: 'Services and programs for seniors',
      address: '201 N Queen St, Kinston, NC 28501',
      phone: '(252) 527-1543',
      website: 'https://www.lenoircoa.org',
      hours: 'Mon-Fri: 8:00 AM - 5:00 PM'
    },
    {
      id: 10,
      category: 'urgent-care',
      name: 'FastMed Urgent Care',
      description: 'Walk-in urgent care services',
      address: '2602 N Queen St, Kinston, NC 28501',
      phone: '(252) 522-5555',
      website: 'https://www.fastmed.com',
      hours: 'Mon-Sun: 8:00 AM - 8:00 PM'
    }
  ];

  const categories = [
    { value: 'all', label: 'All Resources' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'pharmacy', label: 'Pharmacy' },
    { value: 'mental-health', label: 'Mental Health' },
    { value: 'social-services', label: 'Social Services' },
    { value: 'transportation', label: 'Transportation' },
    { value: 'food-assistance', label: 'Food Assistance' },
    { value: 'senior-services', label: 'Senior Services' },
    { value: 'urgent-care', label: 'Urgent Care' }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="page">
      {/* HERO SECTION */}
      <section
        className="hero-section"
        style={{ backgroundImage: `url(${heroImg})` }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content container">
          <h1>Local Resources</h1>
          <p className="subheading">
            Find healthcare services, community resources, and support in your area
          </p>
        </div>
      </section>

      {/* SEARCH AND FILTER SECTION */}
      <section className="section" style={{ background: '#f6f8fb' }}>
        <div className="container">
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '15px', marginBottom: '30px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <input
                  type="text"
                  placeholder="Search resources..."
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
              </div>
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
              Found {filteredResources.length} resource{filteredResources.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </section>

      {/* RESOURCES GRID */}
      <section className="section">
        <div className="container">
          {filteredResources.length > 0 ? (
            <div className="services-grid">
              {filteredResources.map((resource) => (
                <article key={resource.id} className="service-card">
                  <div className="service-body">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                      <h3 style={{ margin: 0, color: '#004aad' }}>{resource.name}</h3>
                      <span style={{
                        padding: '4px 12px',
                        background: '#e3f2fd',
                        color: '#004aad',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        textTransform: 'capitalize'
                      }}>
                        {categories.find(c => c.value === resource.category)?.label || resource.category}
                      </span>
                    </div>
                    <p style={{ marginBottom: '15px', color: '#666', fontSize: '14px' }}>
                      {resource.description}
                    </p>
                    <div style={{ marginBottom: '10px', fontSize: '14px' }}>
                      <p style={{ margin: '5px 0', color: '#333' }}>
                        <strong>📍</strong> {resource.address}
                      </p>
                      <p style={{ margin: '5px 0', color: '#333' }}>
                        <strong>📞</strong> <a href={`tel:${resource.phone}`} style={{ color: '#004aad', textDecoration: 'none' }}>
                          {resource.phone}
                        </a>
                      </p>
                      <p style={{ margin: '5px 0', color: '#333' }}>
                        <strong>🕐</strong> {resource.hours}
                      </p>
                    </div>
                    {resource.website && (
                      <a
                        href={resource.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="service-link"
                        style={{ marginTop: '10px', display: 'inline-block' }}
                      >
                        Visit Website →
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <p style={{ fontSize: '18px', color: '#666' }}>No resources found matching your search.</p>
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
      </section>

      {/* ADDITIONAL INFO */}
      <section className="section" style={{ background: '#f6f8fb' }}>
        <div className="container">
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <h2 className="section-title center">Need Help Finding a Resource?</h2>
            <p style={{ marginBottom: '30px', color: '#666' }}>
              If you need assistance finding specific resources or services, please contact our office.
            </p>
            <a href="/contact" className="hero-btn" style={{ display: 'inline-block', textDecoration: 'none' }}>
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LocalResources;
