import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { seoConfig } from "../config/seoConfig";
import "../styles/Home.css";

import heroImg from "../assets/images/hero2.jpg";
import aboutImg from "../assets/images/about.jpg";
import doctorImg from "../assets/images/doctor.jpg";
import familyImg from "../assets/images/family.jpeg";
import medSupportImg from "../assets/images/med_support.jpg";

const About = () => {
  useEffect(() => {
    // Reveal on scroll animation
    const reveals = document.querySelectorAll(".reveal-on-scroll");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    reveals.forEach((r) => observer.observe(r));

    return () => observer.disconnect();
  }, []);

  const stats = [
    { number: "15+", label: "Years of Experience", icon: "📅" },
    { number: "10,000+", label: "Patients Served", icon: "👥" },
    { number: "24/7", label: "Urgent Care Available", icon: "🕐" },
    { number: "100%", label: "Patient Satisfaction", icon: "⭐" },
  ];

  const values = [
    {
      title: "Compassion",
      description:
        "We treat every patient with empathy, understanding, and genuine care, ensuring a comfortable and supportive healthcare experience.",
      icon: "❤️",
    },
    {
      title: "Excellence",
      description:
        "We maintain the highest standards of medical practice, continuously improving our services and staying current with medical advancements.",
      icon: "✨",
    },
    {
      title: "Integrity",
      description:
        "We conduct ourselves with honesty, transparency, and ethical principles in all our interactions and medical decisions.",
      icon: "🛡️",
    },
    {
      title: "Accessibility",
      description:
        "We provide accessible healthcare services, including walk-in urgent care, ensuring quality medical care is available when you need it most.",
      icon: "🚪",
    },
  ];

  const teamMembers = [
    {
      name: "Dr. Okonkwo",
      role: "Lead Primary Care Physician",
      specialty: "Family Medicine",
      experience: "15+ Years",
      education: "MBBS, MD - Family Medicine",
      description:
        "Dr. Okonkwo is a highly experienced family physician with a passion for providing comprehensive healthcare to patients of all ages.",
    },
  ];

  const achievements = [
    "Accredited by leading medical associations",
    "State-of-the-art medical equipment and facilities",
    "Comprehensive electronic health records system",
    "Multilingual staff for diverse patient needs",
    "Community health education programs",
  ];

  return (
    <>
      <SEO
        title="About Us | Hope Physicians & Urgent Care"
        description={`Learn about Hope Physicians & Urgent Care, PLLC in Kinston, NC. Our mission, values, and commitment to providing exceptional primary care, family medicine, and urgent care services at ${seoConfig.business.address.streetAddress}, ${seoConfig.business.address.addressLocality}, ${seoConfig.business.address.addressRegion} ${seoConfig.business.address.postalCode}.`}
        keywords={[
          "about Hope Physicians",
          "Kinston medical practice",
          "primary care physicians Kinston",
          "family medicine Kinston",
        ]}
      />

      {/* HERO SECTION */}
      <section
        className="relative overflow-hidden py-16 md:py-24 reveal-on-scroll"
        role="banner"
        style={{
          backgroundImage: `url(${heroImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}>
        <div className="hero-overlay"></div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-6 backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-teal-400"></div>
              <p className="text-white/90 text-sm uppercase tracking-wider font-semibold">
                About Hope Physicians
              </p>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 reveal-on-scroll tracking-tight">
              Excellence in Healthcare Since Day One
            </h1>
            <p className="text-white/90 text-lg md:text-xl mb-8 reveal-on-scroll leading-relaxed max-w-2xl mx-auto">
              Providing compassionate, comprehensive medical care to families in
              Kinston, NC and surrounding communities. Your health is our
              priority.
            </p>
          </div>
        </div>
      </section>

      {/* STATISTICS SECTION */}
      <section className="relative py-16 md:py-20 reveal-on-scroll bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
                <div className="text-4xl mb-3">{stat.icon}</div>
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 text-sm md:text-base font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OUR STORY SECTION */}
      <section className="relative py-20 md:py-28 reveal-on-scroll bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full w-fit mb-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <p className="text-primary text-sm uppercase tracking-wider font-semibold">
                  Our Story
                </p>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Building Trust Through Quality Care
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                Hope Physicians & Urgent Care, PLLC was founded with a simple
                yet powerful mission: to provide accessible, high-quality
                healthcare services to the Kinston community and surrounding
                areas. Located at{" "}
                <strong>
                  {seoConfig.business.address.streetAddress}, Kinston, NC{" "}
                  {seoConfig.business.address.postalCode}
                </strong>
                , we have been serving patients with dedication and compassion.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                Our practice combines the personalized care of a family medicine
                practice with the convenience of urgent care services. We
                believe that everyone deserves access to quality healthcare,
                which is why we offer walk-in urgent care services with no
                appointment needed.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                Over the years, we have built a reputation for excellence in
                primary care, family medicine, pediatric care, women's health,
                geriatric care, and occupational health services. Our team of
                experienced physicians and healthcare professionals is committed
                to treating each patient with dignity, respect, and the highest
                standard of medical expertise.
              </p>
            </div>

            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={aboutImg}
                alt="Hope Physicians medical facility providing quality healthcare in Kinston, NC"
                className="w-full h-[500px] object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION, VISION, VALUES */}
      <section className="relative py-20 md:py-28 reveal-on-scroll bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <p className="text-primary text-sm uppercase tracking-wider font-semibold">
                Our Foundation
              </p>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
              Mission, Vision & Values
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Mission */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Our Mission
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                To provide comprehensive, compassionate, and accessible
                healthcare services to individuals and families in Kinston, NC
                and surrounding communities. We are committed to treating every
                patient with dignity, respect, and the highest standard of
                medical expertise, ensuring quality medical care with a personal
                touch.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
              <div className="text-4xl mb-4">👁️</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Our Vision
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                To be the leading healthcare provider in Kinston, NC, recognized
                for excellence in primary care, family medicine, and urgent care
                services. We envision a community where quality healthcare is
                accessible to all, and where patients feel valued, heard, and
                cared for at every visit.
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">
                  {value.title}
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OUR TEAM SECTION */}
      <section className="relative py-20 md:py-28 reveal-on-scroll bg-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-4">
              <div className="w-2 h-2 rounded-full bg-teal-400"></div>
              <p className="text-white/90 text-sm uppercase tracking-wider font-semibold">
                Meet Our Team
              </p>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              Expert Healthcare Professionals
            </h2>
            <p className="text-white/90 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              Our team of experienced physicians and healthcare professionals is
              dedicated to providing you with the best possible care.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div className="relative rounded-xl overflow-hidden mb-6 h-64">
                  <img
                    src={doctorImg}
                    alt={`${member.name} - ${member.role} at Hope Physicians`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-lg font-semibold text-primary mb-2">
                  {member.role}
                </p>
                <p className="text-gray-600 mb-3">{member.specialty}</p>
                <p className="text-gray-700 font-medium mb-2">
                  {member.education}
                </p>
                <p className="text-gray-600 mb-4">{member.experience}</p>
                <p className="text-gray-700 leading-relaxed">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US SECTION */}
      <section className="relative py-20 md:py-28 reveal-on-scroll bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full w-fit mb-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <p className="text-primary text-sm uppercase tracking-wider font-semibold">
                  Why Choose Us
                </p>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Your Trusted Healthcare Partner
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                At Hope Physicians, we understand that choosing a healthcare
                provider is an important decision. Here's what sets us apart:
              </p>

              <ul className="space-y-4">
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Comprehensive Services
                    </h4>
                    <p className="text-gray-600">
                      From primary care to urgent care, family medicine to
                      specialized services, we provide a full range of
                      healthcare solutions under one roof.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Walk-In Urgent Care
                    </h4>
                    <p className="text-gray-600">
                      No appointment needed for urgent care visits. We're here
                      when you need us most, providing immediate medical
                      attention.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Experienced Physicians
                    </h4>
                    <p className="text-gray-600">
                      Our team of board-certified physicians brings years of
                      experience and expertise to every patient interaction.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Patient-Centered Care
                    </h4>
                    <p className="text-gray-600">
                      We listen to your concerns, answer your questions, and
                      involve you in your healthcare decisions.
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={familyImg}
                alt="Hope Physicians providing compassionate family medicine and primary care services"
                className="w-full h-[500px] object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* ACHIEVEMENTS & ACCREDITATIONS */}
      <section className="relative py-20 md:py-28 reveal-on-scroll bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <p className="text-primary text-sm uppercase tracking-wider font-semibold">
                Our Commitment
              </p>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
              Excellence in Every Aspect
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary text-xl">✓</span>
                  </div>
                  <p className="text-gray-800 text-lg font-medium leading-relaxed">
                    {achievement}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LOCATION & CONTACT CTA */}
      <section className="relative py-20 md:py-28 reveal-on-scroll bg-gradient-to-r from-primary via-blue-700 to-indigo-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              Visit Us Today
            </h2>
            <p className="text-white/90 text-lg md:text-xl mb-8 leading-relaxed">
              We're conveniently located in Kinston, NC, providing easy access
              to quality healthcare services for residents and visitors.
            </p>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white/20">
              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div>
                  <h3 className="text-white font-semibold mb-3 text-lg">
                    Location
                  </h3>
                  <p className="text-white/90 leading-relaxed">
                    <strong>{seoConfig.business.address.streetAddress}</strong>
                    <br />
                    {seoConfig.business.address.addressLocality},{" "}
                    {seoConfig.business.address.addressRegion}{" "}
                    {seoConfig.business.address.postalCode}
                  </p>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-3 text-lg">
                    Contact
                  </h3>
                  <p className="text-white/90 leading-relaxed">
                    <strong>Phone:</strong>{" "}
                    <a
                      href={`tel:${seoConfig.business.phone}`}
                      className="hover:underline">
                      {seoConfig.business.phone}
                    </a>
                    <br />
                    <strong>Fax:</strong> {seoConfig.business.fax}
                    <br />
                    <strong>Email:</strong>{" "}
                    <a
                      href={`mailto:${seoConfig.business.email}`}
                      className="hover:underline">
                      {seoConfig.business.email}
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/appointment"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                Book an Appointment
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/30 hover:bg-white/20 transition-all duration-300">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
