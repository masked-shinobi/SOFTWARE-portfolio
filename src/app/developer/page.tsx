"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ChoiceBackgroundCanvas } from "@/components/choice-screen/choice-background-canvas";
import { DeveloperBentoHero, RolesSection } from "@/components/developer";

function DeveloperPageContent() {
  const searchParams = useSearchParams();
  const fromChoice = searchParams.get("from") === "choice";
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      sessionStorage.setItem("portfolio_boot_completed", "true");
    } catch {}

    const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");
    setTheme(mediaQuery.matches ? "light" : "dark");

    const handler = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? "light" : "dark");
    };
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return (
    <main className="w-full min-h-screen">
      {/* 
        Section 1 (1st Pager Section):
        - Blueprint cursor-revealed background canvas (behind)
        - 2x2 Bento Grid with generous top margin space and equal left/right centering
      */}
      <section
        className={`relative w-full min-h-screen flex flex-col items-center select-none ${
          theme === "light" ? "bg-white text-slate-900" : "bg-black text-slate-100"
        }`}
      >
        <ChoiceBackgroundCanvas theme={theme} />
        <DeveloperBentoHero initialFromChoice={fromChoice} theme={theme} />
      </section>

      {/* 
        Section 2 — Roles Pinned Scroll-Reveal:
        Pins to viewport and reveals Frontend → Backend → ML engineer roles via scroll
      */}
      <RolesSection theme={theme} />
    </main>
  );
}

export default function DeveloperPage() {
  return (
    <Suspense fallback={<div className="w-full min-h-screen bg-black" />}>
      <DeveloperPageContent />
    </Suspense>
  );
}

