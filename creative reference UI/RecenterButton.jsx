import React from 'react';

export default function RecenterButton({ onRecenter }) {
  return (
    <button id="recenter-btn" title="Recenter View" onClick={onRecenter}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M3 12h3m12 0h3M12 3v3m0 12v3"></path>
      </svg>
    </button>
  );
}
