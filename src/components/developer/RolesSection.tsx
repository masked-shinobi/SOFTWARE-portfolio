"use client";

import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import rolesData from "@/data/roles.json";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const roles = rolesData.roles;

export function RolesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Detect prefers-reduced-motion on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useGSAP(
    () => {
      // Skip all GSAP animation if reduced motion is preferred
      if (reducedMotion) return;
      if (!sectionRef.current) return;

      const slideEls = gsap.utils.toArray<HTMLElement>(
        ".roles-slide",
        sectionRef.current
      );

      if (slideEls.length < 2) return;

      // Build a timeline that transitions between slides
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          pinSpacing: true,
          scrub: true,
          start: "top top",
          end: "+=300%",
          anticipatePin: 1,
        },
      });

      // First slide is visible by default.
      // For each subsequent slide, fade out the previous and fade in the next.
      for (let i = 1; i < slideEls.length; i++) {
        const prev = slideEls[i - 1];
        const curr = slideEls[i];

        // Hold on current slide for a beat before transitioning
        tl.to({}, { duration: 0.5 });

        // Fade out previous role text + description
        tl.to(
          prev.querySelector(".role-text"),
          {
            opacity: 0,
            y: -25,
            duration: 0.5,
            ease: "power2.inOut",
          },
          ">"
        );
        tl.to(
          prev.querySelector(".role-desc"),
          {
            opacity: 0,
            y: -20,
            duration: 0.4,
            ease: "power2.inOut",
          },
          "<+=0.05"
        );

        // Fade in next role text + description
        tl.fromTo(
          curr.querySelector(".role-text"),
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
          },
          "<+=0.15"
        );
        tl.fromTo(
          curr.querySelector(".role-desc"),
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "power2.out",
          },
          "<+=0.1"
        );

        // Hold on the new slide so user sees it
        tl.to({}, { duration: 0.5 });
      }
    },
    {
      scope: sectionRef,
      dependencies: [reducedMotion],
      revertOnUpdate: true,
    }
  );

  // If reduced motion: show last slide only
  const visibleRoles = reducedMotion ? [roles[roles.length - 1]] : roles;

  return (
    <section
      ref={sectionRef}
      className="relative w-screen h-screen overflow-hidden bg-white"
      style={{ willChange: "transform" }}
    >
      {/* ─── Top-right black bar accent ─── */}
      <div
        className="absolute top-0 right-0 bg-black"
        style={{
          width: "65%",
          height: "7vh",
        }}
      />

      {/* ─── Bottom-left black bar accent ─── */}
      <div
        className="absolute bottom-0 left-0 bg-black"
        style={{
          width: "55%",
          height: "7vh",
        }}
      />

      {/* ─── Content area ─── */}
      <div className="absolute inset-0 flex items-center">
        <div className="relative w-full" style={{ paddingLeft: "12%" }}>
          {/* "I am" prefix — stays fixed in place, never animates */}
          <div className="flex items-baseline gap-6 md:gap-10">
            <span
              className="text-black select-none whitespace-nowrap"
              style={{
                fontFamily: "var(--font-fredericka)",
                fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
                fontWeight: 400,
                lineHeight: 1.1,
              }}
            >
              I am
            </span>

            {/* Role name + description container (stacked absolutely) */}
            <div className="relative" style={{ minHeight: "8rem" }}>
              {visibleRoles.map((role, i) => {
                // First slide (or the only slide in reduced-motion) is visible
                const isFirst = i === 0;

                return (
                  <div
                    key={role.id}
                    className={`roles-slide ${
                      isFirst ? "" : "absolute top-0 left-0"
                    }`}
                    style={
                      !isFirst && !reducedMotion
                        ? { position: "absolute", top: 0, left: 0 }
                        : {}
                    }
                  >
                    {/* Role name */}
                    <div
                      className="role-text text-black"
                      style={{
                        fontFamily: "var(--font-fredericka)",
                        fontSize: "clamp(3rem, 6.5vw, 6rem)",
                        fontWeight: 400,
                        lineHeight: 1.1,
                        opacity: isFirst ? 1 : 0,
                      }}
                    >
                      {role.role}
                    </div>

                    {/* Description */}
                    <div
                      className="role-desc mt-2 md:mt-3"
                      style={{
                        fontFamily:
                          "var(--font-sans), ui-sans-serif, system-ui, sans-serif",
                        fontSize: "clamp(0.85rem, 1.2vw, 1.1rem)",
                        color: "#6b7280",
                        letterSpacing: "0.04em",
                        lineHeight: 1.5,
                        opacity: isFirst ? 1 : 0,
                      }}
                    >
                      {role.description}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default RolesSection;
