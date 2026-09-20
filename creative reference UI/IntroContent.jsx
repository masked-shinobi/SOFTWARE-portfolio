import React from 'react';

export default function IntroContent() {
  return (
    <div className="intro-container">
      <div className="intro-content">
        <h1 className="intro-title">Hi there, I am <span className="highlight">Sanjay Baskar</span></h1>
        <p className="intro-text">
          I'm a <span className="highlight">Design Engineer</span> building digital products that blend creativity with robust engineering.
        </p>
        <p className="intro-text">
          Currently exploring the frontiers of <span className="highlight">AI-driven</span> software and cloud-native experiences.
        </p>
        <p className="intro-text" style={{ fontStyle: 'italic', opacity: 0.8, fontSize: '1rem', marginTop: '32px' }}>
          "Non-linear thinking for a linear world."
        </p>
      </div>
    </div>
  );
}
