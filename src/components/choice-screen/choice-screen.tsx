"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ChoiceBackgroundCanvas } from "./choice-background-canvas";

// =============================================================================
// ChoiceScreen — Modular Component for the Redesigned Choice Gateway
// =============================================================================
// Step 1: Three.js Interactive Cursor-Revealed Blueprint Background (Done)
// Step 2: Character Portrait & Atmospheric Cover Layer (Active)
// - Uses relative measures (vh, vw, %, object-contain) for seamless responsive scaling.
// - Layer 1: Three.js background canvas with spotlight reveal (z-0)
// - Layer 2: Sanjay's cutout portrait (my_image.png) anchored to bottom-left (z-10)
// - Layer 3: Atmospheric cover overlay (dark_overlay / light_overlay) at bottom (z-20)
// =============================================================================

interface ChoiceScreenProps {
  name?: string;
  headline?: string;
  theme?: "dark" | "light";
  className?: string;
  embedded?: boolean;
  /** Layout relative to a 1440×1024 parent so GSAP uniform scale is lossless. */
  stage?: boolean;
  /** When false, Developer is already the current experience (no re-route). */
  developerNavEnabled?: boolean;
  /** Whether to render the Three.js blueprint background canvas. Default true. */
  showCanvas?: boolean;
}

export function ChoiceScreen({
  name = "Sanjay Baskar",
  headline = "CSE ASPIRANT",
  theme: propTheme,
  className = "",
  embedded = false,
  stage = false,
  developerNavEnabled = true,
  showCanvas = true,
}: ChoiceScreenProps) {
  const [detectedTheme, setDetectedTheme] = useState<"dark" | "light">("dark");
  const [isPortraitHovered, setIsPortraitHovered] = useState(false);
  const activeTheme = propTheme || detectedTheme;

  // Auto-detect system preference if not explicitly specified
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

  const overlaySrc =
    activeTheme === "light"
      ? "/dev-hero-section/assets/light_overlay.png"
      : "/dev-hero-section/assets/dark_overlay.png";

  const artboard = stage || embedded;

  return (
    <div
      className={`relative w-full overflow-hidden select-none ${
        artboard ? "h-full" : "h-screen"
      } ${
        !showCanvas
          ? activeTheme === "light"
            ? "bg-transparent text-black"
            : "bg-transparent text-white"
          : activeTheme === "light"
            ? "bg-white text-black"
            : "bg-black text-white"
      } ${className}`}
    >
      {/* Layer 1: Three.js Cursor-Revealed Blueprint Background Canvas (z-0) */}
      {showCanvas && (
        <ChoiceBackgroundCanvas
          theme={activeTheme}
          radius={embedded ? 200 : 280}
          falloff={0.6}
          className="z-0"
        />
      )}

      {/* Layer 2: Character Cutout Portrait (z-10) */}
      <div
        className={`absolute bottom-0 left-0 z-10 pointer-events-auto cursor-pointer select-none flex items-end ${
          stage
            ? "h-[93%] max-w-[55%]"
            : embedded
              ? "h-[96%] max-w-[50%]"
              : "h-[93vh] max-w-[52vw]"
        }`}
        onMouseEnter={() => setIsPortraitHovered(true)}
        onMouseLeave={() => setIsPortraitHovered(false)}
        onClick={() => setIsPortraitHovered((prev) => !prev)}
        aria-label="Sanjay Baskar Portrait"
      >
        <img
          src="/dev-hero-section/assets/my_image.png"
          alt="Sanjay Baskar"
          className={`w-auto object-contain object-bottom transition-all duration-300 will-change-transform drop-shadow-[0_10px_35px_rgba(0,0,0,0.5)] ${
            stage
              ? "h-full max-h-full"
              : embedded
                ? "h-full"
                : "h-[93vh] min-h-[520px] max-h-[96vh]"
          }`}
          draggable={false}
        />
      </div>

      {/* Layer 3: Atmospheric Cover Overlay Layer (z-20) */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-20 pointer-events-none select-none overflow-hidden ${
          stage
            ? "h-[42%]"
            : embedded
              ? "h-[38%]"
              : "h-[42vh] min-h-[220px] max-h-[380px]"
        }`}
        aria-hidden="true"
      >
        <img
          src={overlaySrc}
          alt=""
          className="w-full h-full object-fill object-bottom"
          draggable={false}
        />
      </div>

      {/* Layer 4: Identity & Typography Block (z-30) */}
      <div
        className={`absolute z-30 pointer-events-none flex flex-col items-start justify-end ${
          stage
            ? "bottom-[4%] left-[43%] right-[4%]"
            : embedded
              ? "bottom-[3.5%] left-[45%] right-[2%]"
              : "bottom-[4vh] left-[43vw] right-[4vw]"
        }`}
      >
        <div className="flex flex-col items-start w-full">
          <h1
            className={`font-iceland tracking-wide font-normal leading-none select-none ${
              stage
                ? "text-[5.2rem]"
                : embedded
                  ? "text-3xl sm:text-4xl lg:text-[2.6rem]"
                  : "text-5xl sm:text-6xl md:text-7xl lg:text-[5.2rem]"
            } ${
              activeTheme === "light"
                ? "text-neutral-900 drop-shadow-[0_2px_10px_rgba(0,0,0,0.08)]"
                : "text-white drop-shadow-[0_4px_15px_rgba(0,0,0,0.8)]"
            }`}
          >
            {name || "Sanjay Baskar"}
          </h1>
          <p
            className={`font-iceland uppercase font-normal select-none ${
              stage
                ? "text-[1.75rem] tracking-[0.24em] mt-3"
                : embedded
                  ? "text-xs sm:text-sm tracking-[0.2em] mt-1.5"
                  : "text-lg sm:text-xl md:text-2xl lg:text-[1.75rem] tracking-[0.24em] mt-2 md:mt-3"
            } ${activeTheme === "light" ? "text-neutral-600" : "text-neutral-400"}`}
          >
            {headline || "CSE ASPIRANT"}
          </p>
          <div
            className={`w-full flex justify-center ${
              stage
                ? "mt-7 max-w-[440px]"
                : embedded
                  ? "mt-3 max-w-[280px]"
                  : "mt-5 md:mt-7 max-w-[440px]"
            }`}
          >
            <span
              className={`font-iceland uppercase rounded-full border select-none inline-flex items-center justify-center shadow-sm ${
                stage
                  ? "text-sm tracking-[0.3em] px-20 py-4 min-h-[44px]"
                  : embedded
                    ? "text-[10px] tracking-[0.25em] px-8 py-1.5 min-h-[28px]"
                    : "text-xs sm:text-sm tracking-[0.3em] px-14 sm:px-18 md:px-20 py-3 sm:py-3.5 md:py-4 min-h-[38px] sm:min-h-[44px]"
              } ${
                activeTheme === "light"
                  ? "border-neutral-400/60 text-neutral-600 bg-white/40"
                  : "border-neutral-800 text-neutral-400 bg-neutral-950/40"
              }`}
            >
              CHOICE PAGE
            </span>
          </div>
        </div>
      </div>

      {/* Layer 5: Dual Choice Rounds (Developer & Creative) (z-40) */}
      <div
        className={`absolute z-40 pointer-events-auto flex items-center justify-start ${
          stage
            ? "top-[34%] left-[44%] right-[2%] gap-12 lg:gap-16"
            : embedded
              ? "top-[20%] left-[45%] right-[2%] gap-5 sm:gap-7"
              : "top-[34vh] left-[44vw] right-[2vw] gap-8 sm:gap-12 md:gap-16"
        }`}
      >
        {/* Developer Choice */}
        <Link
          href={developerNavEnabled ? "/developer?from=choice" : "#"}
          prefetch={developerNavEnabled ? "auto" : false}
          onClick={(event) => {
            if (!developerNavEnabled) {
              event.preventDefault();
              return;
            }
            if (typeof window !== "undefined") {
              sessionStorage.setItem("fromChoiceScreen", "true");
            }
          }}
          className="flex flex-col items-center group cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-2xl"
        >
          <motion.div
            whileHover={{ scale: 1.06, y: -3 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className={`flex flex-col items-center ${
              stage ? "gap-10" : embedded ? "gap-3 sm:gap-4" : "gap-7 sm:gap-9 md:gap-10"
            }`}
          >
            <div
              className={`relative aspect-square rounded-full transition-all duration-300 drop-shadow-[0_4px_25px_rgba(0,0,0,0.5)] group-hover:drop-shadow-[0_0_35px_rgba(56,189,248,0.7)] ${
                stage
                  ? "w-[158px] h-[158px]"
                  : embedded
                    ? "w-16 h-16 sm:w-20 sm:h-20"
                    : "w-[11vw] min-w-[120px] max-w-[160px]"
              }`}
            >
              <img
                src="/dev-hero-section/assets/dev_choice_icon.png"
                alt="Developer Experience"
                className="w-full h-full object-contain select-none pointer-events-none"
                draggable={false}
              />
            </div>
            <div
              className={`flex items-center justify-center rounded-2xl border backdrop-blur-md shadow-lg transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(56,189,248,0.3)] ${
                stage
                  ? "px-20 py-6 min-h-[60px] min-w-[250px]"
                  : embedded
                    ? "px-5 sm:px-7 py-2 min-h-[34px] min-w-[110px] sm:min-w-[130px]"
                    : "px-12 sm:px-16 md:px-20 py-4 sm:py-5 md:py-6 min-h-[54px] sm:min-h-[60px] min-w-[210px] sm:min-w-[250px]"
              } ${
                activeTheme === "light"
                  ? "bg-neutral-600/80 border-white/20 text-white group-hover:bg-neutral-700/90 group-hover:border-cyan-400/60"
                  : "bg-neutral-800/80 border-white/15 text-white group-hover:bg-neutral-700/90 group-hover:border-cyan-400/50"
              }`}
            >
              <span
                className={`font-iceland tracking-[0.24em] uppercase font-bold select-none leading-none ${
                  stage ? "text-lg" : embedded ? "text-xs sm:text-sm" : "text-sm sm:text-base md:text-lg"
                }`}
              >
                DEVELOPER
              </span>
            </div>
          </motion.div>
        </Link>

        {/* Creative Choice */}
        <Link
          href="/creative"
          className="flex flex-col items-center group cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded-2xl"
        >
          <motion.div
            whileHover={{ scale: 1.06, y: -3 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className={`flex flex-col items-center ${
              stage ? "gap-10" : embedded ? "gap-3 sm:gap-4" : "gap-7 sm:gap-9 md:gap-10"
            }`}
          >
            <div
              className={`relative aspect-square rounded-full transition-all duration-300 drop-shadow-[0_4px_25px_rgba(0,0,0,0.5)] group-hover:drop-shadow-[0_0_35px_rgba(192,132,252,0.7)] ${
                stage
                  ? "w-[158px] h-[158px]"
                  : embedded
                    ? "w-16 h-16 sm:w-20 sm:h-20"
                    : "w-[11vw] min-w-[120px] max-w-[160px]"
              }`}
            >
              <img
                src="/dev-hero-section/assets/creative_choice_icon.png"
                alt="Creative Experience"
                className="w-full h-full object-contain select-none pointer-events-none"
                draggable={false}
              />
            </div>
            <div
              className={`flex items-center justify-center rounded-2xl border backdrop-blur-md shadow-lg transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(192,132,252,0.3)] ${
                stage
                  ? "px-20 py-6 min-h-[60px] min-w-[250px]"
                  : embedded
                    ? "px-5 sm:px-7 py-2 min-h-[34px] min-w-[110px] sm:min-w-[130px]"
                    : "px-12 sm:px-16 md:px-20 py-4 sm:py-5 md:py-6 min-h-[54px] sm:min-h-[60px] min-w-[210px] sm:min-w-[250px]"
              } ${
                activeTheme === "light"
                  ? "bg-neutral-600/80 border-white/20 text-white group-hover:bg-neutral-700/90 group-hover:border-purple-400/60"
                  : "bg-neutral-800/80 border-white/15 text-white group-hover:bg-neutral-700/90 group-hover:border-purple-400/50"
              }`}
            >
              <span
                className={`font-iceland tracking-[0.24em] uppercase font-bold select-none leading-none ${
                  stage ? "text-lg" : embedded ? "text-xs sm:text-sm" : "text-sm sm:text-base md:text-lg"
                }`}
              >
                CREATIVE
              </span>
            </div>
          </motion.div>
        </Link>
      </div>

      {/* Layer 6: Interactive Hover Cloud Message (z-50) */}
      <AnimatePresence>
        {isPortraitHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 350, damping: 24 }}
            className={`absolute z-50 pointer-events-auto select-none ${
              stage
                ? "top-[13%] left-[39%]"
                : embedded
                  ? "top-[7%] left-[34%] max-w-[260px]"
                  : "top-[13vh] left-[39vw]"
            }`}
            onMouseEnter={() => setIsPortraitHovered(true)}
            onMouseLeave={() => setIsPortraitHovered(false)}
          >
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
            >
              <img
                src="/dev-hero-section/assets/cloud_message.png"
                alt="CHOOSE TO EXPLORE THE WORK !!!"
                className={`w-auto object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.6)] ${
                  stage
                    ? "h-[76px]"
                    : embedded
                      ? "h-[36px] max-h-[40px]"
                      : "h-[7.5vh] min-h-[46px] max-h-[82px]"
                }`}
                draggable={false}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
