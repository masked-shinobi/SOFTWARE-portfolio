"use client";

import React, { useRef, useState } from "react";
import { useLenis } from "lenis/react";

export function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);

  useLenis((lenis) => {
    setProgress(lenis.progress);
  });

  return (
    <div
      className="fixed top-0 left-0 w-full z-[9999] pointer-events-none"
      style={{ height: "3px" }}
    >
      <div
        className="h-full origin-left will-change-transform"
        style={{
          transform: `scaleX(${progress})`,
          backgroundColor: "var(--progress-accent, #ff4d6d)",
        }}
      />
    </div>
  );
}

export default ScrollProgressBar;
