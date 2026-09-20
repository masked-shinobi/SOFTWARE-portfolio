import React from 'react';

export default function JourneyCard({ onProjectsClick, onEducationClick }) {
  const handleProjectsClick = (e) => {
    e.stopPropagation();
    if (onProjectsClick) onProjectsClick();
  };

  const handleEducationClick = (e) => {
    e.stopPropagation();
    if (onEducationClick) onEducationClick();
  };

  return (
    <div className="card-container" style={{ left: '1300px', top: '1200px' }}>
      <span className="card-label">CARD #03 &mdash; JOURNEY</span>
      <div className="container">
        {/* Projects Card */}
        <div
          data-text="Projects"
          style={{ '--r': '-15' }}
          className="glass"
          id="projects-trigger"
          onClick={handleProjectsClick}
          onTouchStart={(e) => { e.stopPropagation(); if (onProjectsClick) onProjectsClick(); }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
          </svg>
        </div>
        {/* Resume Card */}
        <a href="https://drive.google.com/file/d/1QGokMLQhPTLxFkUjbR9Es9ofhuaZsnsl/view?usp=drive_link" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
          <div data-text="Resume" style={{ '--r': '5' }} className="glass">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <line x1="10" y1="9" x2="8" y2="9"></line>
            </svg>
          </div>
        </a>
        {/* Educational Journey Card */}
        <div
          data-text="Education"
          style={{ '--r': '25' }}
          className="glass"
          onClick={handleEducationClick}
          onTouchStart={(e) => { e.stopPropagation(); if (onEducationClick) onEducationClick(); }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
            <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path>
          </svg>
        </div>
      </div>
    </div>
  );
}
