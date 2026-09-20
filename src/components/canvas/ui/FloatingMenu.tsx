"use client";

import React from "react";
import styles from "./FloatingMenu.module.css";

interface FloatingMenuProps {
  isDark?: boolean;
  onNavigate?: (target: string) => void;
}

/**
 * FloatingMenu — Vertically-centered left-side floating nav.
 *
 * 5 icon buttons matching the old portfolio & target screenshot:
 *   Home · Work · About · Contact · Settings
 *
 * Glassmorphism pill with theme-adaptive styling.
 * SVG icons sourced from creative reference UI/FloatingMenu.jsx.
 */
export default function FloatingMenu({
  isDark = true,
  onNavigate,
}: FloatingMenuProps) {
  const [activeId, setActiveId] = React.useState<string>("home");
  const themeClass = isDark ? styles.dark : styles.light;

  const handleClick = (target: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveId(target);
    onNavigate?.(target);
  };

  const getBtnClass = (target: string) =>
    `${styles.iconBtn} ${activeId === target ? styles.active : ""}`;

  return (
    <nav
      id="floating-menu"
      className={`${styles.menu} ${themeClass}`}
      aria-label="Quick navigation"
    >
      {/* Home */}
      <button
        className={getBtnClass("home")}
        data-tooltip="Home"
        aria-label="Home"
        onClick={handleClick("home")}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      </button>

      {/* Work */}
      <button
        className={styles.iconBtn}
        data-tooltip="Work"
        aria-label="Work"
        onClick={handleClick("work")}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      </button>

      {/* About */}
      <button
        className={styles.iconBtn}
        data-tooltip="About"
        aria-label="About"
        onClick={handleClick("about")}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </button>

      {/* Contact */}
      <button
        className={styles.iconBtn}
        data-tooltip="Contact"
        aria-label="Contact"
        onClick={handleClick("contact")}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      </button>

      {/* Settings */}
      <button
        className={styles.iconBtn}
        data-tooltip="Settings"
        aria-label="Settings"
        onClick={handleClick("settings")}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </button>
    </nav>
  );
}
