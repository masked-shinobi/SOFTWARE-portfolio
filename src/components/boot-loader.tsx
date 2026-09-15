"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "motion/react";

// =============================================================================
// Boot Loader — Website Loading Screen
// =============================================================================
// - Active ONLY while the website is loading assets / resources.
// - Loops the stripped loader video centered in screen with dark/light theme background.
// - Only downloads the single video matching the user's browser theme preference.
// - Automatically dismisses as soon as the document and assets are fully loaded.
// - Uses a minimal display floor (~1.2s) to prevent jarring 1-frame flashes on fast cache.
// =============================================================================

interface BootLoaderProps {
  onComplete: () => void;
  name?: string;
  headline?: string;
  minDisplayTimeMs?: number;
}

export function BootLoader({
  onComplete,
  minDisplayTimeMs = 1200,
}: BootLoaderProps) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasCompletedRef = useRef(false);

  const handleFinish = useCallback(() => {
    if (!hasCompletedRef.current) {
      hasCompletedRef.current = true;
      if (typeof window !== "undefined") {
        try {
          sessionStorage.setItem("portfolio_boot_completed", "true");
        } catch {
          // Ignore storage errors
        }
      }
      onComplete();
    }
  }, [onComplete]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Detect browser dark / light mode preference
    const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");
    setTheme(mediaQuery.matches ? "light" : "dark");

    const handleThemeChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? "light" : "dark");
    };
    mediaQuery.addEventListener("change", handleThemeChange);

    // 2. Track website loading completion
    const startTime = Date.now();

    const finishWhenReady = () => {
      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(0, minDisplayTimeMs - elapsed);

      setTimeout(() => {
        handleFinish();
      }, remainingTime);
    };

    // If document is already complete, check font loading or finish
    if (document.readyState === "complete") {
      if (document.fonts?.ready) {
        document.fonts.ready.then(finishWhenReady).catch(finishWhenReady);
      } else {
        finishWhenReady();
      }
    } else {
      // Wait for all assets / window to finish loading
      const handleLoad = () => {
        finishWhenReady();
      };
      window.addEventListener("load", handleLoad, { once: true });
    }

    // Safety fallback: never hold the user for more than 4 seconds even on slow networks
    const maxHoldTimer = setTimeout(() => {
      handleFinish();
    }, 4000);

    // Keyboard shortcut to skip instantly
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === " " || e.key === "Enter") {
        handleFinish();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      mediaQuery.removeEventListener("change", handleThemeChange);
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(maxHoldTimer);
    };
  }, [handleFinish, minDisplayTimeMs]);

  const videoSrc =
    theme === "light"
      ? "/port-loader/light-loader-stripped.mp4"
      : "/port-loader/dark-loader-stripped.mp4";

  return (
    <motion.div
      className="boot-loader"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="boot-loader__video-wrapper">
        <video
          ref={videoRef}
          key={videoSrc}
          className="boot-loader__video"
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          aria-label="Website loading indicator"
        />
      </div>

      {/* Skip button in bottom-right corner */}
      <motion.button
        className="boot-loader__skip"
        onClick={handleFinish}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        aria-label="Skip loader animation"
      >
        Skip →
      </motion.button>
    </motion.div>
  );
}
