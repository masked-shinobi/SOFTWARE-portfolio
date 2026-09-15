"use client";

import { useEffect, useState, type ReactNode } from "react";
import { ChoiceBackgroundCanvas } from "./choice-background-canvas";

export const CHOICE_STAGE_W = 1440;
export const CHOICE_STAGE_H = 1024;

export function fitScaleForViewport(
  vw = typeof window === "undefined" ? CHOICE_STAGE_W : window.innerWidth,
  vh = typeof window === "undefined" ? CHOICE_STAGE_H : window.innerHeight,
) {
  return Math.min(vw / CHOICE_STAGE_W, vh / CHOICE_STAGE_H);
}

export function coverScaleForViewport(
  vw = typeof window === "undefined" ? CHOICE_STAGE_W : window.innerWidth,
  vh = typeof window === "undefined" ? CHOICE_STAGE_H : window.innerHeight,
) {
  return fitScaleForViewport(vw, vh);
}

interface ChoiceStageFrameProps {
  children: ReactNode;
  className?: string;
  theme?: "dark" | "light";
}

/** Full-viewport wrapper that uniformly scales the 1440×1024 choice artboard without cutoff,
 *  while extending the interactive Three.js blueprint background across the full viewport to fill sidebars. */
export function ChoiceStageFrame({
  children,
  className = "",
  theme: propTheme,
}: ChoiceStageFrameProps) {
  const [scale, setScale] = useState(1);
  const [detectedTheme, setDetectedTheme] = useState<"dark" | "light">("dark");
  const activeTheme = propTheme || detectedTheme;

  useEffect(() => {
    if (typeof window === "undefined" || propTheme) return;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");
    setDetectedTheme(mediaQuery.matches ? "light" : "dark");

    const handler = (e: MediaQueryListEvent) => {
      setDetectedTheme(e.matches ? "light" : "dark");
    };
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [propTheme]);

  useEffect(() => {
    const update = () => setScale(fitScaleForViewport());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const overlaySrc =
    activeTheme === "light"
      ? "/dev-hero-section/assets/light_overlay.png"
      : "/dev-hero-section/assets/dark_overlay.png";

  return (
    <div
      className={`relative h-screen w-screen overflow-hidden flex items-center justify-center ${
        activeTheme === "light" ? "bg-white text-black" : "bg-black text-white"
      } ${className}`}
    >
      {/* Full-viewport Three.js Blueprint Canvas that tiles across the screen (including sidebars) */}
      <ChoiceBackgroundCanvas
        theme={activeTheme}
        radius={300}
        falloff={0.55}
        className="z-0 pointer-events-auto"
      />

      {/* Atmospheric bottom vignette extending across the full viewport */}
      <div
        className="absolute bottom-0 left-0 right-0 z-[5] pointer-events-none select-none overflow-hidden h-[35vh] min-h-[180px] max-h-[340px]"
        aria-hidden="true"
      >
        <img
          src={overlaySrc}
          alt=""
          className="w-full h-full object-fill object-bottom"
          draggable={false}
        />
      </div>

      {/* Center Stage: Uniformly fit-scaled 1440x1024 artboard (kept exact for morph transition) */}
      <div
        suppressHydrationWarning
        className="relative z-10 pointer-events-none"
        style={{
          width: CHOICE_STAGE_W,
          height: CHOICE_STAGE_H,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          flexShrink: 0,
        }}
      >
        <div className="w-full h-full pointer-events-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
