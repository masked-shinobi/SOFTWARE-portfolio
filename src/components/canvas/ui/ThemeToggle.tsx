"use client";

import React from "react";
import styles from "./ThemeToggle.module.css";

interface ThemeToggleProps {
  isDark?: boolean;
  onToggle?: () => void;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
}

/**
 * ThemeToggle Component
 * Recreated from creative reference UI/ThemeToggle.jsx with rich CSS animations:
 *  - Daytime: Sky-blue track, glowing sun with concentric rays, drifting clouds.
 *  - Nighttime: Midnight black track with starry sky, rotating cratered moon.
 *  - 360-degree rotation during day-to-night toggle.
 */
export default function ThemeToggle({
  isDark = true,
  onToggle,
  className = "",
  style,
  id = "theme-checkbox",
}: ThemeToggleProps) {
  return (
    <label
      className={`${styles.switch} ${className}`.trim()}
      title="Toggle Theme"
      style={style}
    >
      <input
        id={id}
        className={styles.checkbox}
        type="checkbox"
        checked={isDark}
        onChange={onToggle}
        aria-label="Toggle dark and light theme"
      />
      <div className={styles.slider}>
        {/* Sun / Moon Orb */}
        <div className={styles.sunMoon}>
          {/* Moon Craters */}
          <svg
            id="moon-dot-1"
            className={`${styles.moonDot} ${styles.moonDot1}`}
            viewBox="0 0 100 100"
          >
            <circle cx="50" cy="50" r="50" />
          </svg>
          <svg
            id="moon-dot-2"
            className={`${styles.moonDot} ${styles.moonDot2}`}
            viewBox="0 0 100 100"
          >
            <circle cx="50" cy="50" r="50" />
          </svg>
          <svg
            id="moon-dot-3"
            className={`${styles.moonDot} ${styles.moonDot3}`}
            viewBox="0 0 100 100"
          >
            <circle cx="50" cy="50" r="50" />
          </svg>

          {/* Sun Light Rays */}
          <svg
            id="light-ray-1"
            className={`${styles.lightRay1}`}
            viewBox="0 0 100 100"
          >
            <circle cx="50" cy="50" r="50" />
          </svg>
          <svg
            id="light-ray-2"
            className={`${styles.lightRay2}`}
            viewBox="0 0 100 100"
          >
            <circle cx="50" cy="50" r="50" />
          </svg>
          <svg
            id="light-ray-3"
            className={`${styles.lightRay3}`}
            viewBox="0 0 100 100"
          >
            <circle cx="50" cy="50" r="50" />
          </svg>

          {/* Daytime Clouds */}
          <svg
            id="cloud-1"
            className={`${styles.cloudDark} ${styles.cloud1}`}
            viewBox="0 0 100 100"
          >
            <circle cx="50" cy="50" r="50" />
          </svg>
          <svg
            id="cloud-2"
            className={`${styles.cloudDark} ${styles.cloud2}`}
            viewBox="0 0 100 100"
          >
            <circle cx="50" cy="50" r="50" />
          </svg>
          <svg
            id="cloud-3"
            className={`${styles.cloudDark} ${styles.cloud3}`}
            viewBox="0 0 100 100"
          >
            <circle cx="50" cy="50" r="50" />
          </svg>
          <svg
            id="cloud-4"
            className={`${styles.cloudLight} ${styles.cloud4}`}
            viewBox="0 0 100 100"
          >
            <circle cx="50" cy="50" r="50" />
          </svg>
          <svg
            id="cloud-5"
            className={`${styles.cloudLight} ${styles.cloud5}`}
            viewBox="0 0 100 100"
          >
            <circle cx="50" cy="50" r="50" />
          </svg>
          <svg
            id="cloud-6"
            className={`${styles.cloudLight} ${styles.cloud6}`}
            viewBox="0 0 100 100"
          >
            <circle cx="50" cy="50" r="50" />
          </svg>
        </div>

        {/* Nighttime Stars */}
        <div className={styles.stars}>
          <svg
            id="star-1"
            className={`${styles.star} ${styles.star1}`}
            viewBox="0 0 20 20"
          >
            <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z" />
          </svg>
          <svg
            id="star-2"
            className={`${styles.star} ${styles.star2}`}
            viewBox="0 0 20 20"
          >
            <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z" />
          </svg>
          <svg
            id="star-3"
            className={`${styles.star} ${styles.star3}`}
            viewBox="0 0 20 20"
          >
            <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z" />
          </svg>
          <svg
            id="star-4"
            className={`${styles.star} ${styles.star4}`}
            viewBox="0 0 20 20"
          >
            <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z" />
          </svg>
        </div>
      </div>
    </label>
  );
}
