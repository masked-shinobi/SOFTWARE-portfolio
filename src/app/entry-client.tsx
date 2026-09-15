"use client";

import { useState, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BootLoader } from "@/components/boot-loader";
import { ChoiceScreen, ChoiceStageFrame } from "@/components/choice-screen";
import { MobileUnsupported } from "@/components/mobile-unsupported";
import { useViewportWidth } from "@/lib/use-viewport-width";

// =============================================================================
// Entry Client — Client Component managing boot → choice transition
// =============================================================================
// Receives profile data as props from the Server Component parent.
// Shows the BootLoader first, then transitions to the redesigned ChoiceScreen
// (Three.js spotlight blueprint background, character cutout, dual choice rounds,
// Iceland font typography, and hover cloud message).
// Automatically detects mobile form factor (< 768px) and renders the
// MobileUnsupported placeholder screen.
// =============================================================================

interface EntryClientProps {
  name: string;
  headline: string;
}

let inMemoryBootCompleted = false;

function hasBootCompleted(): boolean {
  if (typeof window === "undefined") return false;
  if (inMemoryBootCompleted) return true;
  try {
    return sessionStorage.getItem("portfolio_boot_completed") === "true";
  } catch {
    return false;
  }
}

function markBootCompleted(): void {
  inMemoryBootCompleted = true;
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem("portfolio_boot_completed", "true");
  } catch {
    // Ignore storage errors
  }
}

export function EntryClient({ name, headline }: EntryClientProps) {
  const [showBoot, setShowBoot] = useState(true);
  const { width, isMobile, isInitialized } = useViewportWidth();

  const handleBootComplete = useCallback(() => {
    markBootCompleted();
    setShowBoot(false);
  }, []);

  useEffect(() => {
    if (hasBootCompleted()) {
      setShowBoot(false);
    }
  }, []);

  // Automatic Mobile Form Factor Guard:
  // If viewport width is detected as mobile (< 768px), display the dedicated placeholder.
  if (isInitialized && isMobile) {
    return (
      <MobileUnsupported
        width={width}
        name={name}
        headline={headline}
      />
    );
  }

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

      {/* Choice Page Phase — Redesigned ChoiceScreen */}
      <AnimatePresence>
        {!showBoot && (
          <motion.div
            key="choice"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          >
            <ChoiceStageFrame>
              <ChoiceScreen stage showCanvas={false} name={name} headline={headline} />
            </ChoiceStageFrame>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

