import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { getAssetUrl } from '../utils/imageLoader';

export default function HeroSection({ onStickerClick }) {
  const { isDark } = useTheme();

  const handleClick = (e) => {
    e.stopPropagation();
    if (onStickerClick) onStickerClick();
  };

  return (
    <div id="hero-container">
      <div className="hero-sticker-wrapper" onClick={handleClick} onTouchStart={(e) => { e.stopPropagation(); if (onStickerClick) onStickerClick(); }}>
        <img src={getAssetUrl('Hero-image.png')} className="hero-sticker light-only" alt="Sticker Light" />
        <img src={getAssetUrl('Hero-image-dark.png')} className="hero-sticker dark-only" alt="Sticker Dark" />
      </div>
      <h1 id="hero-title">Non-Linear Creative.</h1>
      <p id="hero-subtitle">DESIGN ENGINEER &bull; AI &amp; WEB &amp; CLOUD ENGINEERING</p>
    </div>
  );
}
