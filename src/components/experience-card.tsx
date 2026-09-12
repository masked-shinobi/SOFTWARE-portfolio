"use client";

import Link from "next/link";
import { motion } from "motion/react";

// =============================================================================
// Experience Card — Glassmorphism card for the entry page
// =============================================================================
// Renders a single experience option (Developer, Creative, or Story).
// Supports a "Coming Soon" variant for experiences not yet built.
// Uses next/link for client-side navigation.
// =============================================================================

interface ExperienceCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  variant: "developer" | "creative" | "story";
  comingSoon?: boolean;
  index: number;
}

export function ExperienceCard({
  title,
  description,
  href,
  icon,
  variant,
  comingSoon = false,
  index,
}: ExperienceCardProps) {
  const cardContent = (
    <>
      {comingSoon && <span className="experience-card__badge">Coming Soon</span>}
      <div className="experience-card__icon">{icon}</div>
      <h2 className="experience-card__title">{title}</h2>
      <p className="experience-card__description">{description}</p>
      {!comingSoon && <span className="experience-card__arrow">→</span>}
    </>
  );

  const className = [
    "experience-card",
    `experience-card--${variant}`,
    comingSoon ? "experience-card--coming-soon" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: 0.15 * index,
        ease: [0.4, 0, 0.2, 1],
      }}
    >
      {comingSoon ? (
        <Link href={href} className={className} id={`card-${variant}`}>
          {cardContent}
        </Link>
      ) : (
        <Link href={href} className={className} id={`card-${variant}`}>
          {cardContent}
        </Link>
      )}
    </motion.div>
  );
}
