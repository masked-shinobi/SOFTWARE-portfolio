"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

// =============================================================================
// Boot Loader — Full-screen intro animation
// =============================================================================
// Shows the portfolio owner's name with a typewriter effect, then fades out.
// Auto-transitions after the animation completes (~3s).
// "Skip" button in the corner for returning visitors.
// =============================================================================

interface BootLoaderProps {
  name: string;
  headline: string;
  onComplete: () => void;
}

export function BootLoader({ name, headline, onComplete }: BootLoaderProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [showHeadline, setShowHeadline] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);

  const handleSkip = useCallback(() => {
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    // Phase 1: Typewriter effect for the name
    let charIndex = 0;
    const typeInterval = setInterval(() => {
      if (charIndex < name.length) {
        setDisplayedText(name.slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typeInterval);

        // Phase 2: Brief pause, then show headline
        setTimeout(() => {
          setShowHeadline(true);
          setIsGlitching(true);

          // Phase 3: Hold for a moment, then complete
          setTimeout(() => {
            setShowCursor(false);
            setTimeout(onComplete, 600);
          }, 1200);
        }, 400);
      }
    }, 80);

    return () => clearInterval(typeInterval);
  }, [name, onComplete]);

  return (
    <motion.div
      className="boot-loader"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Scanline overlay */}
      <div className="boot-loader__scanline" />

      {/* Name with typewriter */}
      <motion.h1
        className={`boot-loader__name ${isGlitching ? "boot-loader__name--glitch" : ""}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      >
        {displayedText}
        {showCursor && <span className="boot-loader__cursor" />}
      </motion.h1>

      {/* Headline */}
      <AnimatePresence>
        {showHeadline && (
          <motion.p
            className="boot-loader__headline"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {headline}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Skip button */}
      <motion.button
        className="boot-loader__skip"
        onClick={handleSkip}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        aria-label="Skip intro animation"
      >
        Skip →
      </motion.button>
    </motion.div>
  );
}
