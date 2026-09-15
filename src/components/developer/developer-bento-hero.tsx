"use client";

import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ChoiceScreen } from "@/components/choice-screen";
import { RotateCcw } from "lucide-react";

const REF_W = 1440;
const REF_H = 1024;

interface DeveloperBentoHeroProps {
  theme?: "dark" | "light";
  initialFromChoice?: boolean;
}

function getFitScale() {
  if (typeof window === "undefined") return 1;
  return Math.min(window.innerWidth / REF_W, window.innerHeight / REF_H);
}

export function DeveloperBentoHero({
  theme = "dark",
  initialFromChoice = false,
}: DeveloperBentoHeroProps) {
  const isLight = theme === "light";

  const slotRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const journeyRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const projectRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const hasAnimatedRef = useRef(false);

  const [shouldAnimate, setShouldAnimate] = useState(initialFromChoice);
  const [dockedScale, setDockedScale] = useState(0.5);

  const cardBorder = isLight
    ? "border-[2px] border-[#6b7280] bg-white/90 shadow-xl"
    : "border-[2px] border-[#52525b] bg-black/85 shadow-2xl";

  const techStackSrc = isLight
    ? "/developer-experience/tech_stack_light.png"
    : "/developer-experience/tech_stack_dark.png";

  const computeDockedScale = useCallback(() => {
    if (!slotRef.current) return 0.5;
    const r = slotRef.current.getBoundingClientRect();
    const s = Math.min(r.width / REF_W, r.height / REF_H);
    setDockedScale(s);
    return s;
  }, []);

  const runMorph = useCallback(() => {
    const slot = slotRef.current;
    const overlay = overlayRef.current;
    const inner = innerRef.current;
    if (!slot || !overlay || !inner) return;
    if (hasAnimatedRef.current) return;

    const slotRect = slot.getBoundingClientRect();
    if (slotRect.width < 8 || slotRect.height < 8) return;

    hasAnimatedRef.current = true;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });

    const targetScale = Math.min(slotRect.width / REF_W, slotRect.height / REF_H);
    setDockedScale(targetScale);

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const startScale = Math.min(vw / REF_W, vh / REF_H);

    // Ensure overlay starts pinned at full-screen viewport
    gsap.set(overlay, {
      top: 0,
      left: 0,
      width: vw,
      height: vh,
      borderRadius: 0,
      borderWidth: 0,
      borderColor: "transparent",
      backgroundColor: isLight ? "rgba(255, 255, 255, 1)" : "rgba(0, 0, 0, 1)",
      boxShadow: "none",
      opacity: 1,
      visibility: "visible",
    });

    gsap.set(inner, {
      scale: startScale,
      transformOrigin: "center center",
    });

    const siblings = [journeyRef.current, stackRef.current, projectRef.current].filter(
      Boolean,
    );
    gsap.set(siblings, { opacity: 0, y: 32, scale: 0.97 });

    if (tlRef.current) tlRef.current.kill();

    const tl = gsap.timeline({
      defaults: { ease: "power3.inOut" },
      onComplete: () => {
        setShouldAnimate(false);
        sessionStorage.removeItem("fromChoiceScreen");
        const url = new URL(window.location.href);
        if (url.searchParams.has("from")) {
          url.searchParams.delete("from");
          window.history.replaceState({}, "", url.pathname + url.search);
        }
      },
    });
    tlRef.current = tl;

    // 1. Smoothly animate overlay dimensions, position, and card chrome
    tl.to(
      overlay,
      {
        top: slotRect.top,
        left: slotRect.left,
        width: slotRect.width,
        height: slotRect.height,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: isLight ? "#6b7280" : "#52525b",
        backgroundColor: isLight ? "rgba(255, 255, 255, 0.9)" : "rgba(0, 0, 0, 0.85)",
        boxShadow: isLight
          ? "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
          : "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        duration: 1.1,
      },
      0,
    );

    // 2. Uniformly compress the Choice Screen contents to match docked slot
    tl.to(
      inner,
      {
        scale: targetScale,
        duration: 1.1,
      },
      0,
    );

    // 3. Ultra-smooth handover: fade out overlay at the very tail (last 0.08s)
    // so the pre-rendered docked card underneath takes over with zero glitch
    tl.to(
      overlay,
      {
        opacity: 0,
        duration: 0.08,
        ease: "power1.in",
      },
      1.02,
    );

    // 4. Stagger siblings in gracefully as card docks
    tl.to(
      siblings,
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.55,
        stagger: 0.08,
        ease: "power2.out",
      },
      0.65,
    );
  }, [isLight]);

  useLayoutEffect(() => {
    computeDockedScale();
    window.addEventListener("resize", computeDockedScale);

    if (!shouldAnimate) {
      return () => {
        window.removeEventListener("resize", computeDockedScale);
        if (tlRef.current) tlRef.current.kill();
      };
    }

    hasAnimatedRef.current = false;

    let cancelled = false;
    let attempts = 0;
    const tryStart = () => {
      if (cancelled) return;
      const slot = slotRef.current;
      const ready = slot && slot.getBoundingClientRect().width > 8;
      if (ready) {
        runMorph();
        return;
      }
      attempts += 1;
      if (attempts < 20) requestAnimationFrame(tryStart);
    };
    const raf = requestAnimationFrame(tryStart);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", computeDockedScale);
      if (tlRef.current) tlRef.current.kill();
      hasAnimatedRef.current = false;
    };
  }, [shouldAnimate, computeDockedScale, runMorph]);

  const handleReplay = useCallback(() => {
    hasAnimatedRef.current = false;
    computeDockedScale();
    setShouldAnimate(true);
  }, [computeDockedScale]);

  return (
    <>
      {/* Morph Overlay Layer — Only rendered during the transition */}
      {shouldAnimate && (
        <div
          ref={overlayRef}
          className="pointer-events-none fixed z-[9999] overflow-hidden flex items-center justify-center will-change-[top,left,width,height,border-radius,opacity]"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            borderRadius: 0,
            borderWidth: 0,
            borderStyle: "solid",
            borderColor: "transparent",
            backgroundColor: isLight ? "#ffffff" : "#000000",
            boxShadow: "none",
          }}
        >
          <div
            ref={innerRef}
            suppressHydrationWarning
            style={{
              width: REF_W,
              height: REF_H,
              transform: `scale(${getFitScale()})`,
              transformOrigin: "center center",
              flexShrink: 0,
              willChange: "transform",
            }}
          >
            <ChoiceScreen
              stage
              developerNavEnabled={false}
              showCanvas={false}
              theme={theme}
              className="!w-[1440px] !h-[1024px]"
            />
          </div>
        </div>
      )}

      {/* Main Bento Grid Container */}
      <div
        className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10"
        style={{ paddingTop: 64, paddingBottom: 64 }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 w-full items-start">
          {/* Left Column (7 Columns) */}
          <div className="w-full lg:col-span-7 flex flex-col gap-6 lg:gap-8">
            {/* Bento Card 1: Docked Choice Portal */}
            <div
              ref={slotRef}
              id="bento-card-choice"
              className={`w-full h-[520px] rounded-[30px] relative overflow-hidden backdrop-blur-xl flex items-center justify-center ${cardBorder}`}
            >
              <div
                style={{
                  width: REF_W,
                  height: REF_H,
                  transform: `scale(${dockedScale})`,
                  transformOrigin: "center center",
                  flexShrink: 0,
                }}
              >
                <ChoiceScreen
                  stage
                  developerNavEnabled={false}
                  showCanvas={false}
                  theme={theme}
                  className="!w-[1440px] !h-[1024px]"
                />
              </div>
            </div>

            {/* Bento Card 3: Technical Stack */}
            <div
              ref={stackRef}
              id="bento-card-stack"
              className={`w-full h-[350px] rounded-[30px] relative overflow-hidden backdrop-blur-xl ${cardBorder}`}
              style={shouldAnimate ? { opacity: 0 } : undefined}
            >
              <Image
                src={techStackSrc}
                alt="Technical Stack — Resume, Frontend, Backend"
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover object-left-top"
                priority
              />
            </div>
          </div>

          {/* Right Column (5 Columns) */}
          <div className="w-full lg:col-span-5 flex flex-col gap-6 lg:gap-8">
            {/* Bento Card 2: My Journey */}
            <div
              ref={journeyRef}
              id="bento-card-journey"
              className={`w-full h-[430px] rounded-[30px] relative overflow-hidden backdrop-blur-xl group ${cardBorder}`}
              style={shouldAnimate ? { opacity: 0 } : undefined}
            >
              <Image
                src="/developer-experience/journey.png"
                alt="My Journey Artwork"
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/25 pointer-events-none" />
              <h2 className="absolute top-6 left-6 z-10 font-iceland text-3xl sm:text-4xl font-bold tracking-widest text-white drop-shadow-md select-none">
                MY JOURNEY
              </h2>
            </div>

            {/* Bento Card 4: Projects Showcase */}
            <div
              ref={projectRef}
              id="bento-card-project"
              className={`w-full h-[440px] rounded-[30px] relative overflow-hidden backdrop-blur-xl ${cardBorder}`}
              style={shouldAnimate ? { opacity: 0 } : undefined}
            >
              <Image
                src="/developer-experience/projects.png"
                alt="Projects Showcase — Apple Website 3D & Contact"
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover object-center"
                priority
              />
            </div>
          </div>
        </div>

        {/* Replay Button for interactive inspection */}
        {!shouldAnimate && (
          <button
            type="button"
            onClick={handleReplay}
            className="fixed bottom-6 right-6 z-40 px-3.5 py-2 rounded-full border border-sky-500/40 bg-black/80 hover:bg-sky-950/80 text-sky-400 hover:text-sky-300 text-xs font-mono backdrop-blur-md shadow-2xl flex items-center gap-2 transition-all duration-200 active:scale-95 cursor-pointer"
            title="Replay Choice-to-Grid GSAP Morph Animation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Replay Morph</span>
          </button>
        )}
      </div>
    </>
  );
}
