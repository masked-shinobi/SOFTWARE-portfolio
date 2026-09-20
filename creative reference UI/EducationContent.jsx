import React, { useEffect, useState } from 'react';

export default function EducationContent() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const educationData = [
    {
      id: 'school',
      period: '2019 — 2023',
      institution: 'Adharsh Vidhyalaya Public School',
      location: 'Anthiyur, Tamil Nadu',
      title: 'Secondary & Higher Secondary',
      milestones: [
        { year: '2021', label: 'Grade X (Secondary School Certificate)' },
        { year: '2023', label: 'Grade XII (Higher Secondary Certificate)' }
      ],
      mapUrl: 'https://maps.google.com/maps?q=Adharsh%20Vidhyalaya%20Public%20School,%20Anthiyur,%20Tamil%20Nadu&t=&z=14&ie=UTF8&iwloc=&output=embed',
      icon: '🏫',
      gradient: 'linear-gradient(135deg, rgba(156, 184, 236, 0.15) 0%, rgba(255, 137, 204, 0.08) 100%)'
    },
    {
      id: 'college',
      period: '2023 — 2027 (Ongoing)',
      institution: 'SRM Institute of Science and Technology',
      location: 'Kattankulathur, Chennai, Tamil Nadu',
      title: 'Bachelor of Technology in Computer Science & Engineering',
      milestones: [
        { year: '2023', label: 'Started B.Tech CSE (Kattankulathur Campus)' },
        { year: 'Ongoing', label: 'Current CGPA: 9.88 with Merit Scholarship' }
      ],
      mapUrl: 'https://maps.google.com/maps?q=SRM%20Institute%20of%20Science%20and%20Technology,%20Kattankulathur&t=&z=14&ie=UTF8&iwloc=&output=embed',
      icon: '🎓',
      gradient: 'linear-gradient(135deg, rgba(98, 194, 254, 0.15) 0%, rgba(156, 184, 236, 0.08) 100%)'
    }
  ];

  return (
    <div className="education-content">
      <header className="education-header">
        <div className="education-header-badge">
          <span className="education-badge-dot" />
          Academic Milestone Timeline
        </div>
        <h1 className="education-title">Educational Journey</h1>
        <p className="education-subtitle">
          An interactive record of my academic progression and regional footprint
        </p>
      </header>

      <div className={`timeline-container ${isMobile ? 'vertical' : 'horizontal'}`}>
        {!isMobile && <div className="timeline-connecting-line" />}
        {educationData.map((item, idx) => (
          <div
            key={item.id}
            className="timeline-node"
            style={{
              animationDelay: `${idx * 0.15}s`,
              '--card-gradient': item.gradient
            }}
          >
            {/* Timeline point indicator */}
            <div className="timeline-dot">
              <span className="timeline-dot-icon">{item.icon}</span>
            </div>

            <div className="timeline-card">
              <div className="timeline-card-header">
                <span className="timeline-badge">{item.period}</span>
                <span className="timeline-node-location">{item.location}</span>
              </div>

              <div className="timeline-card-body">
                <h2 className="timeline-institution">{item.institution}</h2>
                <h3 className="timeline-degree">{item.title}</h3>

                <div className="timeline-milestones-list">
                  {item.milestones.map((m, mIdx) => (
                    <div key={mIdx} className="timeline-milestone-item">
                      <span className="milestone-year">{m.year}</span>
                      <span className="milestone-label">{m.label}</span>
                    </div>
                  ))}
                </div>

                <div className="timeline-map-wrapper">
                  <div className="timeline-map-header">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    Explore Campus Location
                  </div>
                  <iframe
                    className="timeline-map-iframe"
                    title={`${item.institution} Location`}
                    src={item.mapUrl}
                    loading="lazy"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="education-footer">
        <span>Curious about my projects? Open the </span>
        <button className="education-redirect-btn" onClick={() => window.postMessage({ action: 'openProjects' }, '*')}>
          Projects Catalog
        </button>
      </div>
    </div>
  );
}
