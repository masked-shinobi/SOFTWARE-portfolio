import React from 'react';
import { getAssetUrl } from '../../utils/imageLoader';

export default function WorkspaceCard() {
  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="card-container workspace-card-container" 
      style={{ left: '380px', top: '1450px' }}
      onMouseDown={stopPropagation}
      onTouchStart={stopPropagation}
    >
      <span className="card-label">CARD #06 &mdash; WORKSPACE</span>
      <div className="workspace-card">
        <div className="workspace-card-header">
          <div className="workspace-title-wrapper">
            <h2 className="workspace-card-title">Sanjay's Workspace</h2>
            <p className="workspace-card-subtitle">Notion DSA Sheet Embed</p>
          </div>
          <div className="workspace-card-actions">
            <a 
              href="https://app.notion.com/p/dsa-spreadsheet-sanjaybaskar/73b3a11dd45d8250922601672faf0c8c?v=8d43a11dd45d822db96b08a00fbbd6ef&source=copy_link"
              target="_blank" 
              rel="noopener noreferrer"
              className="workspace-link-btn"
              title="Open Workspace in Notion"
            >
              <span>Open in Notion</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="workspace-link-icon">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </a>
            <span className="workspace-card-badge">Live</span>
          </div>
        </div>
        <div className="workspace-iframe-wrapper">
          <iframe 
            src="https://dsa-spreadsheet-sanjaybaskar.notion.site/ebd//9a13a11dd45d82439717013153949f27" 
            width="100%" 
            height="100%" 
            style={{ border: 'none' }}
            allowFullScreen 
            title="Sanjay DSA Sheet"
          />
        </div>
        <a
          href="https://marketplace.visualstudio.com/items?itemName=SanjayBaskar.shinobi-black-theme"
          target="_blank"
          rel="noopener noreferrer"
          className="workspace-theme-float"
          title="Open Shinobi Black Theme in VS Code Marketplace"
        >
          <img
            src={getAssetUrl('floating-stickers/image.png')}
            alt="Shinobi Black VS Code Theme"
            className="workspace-theme-image"
          />
          <span className="workspace-theme-tag">watch out my new theme</span>
        </a>
      </div>
    </div>
  );
}
