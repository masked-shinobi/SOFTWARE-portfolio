import { DeveloperSmoothScroll } from "@/components/developer";

export default function DeveloperLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DeveloperSmoothScroll>
      <div className="developer-experience style-terminal-core relative min-h-screen bg-[var(--dev-bg)] text-[var(--dev-text-bright)]">
        {children}
      </div>
    </DeveloperSmoothScroll>
  );
}


