import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "cyan";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variantStyles = {
    default: "border-transparent bg-slate-100 text-slate-900 shadow hover:bg-slate-200",
    secondary: "border-transparent bg-slate-800 text-slate-100 hover:bg-slate-700",
    destructive: "border-transparent bg-red-900/80 text-red-200 shadow hover:bg-red-800",
    outline: "text-slate-300 border-white/15",
    cyan: "border-cyan-500/30 bg-cyan-950/30 text-cyan-400 hover:bg-cyan-950/50 shadow-sm",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
