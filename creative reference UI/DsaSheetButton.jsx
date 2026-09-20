import React from 'react';

const DSA_SHEET_URL = 'https://app.notion.com/p/dsa-spreadsheet-sanjaybaskar/73b3a11dd45d8250922601672faf0c8c?v=8d43a11dd45d822db96b08a00fbbd6ef&source=copy_link';

export default function DsaSheetButton() {
  const handleClick = () => {
    window.open(DSA_SHEET_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <button id="dsa-sheet-btn" title="Open DSA Sheet" onClick={handleClick}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="3"></rect>
        <path d="M3 9h18"></path>
        <path d="M8 3v18"></path>
        <path d="M15 3v18"></path>
        <path d="M3 15h18"></path>
      </svg>
    </button>
  );
}