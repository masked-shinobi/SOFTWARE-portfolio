"use client";

import React, { useEffect } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import type Lenis from "lenis";
import type { LenisOptions } from "lenis";
import "lenis/dist/lenis.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollProgressBar } from "./ScrollProgressBar";

gsap.registerPlugin(ScrollTrigger);



/**
 * Syncs Lenis smooth scroll with GSAP ScrollTrigger.
 *
 * Two problems this solves:
 * 1. ScrollTrigger doesn't know Lenis updated the scroll position
 *    → fix: lenis.on('scroll', ScrollTrigger.update)
 * 2. When ScrollTrigger pins a section (adding a spacer that makes the
 *    document taller), Lenis doesn't know the document grew — it caps
 *    scroll at the stale height and the timeline never progresses
 *    → fix: ScrollTrigger.addEventListener('refresh', () => lenis.resize())
 */
function LenisGSAPSync() {
  // useLenis() returns the Lenis instance from ReactLenis context
  const lenis: Lenis | undefined = useLenis();

  useEffect(() => {
    if (!lenis) return;
    (window as any).lenis = lenis;

    // 1. Forward every Lenis scroll frame → ScrollTrigger
    const onScroll = () => {
      ScrollTrigger.update();
    };
    lenis.on("scroll", onScroll);

    // 2. When ScrollTrigger refreshes (pins add spacers → document height
    //    changes), tell Lenis to recalculate the scrollable limit
    const onRefresh = () => {
      lenis.resize();
    };
    ScrollTrigger.addEventListener("refresh", onRefresh);

    // Initial sync: wait one frame for ScrollTrigger pins/spacers to
    // be in the DOM, then let both sides catch up
    requestAnimationFrame(() => {
      lenis.resize();
      ScrollTrigger.refresh();
    });

    return () => {
      lenis.off("scroll", onScroll);
      ScrollTrigger.removeEventListener("refresh", onRefresh);
    };
  }, [lenis]);

  return null;
}

export interface DeveloperSmoothScrollProps {
  children: React.ReactNode;
  options?: LenisOptions;
}

export function DeveloperSmoothScroll({
  children,
  options = {
    lerp: 0.1,
    duration: 1.2,
    smoothWheel: true,
  },
}: DeveloperSmoothScrollProps) {
  return (
    <ReactLenis root options={options}>
      <LenisGSAPSync />
      <ScrollProgressBar />
      {children}
    </ReactLenis>
  );
}

export { useLenis };
export default DeveloperSmoothScroll;
