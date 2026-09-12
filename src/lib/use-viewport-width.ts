"use client";

import { useState, useEffect } from "react";

// =============================================================================
// Viewport Width & Form Factor Hook
// =============================================================================
// Returns the current window width and a boolean flag indicating if the viewport
// is within mobile form factor (< 768px). SSR-safe with zero hydration mismatch.
// =============================================================================

export const MOBILE_BREAKPOINT = 768;

export function useViewportWidth() {
  const [dimensions, setDimensions] = useState<{
    width: number;
    isMobile: boolean;
    isInitialized: boolean;
  }>({
    width: 0,
    isMobile: false,
    isInitialized: false,
  });

  useEffect(() => {
    function handleResize() {
      const currentWidth = window.innerWidth;
      setDimensions({
        width: currentWidth,
        isMobile: currentWidth < MOBILE_BREAKPOINT,
        isInitialized: true,
      });
    }

    // Initialize on mount
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return dimensions;
}
