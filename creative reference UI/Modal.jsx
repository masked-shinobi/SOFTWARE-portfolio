import React, { useEffect, useRef } from 'react';

export default function Modal({ isOpen, onClose, children, maxWidth, width, height }) {
  const overlayRef = useRef(null);

  useEffect(() => {
    if (!overlayRef.current) return;
    if (isOpen) {
      overlayRef.current.classList.add('active');
    } else {
      overlayRef.current.classList.remove('active');
    }
  }, [isOpen]);

  const handleBackdropClick = (e) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  const contentStyle = {};
  if (maxWidth) contentStyle.maxWidth = maxWidth;
  if (width) contentStyle.width = width;
  if (height) contentStyle.height = height;

  return (
    <div
      className="modal-overlay"
      ref={overlayRef}
      onClick={handleBackdropClick}
    >
      <div className="modal-content" style={contentStyle}>
        <button className="close-modal" onClick={onClose} aria-label="Close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
}
