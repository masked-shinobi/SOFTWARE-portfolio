import React from 'react';
import useProjects from '../../hooks/useProjects';

// Inline SVG icons for each tech (simplified, recognizable logos)
const techSvgs = {
  react: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="2.5" />
      <ellipse cx="12" cy="12" rx="10" ry="4" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <ellipse cx="12" cy="12" rx="10" ry="4" fill="none" stroke="currentColor" strokeWidth="1.2" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4" fill="none" stroke="currentColor" strokeWidth="1.2" transform="rotate(120 12 12)" />
    </svg>
  ),
  nodejs: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 1.85l9 5.2v10.4l-9 5.2-9-5.2V7.05l9-5.2zm0 2.31L5 8.93v6.64l7 4.77 7-4.77V8.93l-7-4.77z" />
      <text x="12" y="14" textAnchor="middle" fontSize="6" fontWeight="bold" fill="currentColor">N</text>
    </svg>
  ),
  python: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 6 4.02 6 5.5V8h6v1H5.5C3.57 9 2 10.56 2 12.5S3.57 16 5.5 16H8v-2.5C8 11.57 9.57 10 11.5 10h5c.83 0 1.5-.67 1.5-1.5v-5C18 2.67 15.33 2 12 2zm-1 2.5a1 1 0 110 2 1 1 0 010-2z" />
      <path d="M12 22c5.52 0 6-2.02 6-3.5V16h-6v-1h6.5c1.93 0 3.5-1.56 3.5-3.5S20.43 8 18.5 8H16v2.5c0 1.93-1.57 3.5-3.5 3.5h-5c-.83 0-1.5.67-1.5 1.5v5C6 21.33 8.67 22 12 22zm1-2.5a1 1 0 110-2 1 1 0 010 2z" />
    </svg>
  ),
  langchain: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  ),
  faiss: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <circle cx="6" cy="6" r="2" /><circle cx="18" cy="6" r="2" /><circle cx="6" cy="18" r="2" /><circle cx="18" cy="18" r="2" /><circle cx="12" cy="12" r="3" />
      <line x1="6" y1="6" x2="12" y2="12" stroke="currentColor" strokeWidth="1" /><line x1="18" y1="6" x2="12" y2="12" stroke="currentColor" strokeWidth="1" /><line x1="6" y1="18" x2="12" y2="12" stroke="currentColor" strokeWidth="1" /><line x1="18" y1="18" x2="12" y2="12" stroke="currentColor" strokeWidth="1" />
    </svg>
  ),
  supabase: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.7 21.6c-.4.5-1.3.2-1.3-.5V14h8.1c.9 0 1.4 1 .8 1.6L13.7 21.6z" opacity=".6" />
      <path d="M10.3 2.4c.4-.5 1.3-.2 1.3.5V10H3.5c-.9 0-1.4-1-.8-1.6L10.3 2.4z" />
    </svg>
  ),
  javascript: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <rect x="2" y="2" width="20" height="20" rx="2" fill="currentColor" opacity="0.15" />
      <text x="12" y="17" textAnchor="middle" fontSize="11" fontWeight="bold" fill="currentColor">JS</text>
    </svg>
  ),
  gsap: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <rect x="2" y="2" width="20" height="20" rx="3" fill="currentColor" opacity="0.15" />
      <text x="12" y="16" textAnchor="middle" fontSize="8" fontWeight="bold" fill="currentColor">GS</text>
    </svg>
  ),
  threejs: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 3h18L12 21 3 3zm3.5 2L12 17l5.5-12H6.5z" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  docker: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M13 3h2v2h-2zm-4 0h2v2H9zm4 4h2v2h-2zM9 7h2v2H9zM5 7h2v2H5zm4-4h2v2H9zm8 4h2v2h-2zm-4 0h2v2h-2zm-8 4h16c0 4-3 7-8 7s-8-3-8-7z" />
    </svg>
  ),
  cicd: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
      <path d="M12 7l5 5-5 5V7z" />
    </svg>
  ),
  cloud: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
    </svg>
  ),
  reactnative: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="2.5" />
      <ellipse cx="12" cy="12" rx="10" ry="4" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <ellipse cx="12" cy="12" rx="10" ry="4" fill="none" stroke="currentColor" strokeWidth="1.2" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4" fill="none" stroke="currentColor" strokeWidth="1.2" transform="rotate(120 12 12)" />
      <rect x="8" y="18" width="8" height="4" rx="1" fill="currentColor" opacity="0.3" />
    </svg>
  ),
  kotlin: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <polygon points="2,2 2,22 12,12" />
      <polygon points="2,22 22,22 12,12" />
      <polygon points="12,12 22,2 2,2" />
    </svg>
  ),
  solidity: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L6 12h12L12 2z" opacity="0.6" />
      <path d="M12 22l6-10H6l6 10z" />
    </svg>
  ),
  blockchain: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <rect x="3" y="3" width="6" height="6" rx="1" /><rect x="15" y="3" width="6" height="6" rx="1" /><rect x="9" y="15" width="6" height="6" rx="1" />
      <line x1="9" y1="6" x2="15" y2="6" stroke="currentColor" strokeWidth="1.5" /><line x1="12" y1="9" x2="12" y2="15" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  networking: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="4" r="2" /><circle cx="4" cy="20" r="2" /><circle cx="20" cy="20" r="2" /><circle cx="12" cy="14" r="2" />
      <line x1="12" y1="6" x2="12" y2="12" stroke="currentColor" strokeWidth="1.5" /><line x1="10" y1="15" x2="6" y2="18" stroke="currentColor" strokeWidth="1.5" /><line x1="14" y1="15" x2="18" y2="18" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  cpp: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <rect x="2" y="2" width="20" height="20" rx="3" fill="currentColor" opacity="0.15" />
      <text x="12" y="16" textAnchor="middle" fontSize="8" fontWeight="bold" fill="currentColor">C+</text>
    </svg>
  ),
  gtest: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15" />
      <path d="M9 12l2 2 4-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  algorithm: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 3h18v18H3V3zm4 4v10h10V7H7z" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 12h10M12 7v10" stroke="currentColor" strokeWidth="1" />
    </svg>
  ),
  unittest: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
    </svg>
  ),
  demo: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
  ),
};

export default function StackCard() {
  const { techIcons, getAllTechKeys } = useProjects();
  const techKeys = getAllTechKeys();
  const previewTechKeys = techKeys.slice(0, 4);

  return (
    <div className="card-container" style={{ left: '2150px', top: '1100px' }}>
      <span className="card-label">CARD #01 &mdash; STACK</span>
      <div className="stack-card-hover-zone">
        <div className="stack-card-modern">
          <div className="stack-card-compact">
            <div className="stack-card-header">
              <h2 className="stack-card-title">Tech Stack</h2>
              <span className="stack-card-count">{techKeys.length}</span>
            </div>
            <div className="stack-card-preview">
              {previewTechKeys.map((key, i) => {
                const tech = techIcons[key];
                if (!tech) return null;

                return (
                  <div
                    key={key}
                    className="stack-icon-pill stack-icon-pill-preview"
                    style={{
                      '--tech-color': tech.color,
                      '--tech-bg': tech.bg,
                      animationDelay: `${i * 0.05}s`,
                    }}
                    title={tech.name}
                  >
                    <span className="stack-icon-svg" style={{ color: tech.color }}>
                      {techSvgs[key] || null}
                    </span>
                    <span className="stack-icon-name">{tech.name}</span>
                  </div>
                );
              })}
            </div>
            <p className="stack-card-compact-text">Hover to reveal all tools</p>
          </div>
          <div className="stack-card-body">
            <div className="stack-card-header">
              <h2 className="stack-card-title">Tech Stack</h2>
              <span className="stack-card-count">{techKeys.length} tools</span>
            </div>
            <div className="stack-icon-grid">
              {techKeys.map((key, i) => {
                const tech = techIcons[key];
                if (!tech) return null;
                return (
                  <div
                    key={key}
                    className="stack-icon-pill"
                    style={{
                      '--tech-color': tech.color,
                      '--tech-bg': tech.bg,
                      animationDelay: `${i * 0.05}s`,
                    }}
                    title={tech.name}
                  >
                    <span className="stack-icon-svg" style={{ color: tech.color }}>
                      {techSvgs[key] || null}
                    </span>
                    <span className="stack-icon-name">{tech.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
