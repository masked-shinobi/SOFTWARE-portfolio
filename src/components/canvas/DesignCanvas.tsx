"use client";

/**
 * DesignCanvas — Native HTML5 Canvas Component
 *
 * Fullscreen infinite canvas with:
 *  - Dotted matrix background
 *  - Mouse-drag panning
 *  - Cursor-centered wheel/trackpad zoom (0.25x – 2.5x)
 *  - Window resize handling with DPR support
 *  - requestAnimationFrame rendering loop
 *
 * High-frequency interaction state (pan, zoom) is stored in a ref
 * to avoid React re-renders on every pointer movement.
 *
 * Technology: Native <canvas> + Canvas 2D API. No Konva, Fabric, or PixiJS.
 */

import { useRef, useEffect, useCallback, useState } from "react";
import {
  type ViewportState,
  type CanvasSize,
  type CursorState,
  createViewport,
  zoomAtPoint,
  renderFrame,
  initHeroImages,
} from "./engine";
import ThemeToggle from "./ui/ThemeToggle";
import FloatingMenu from "./ui/FloatingMenu";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function DesignCanvas() {
  // UI state for floating controls
  const [isDarkUI, setIsDarkUI] = useState<boolean>(true);

  // Refs — no React state for high-frequency values
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const viewportRef = useRef<ViewportState>(createViewport());
  const sizeRef = useRef<CanvasSize>({ width: 0, height: 0, dpr: 1 });
  const rafIdRef = useRef<number>(0);
  const isDirtyRef = useRef<boolean>(true);
  const hasCenteredRef = useRef<boolean>(false);

  // Theme & cursor interaction state
  const isDarkRef = useRef<boolean>(true);
  const cursorRef = useRef<CursorState | null>(null);

  // Panning state
  const isPanningRef = useRef<boolean>(false);
  const panStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const panOriginRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // -------------------------------------------------------------------------
  // Canvas sizing
  // -------------------------------------------------------------------------

  const updateCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Set the canvas buffer size (physical pixels)
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    // Set the CSS display size (logical pixels)
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // Center world origin (0, 0) in the viewport on first mount
    if (!hasCenteredRef.current) {
      viewportRef.current = {
        x: width / 2,
        y: height / 2,
        zoom: 1,
      };
      hasCenteredRef.current = true;
    }

    sizeRef.current = { width, height, dpr };
    isDirtyRef.current = true;
  }, []);

  // -------------------------------------------------------------------------
  // Rendering loop
  // -------------------------------------------------------------------------

  const tick = useCallback(() => {
    const ctx = ctxRef.current;
    if (!ctx) return;

    // Only redraw when something changed
    if (isDirtyRef.current) {
      renderFrame(
        ctx,
        viewportRef.current,
        sizeRef.current,
        cursorRef.current,
        isDarkRef.current,
      );
      isDirtyRef.current = false;
    }

    rafIdRef.current = requestAnimationFrame(tick);
  }, []);

  /** Mark canvas as needing a redraw. */
  const markDirty = useCallback(() => {
    isDirtyRef.current = true;
  }, []);

  // -------------------------------------------------------------------------
  // Event handlers
  // -------------------------------------------------------------------------

  // --- Wheel / trackpad zoom ---
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();

      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const screenX = e.clientX - rect.left;
      const screenY = e.clientY - rect.top;

      // Update cursor position during zoom
      cursorRef.current = { x: screenX, y: screenY };

      viewportRef.current = zoomAtPoint(
        viewportRef.current,
        screenX,
        screenY,
        e.deltaY,
      );

      markDirty();
    },
    [markDirty],
  );

  // --- Pointer interaction (Pan & Cursor tracking) ---
  const handlePointerDown = useCallback(
    (e: PointerEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        cursorRef.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        };
      }

      // Left click or middle click initiates pan
      if (e.button !== 0 && e.button !== 1) return;

      isPanningRef.current = true;
      panStartRef.current = { x: e.clientX, y: e.clientY };
      panOriginRef.current = {
        x: viewportRef.current.x,
        y: viewportRef.current.y,
      };

      // Capture pointer for reliable dragging outside window
      (e.target as HTMLElement).setPointerCapture(e.pointerId);

      // Change cursor to grabbing
      if (canvasRef.current) {
        canvasRef.current.style.cursor = "grabbing";
      }

      markDirty();
    },
    [markDirty],
  );

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
          cursorRef.current = { x, y };
        } else if (!isPanningRef.current) {
          cursorRef.current = null;
        }
      }

      if (isPanningRef.current) {
        const dx = e.clientX - panStartRef.current.x;
        const dy = e.clientY - panStartRef.current.y;

        viewportRef.current = {
          ...viewportRef.current,
          x: panOriginRef.current.x + dx,
          y: panOriginRef.current.y + dy,
        };
      }

      markDirty();
    },
    [markDirty],
  );

  const handlePointerUp = useCallback(
    (e: PointerEvent) => {
      if (isPanningRef.current) {
        isPanningRef.current = false;
        try {
          (e.target as HTMLElement).releasePointerCapture(e.pointerId);
        } catch {
          // Ignore if pointer capture was already released
        }

        // Restore cursor
        if (canvasRef.current) {
          canvasRef.current.style.cursor = "grab";
        }
      }

      markDirty();
    },
    [markDirty],
  );

  const handlePointerLeave = useCallback(() => {
    // Clear cursor so glow fades away when leaving window
    if (!isPanningRef.current) {
      cursorRef.current = null;
      markDirty();
    }
  }, [markDirty]);

  // --- Smooth recenter to world origin (0, 0) ---
  const handleRecenter = useCallback(() => {
    const startX = viewportRef.current.x;
    const startY = viewportRef.current.y;
    const startZoom = viewportRef.current.zoom;

    const destX = window.innerWidth / 2;
    const destY = window.innerHeight / 2;
    const destZoom = 1.0;

    const startTime = performance.now();
    const duration = 380; // ms

    const animateRecenter = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Smooth cubic-out easing curve
      const ease = 1 - Math.pow(1 - progress, 3);

      viewportRef.current = {
        x: startX + (destX - startX) * ease,
        y: startY + (destY - startY) * ease,
        zoom: startZoom + (destZoom - startZoom) * ease,
      };
      markDirty();

      if (progress < 1) {
        requestAnimationFrame(animateRecenter);
      }
    };

    requestAnimationFrame(animateRecenter);
  }, [markDirty]);

  // --- Theme Toggle handler ---
  const handleToggleTheme = useCallback(() => {
    const nextDark = !isDarkRef.current;
    isDarkRef.current = nextDark;
    setIsDarkUI(nextDark);
    markDirty();
  }, [markDirty]);

  // --- Window resize ---
  const handleResize = useCallback(() => {
    updateCanvasSize();
  }, [updateCanvasSize]);

  // -------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Get 2D context
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctxRef.current = ctx;

    // System dark / light mode media query
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    isDarkRef.current = mediaQuery.matches;
    setIsDarkUI(mediaQuery.matches);

    const handleThemeChange = (evt: MediaQueryListEvent) => {
      isDarkRef.current = evt.matches;
      setIsDarkUI(evt.matches);
      markDirty();
    };

    try {
      mediaQuery.addEventListener("change", handleThemeChange);
    } catch {
      mediaQuery.addListener(handleThemeChange);
    }

    // Preload hero artwork
    initHeroImages(markDirty);

    // Redraw when custom fonts (e.g. Outfit) finish loading
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(() => {
        markDirty();
      });
    }

    // Initial sizing
    updateCanvasSize();

    // Start render loop
    rafIdRef.current = requestAnimationFrame(tick);

    // Attach event listeners
    canvas.addEventListener("wheel", handleWheel, { passive: false });
    canvas.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    document.addEventListener("mouseleave", handlePointerLeave);
    window.addEventListener("resize", handleResize);

    // Set initial cursor
    canvas.style.cursor = "grab";

    // Cleanup
    return () => {
      cancelAnimationFrame(rafIdRef.current);
      try {
        mediaQuery.removeEventListener("change", handleThemeChange);
      } catch {
        mediaQuery.removeListener(handleThemeChange);
      }
      canvas.removeEventListener("wheel", handleWheel);
      canvas.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      document.removeEventListener("mouseleave", handlePointerLeave);
      window.removeEventListener("resize", handleResize);
    };
  }, [
    tick,
    handleWheel,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerLeave,
    handleResize,
    updateCanvasSize,
    markDirty,
  ]);

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden" }}>
      <canvas
        ref={canvasRef}
        id="design-canvas"
        style={{
          display: "block",
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          touchAction: "none", // Prevent browser gesture interference
        }}
      />

      {/* Bottom-left Location / Recenter Button */}
      <button
        id="recenter-btn"
        title="Recenter View"
        aria-label="Recenter canvas view"
        onClick={handleRecenter}
        style={{
          position: "fixed",
          bottom: "24px",
          left: "24px",
          width: "44px",
          height: "44px",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          zIndex: 30,
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          backgroundColor: isDarkUI
            ? "rgba(18, 24, 38, 0.75)"
            : "rgba(255, 255, 255, 0.9)",
          border: isDarkUI
            ? "1px solid rgba(255, 255, 255, 0.12)"
            : "1px solid rgba(0, 0, 0, 0.12)",
          color: isDarkUI ? "#e2e8f0" : "#334155",
          boxShadow: isDarkUI
            ? "0 4px 14px rgba(0, 0, 0, 0.4)"
            : "0 4px 14px rgba(0, 0, 0, 0.08)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.06)";
          e.currentTarget.style.backgroundColor = isDarkUI
            ? "rgba(30, 38, 56, 0.9)"
            : "rgba(241, 245, 249, 1)";
          e.currentTarget.style.color = isDarkUI ? "#ffffff" : "#0f172a";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.backgroundColor = isDarkUI
            ? "rgba(18, 24, 38, 0.75)"
            : "rgba(255, 255, 255, 0.9)";
          e.currentTarget.style.color = isDarkUI ? "#e2e8f0" : "#334155";
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.transform = "scale(0.95)";
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = "scale(1.06)";
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M3 12h3m12 0h3M12 3v3m0 12v3"></path>
        </svg>
      </button>

      {/* Top-Right Theme Toggle (Day / Night Switch) */}
      <div
        style={{
          position: "fixed",
          top: "24px",
          right: "32px",
          zIndex: 30,
          display: "flex",
          alignItems: "center",
        }}
      >
        <ThemeToggle isDark={isDarkUI} onToggle={handleToggleTheme} />
      </div>

      {/* Left-Centered Floating Navigation Menu */}
      <FloatingMenu isDark={isDarkUI} />
    </div>
  );
}
