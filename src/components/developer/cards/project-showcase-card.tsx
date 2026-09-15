"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const EMAIL = "sanjaybaskar.in@gmail.com";
const PROJECT_URL = "https://www.apple.com";
const TECH_TAGS = ["GSAP", "NEXT JS", "TS", "TAILWIND CSS", "MOTION", "THREE JS"] as const;

interface ProjectShowcaseCardProps {
  theme?: "dark" | "light";
}

export function ProjectShowcaseCard({ theme = "dark" }: ProjectShowcaseCardProps) {
  const isLight = theme === "light";
  const [copied, setCopied] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      const input = document.createElement("textarea");
      input.value = EMAIL;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
    }
    setCopied(true);
    setToastVisible(true);
    window.setTimeout(() => setCopied(false), 1800);
    window.setTimeout(() => setToastVisible(false), 2200);
  }, []);

  return (
    <div
      id="bento-card-project"
      className={`relative w-full h-[440px] rounded-[30px] overflow-hidden backdrop-blur-xl flex flex-col p-4 gap-3 ${isLight
        ? "border-[2px] border-[#6b7280] bg-zinc-950 text-white shadow-xl"
        : "border-[2px] border-[#52525b] bg-black/90 text-white shadow-2xl"
        }`}
    >
      <div className="flex-1 min-h-0 grid grid-cols-[1.15fr_0.85fr] gap-3">
        <div className="relative rounded-2xl overflow-hidden bg-black">
          <Image
            src="/developer-experience/apple_iphone_mockup.png"
            alt="Apple Website 3D — iPhone 15 Pro Titanium"
            fill
            sizes="(max-width: 1024px) 100vw, 24vw"
            className="object-cover object-center"
            priority
          />
        </div>

        <div className="flex flex-col justify-between py-1 pr-1">
          <div>
            <h3 className="font-iceland text-[1.65rem] leading-none tracking-[0.12em] uppercase">
              Apple Website 3D
            </h3>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {TECH_TAGS.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="rounded-full border-white/25 bg-transparent px-2 py-0.5 text-[10px] font-iceland tracking-[0.14em] text-neutral-200"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <Link
            href={PROJECT_URL}
            target="_blank"
            rel="noreferrer"
            className="self-end inline-flex items-center justify-center rounded-full border border-white/25 bg-white/5 px-5 py-2 text-xs font-iceland tracking-[0.18em] uppercase hover:bg-white/10 hover:border-white/40 transition-colors"
          >
            Visit Project
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-[1.25fr_0.75fr] gap-3 items-stretch">
        <div className="rounded-2xl bg-gradient-to-br from-violet-800 via-purple-800 to-fuchsia-900 px-4 py-3 flex flex-col justify-center gap-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]">
          <p className="font-iceland text-base sm:text-lg leading-tight text-center">
            Do you want to start a project together?
          </p>
          <button
            type="button"
            onClick={handleCopy}
            className="mx-auto inline-flex items-center gap-2 rounded-full bg-black/35 border border-white/15 px-3.5 py-1.5 text-[11px] font-iceland tracking-wide hover:bg-black/50 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Email copied" : "Copy my email address"}
          </button>
        </div>

        <Link
          href="/developer/resume"
          className="rounded-2xl bg-neutral-800/90 border border-white/10 flex items-center justify-center gap-2 font-iceland text-lg tracking-[0.08em] hover:bg-neutral-700 transition-colors"
        >
          Explore
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {toastVisible && (
        <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-3 z-20 rounded-full bg-emerald-500/90 text-black text-[11px] font-mono px-3 py-1 shadow-lg">
          Copied {EMAIL}
        </div>
      )}
    </div>
  );
}
