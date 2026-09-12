"use client";

import { motion } from "motion/react";

// =============================================================================
// Mobile Unsupported Placeholder Screen
// =============================================================================
// Rendered when the user accesses the platform on a mobile form factor
// (< 768px width). Provides clear notification that the interactive desktop
// workstation is optimized for larger displays, showing live resolution readout
// and direct quick-contact links.
// =============================================================================

interface MobileUnsupportedProps {
  width: number;
  name: string;
  headline: string;
}

export function MobileUnsupported({ width, name, headline }: MobileUnsupportedProps) {
  return (
    <div className="mobile-guard">
      {/* Ambient background orbs */}
      <div className="entry-page__bg">
        <div className="entry-page__bg-orb entry-page__bg-orb--1" />
        <div className="entry-page__bg-orb entry-page__bg-orb--2" />
      </div>
      <div className="entry-page__grid" />

      <motion.div
        className="mobile-guard__card glass-card"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Top device warning icon */}
        <div className="mobile-guard__icon-wrap">
          <div className="mobile-guard__icon-pulse" />
          <svg
            className="mobile-guard__icon"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
            <path d="M12 18h.01" />
          </svg>
        </div>

        {/* Status Chip */}
        <div className="mobile-guard__chip">
          <span className="mobile-guard__chip-dot" />
          <span>DESKTOP OPTIMIZED EXPERIENCE</span>
        </div>

        <h1 className="mobile-guard__title">Mobile Version Not Supported Yet</h1>

        <p className="mobile-guard__description">
          <strong>{name}</strong>&apos;s portfolio is engineered as an interactive dual-mode
          workstation featuring a scroll-driven code architecture and spatial canvas engine,
          specifically tailored for desktop and laptop displays.
        </p>

        {/* Viewport Diagnostic Specs */}
        <div className="mobile-guard__specs">
          <div className="mobile-guard__spec-item">
            <span className="mobile-guard__spec-label">Detected Width</span>
            <span className="mobile-guard__spec-val mobile-guard__spec-val--warn">
              {width > 0 ? `${width}px` : "Mobile"}
            </span>
          </div>
          <div className="mobile-guard__spec-divider" />
          <div className="mobile-guard__spec-item">
            <span className="mobile-guard__spec-label">Required Width</span>
            <span className="mobile-guard__spec-val mobile-guard__spec-val--success">
              ≥ 768px
            </span>
          </div>
          <div className="mobile-guard__spec-divider" />
          <div className="mobile-guard__spec-item">
            <span className="mobile-guard__spec-label">Mobile Scope</span>
            <span className="mobile-guard__spec-val">Phase F</span>
          </div>
        </div>

        {/* Action Callout */}
        <div className="mobile-guard__callout">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="20" height="14" x="2" y="3" rx="2" />
            <line x1="8" x2="16" y1="21" y2="21" />
            <line x1="12" x2="12" y1="17" y2="21" />
          </svg>
          <span>Please open on a desktop or laptop browser to explore the full platform.</span>
        </div>

        {/* Footer Quick Links */}
        <div className="mobile-guard__footer">
          <p className="mobile-guard__footer-label">Quick Contacts & Links</p>
          <div className="mobile-guard__links">
            <a
              href="https://github.com/masked-shinobi"
              target="_blank"
              rel="noopener noreferrer"
              className="mobile-guard__link"
            >
              GitHub ↗
            </a>
            <a
              href="https://linkedin.com/in/sanjaybaskar"
              target="_blank"
              rel="noopener noreferrer"
              className="mobile-guard__link"
            >
              LinkedIn ↗
            </a>
            <a
              href="mailto:maskedprogrammer.in@gmail.com"
              className="mobile-guard__link"
            >
              Email ↗
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
