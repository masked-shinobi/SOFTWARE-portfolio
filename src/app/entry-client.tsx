"use client";

import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BootLoader } from "@/components/boot-loader";
import { ExperienceCard } from "@/components/experience-card";

// =============================================================================
// Entry Client — Client Component managing boot → choice transition
// =============================================================================
// Receives profile data as props from the Server Component parent.
// Shows the BootLoader first, then transitions to the choice page.
// =============================================================================

// SVG icons for each experience card
function DeveloperIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
      <line x1="14" y1="4" x2="10" y2="20" />
    </svg>
  );
}

function CreativeIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="13.5" cy="6.5" r="2.5" />
      <circle cx="17.5" cy="10.5" r="2.5" />
      <circle cx="8.5" cy="7.5" r="2.5" />
      <circle cx="6.5" cy="12.5" r="2.5" />
      <path d="M12 22c-4.97 0-9-2.24-9-5v-.36c0-1.66 2.02-3.06 4.5-3.64 1.2 1.2 3.06 2 5.08 2 1.92 0 3.7-.72 4.88-1.82C19.84 13.7 21 14.98 21 16.64V17c0 2.76-4.03 5-9 5Z" />
    </svg>
  );
}

function StoryIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <path d="M8 7h8" />
      <path d="M8 11h6" />
    </svg>
  );
}

interface EntryClientProps {
  name: string;
  headline: string;
}

export function EntryClient({ name, headline }: EntryClientProps) {
  const [showBoot, setShowBoot] = useState(true);

  const handleBootComplete = useCallback(() => {
    setShowBoot(false);
  }, []);

  return (
    <>
      {/* Boot Loader Phase */}
      <AnimatePresence mode="wait">
        {showBoot && (
          <BootLoader
            key="boot"
            name={name}
            headline={headline}
            onComplete={handleBootComplete}
          />
        )}
      </AnimatePresence>

      {/* Choice Page Phase */}
      <AnimatePresence>
        {!showBoot && (
          <motion.div
            key="choice"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="entry-page">
              {/* Background effects */}
              <div className="entry-page__bg">
                <div className="entry-page__bg-orb entry-page__bg-orb--1" />
                <div className="entry-page__bg-orb entry-page__bg-orb--2" />
                <div className="entry-page__bg-orb entry-page__bg-orb--3" />
              </div>
              <div className="entry-page__grid" />

              {/* Header */}
              <motion.header
                className="entry-page__header"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h1 className="entry-page__name">{name}</h1>
                <p className="entry-page__headline">{headline}</p>
                <p className="entry-page__subtitle">Choose your experience</p>
              </motion.header>

              {/* Experience Cards */}
              <div className="entry-page__cards">
                <ExperienceCard
                  title="Developer"
                  description="Structured. Technical. Scroll-driven. A code-controlled experience."
                  href="/developer"
                  icon={<DeveloperIcon />}
                  variant="developer"
                  index={0}
                />
                <ExperienceCard
                  title="Creative"
                  description="Spatial. Visual. Canvas-driven. An interactive canvas experience."
                  href="/creative"
                  icon={<CreativeIcon />}
                  variant="creative"
                  index={1}
                />
                <ExperienceCard
                  title="Story"
                  description="Immersive. Narrative. 3D. A journey through my story."
                  href="/story"
                  icon={<StoryIcon />}
                  variant="story"
                  comingSoon
                  index={2}
                />
              </div>

              {/* Footer */}
              <motion.footer
                className="entry-page__footer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <p className="entry-page__footer-text">
                  built with obsessive attention to detail
                </p>
              </motion.footer>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
