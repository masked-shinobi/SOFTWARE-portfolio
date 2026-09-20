/**
 * Canvas Viewport Engine
 *
 * Core viewport state and transform math for the infinite canvas.
 * All coordinates follow: World → Transform(pan, zoom) → Screen
 *
 * This is a plain object/functions module — no React dependency.
 * Designed to be stored in a React ref for zero-rerender updates.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ViewportState {
  /** Pan offset X (in screen pixels) */
  x: number;
  /** Pan offset Y (in screen pixels) */
  y: number;
  /** Zoom / scale factor */
  zoom: number;
}

export interface CanvasSize {
  /** Logical CSS width */
  width: number;
  /** Logical CSS height */
  height: number;
  /** Device pixel ratio */
  dpr: number;
}

export interface CursorState {
  /** Cursor X in logical screen coordinates */
  x: number;
  /** Cursor Y in logical screen coordinates */
  y: number;
}

export interface ThemeConfig {
  background: string;
  /** Ambient stable dot color (RGB) */
  dotBaseRgb: string;
  /** Ambient stable dot opacity */
  dotBaseAlpha: number;
  /** Proximity spotlight color (RGB) */
  dotHighlightRgb: string;
  /** Maximum proximity highlight opacity */
  dotHighlightAlpha: number;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const ZOOM_MIN = 0.25;
export const ZOOM_MAX = 2.5;
export const ZOOM_SENSITIVITY = 0.001;

/** Default grid spacing in world units */
export const GRID_SPACING = 32;

/** Dot radius in screen pixels (constant regardless of zoom) */
export const DOT_RADIUS = 1.4;

/** Proximity radius in screen pixels around the cursor */
export const PROXIMITY_RADIUS = 140;

/** Theme palettes */
export const THEME_DARK: ThemeConfig = {
  background: "#0b0f19",
  dotBaseRgb: "255, 255, 255",
  dotBaseAlpha: 0.22,
  dotHighlightRgb: "255, 255, 255",
  dotHighlightAlpha: 1.0,
};

export const THEME_LIGHT: ThemeConfig = {
  background: "#ffffff",
  // Clearly visible neutral grey with strong definition for stable dots
  dotBaseRgb: "71, 85, 105", // slate-600
  dotBaseAlpha: 0.55,
  // Pitch black for proximity spotlight dots
  dotHighlightRgb: "0, 0, 0",
  dotHighlightAlpha: 1.0,
};

/** Default colors (backward compatibility) */
export const DOT_COLOR = "rgba(255, 255, 255, 0.15)";
export const BG_COLOR = "#0b0f19";

// ---------------------------------------------------------------------------
// Viewport helpers
// ---------------------------------------------------------------------------

/**
 * Creates a default viewport state centered at origin with 1x zoom.
 */
export function createViewport(): ViewportState {
  return { x: 0, y: 0, zoom: 1 };
}

/**
 * Clamp zoom to allowed range.
 */
export function clampZoom(z: number): number {
  return Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, z));
}

/**
 * Compute a new viewport after a zoom event centered on a screen-space point.
 *
 * The world point under (screenX, screenY) should remain under the cursor
 * after the zoom change.
 *
 *   worldX = (screenX - vp.x) / vp.zoom
 *   After zoom:  newX = screenX - worldX * newZoom
 */
export function zoomAtPoint(
  vp: ViewportState,
  screenX: number,
  screenY: number,
  delta: number,
): ViewportState {
  const factor = 1 - delta * ZOOM_SENSITIVITY;
  const newZoom = clampZoom(vp.zoom * factor);

  // World point under cursor before zoom
  const wx = (screenX - vp.x) / vp.zoom;
  const wy = (screenY - vp.y) / vp.zoom;

  return {
    x: screenX - wx * newZoom,
    y: screenY - wy * newZoom,
    zoom: newZoom,
  };
}

/**
 * Convert screen coordinates to world coordinates.
 */
export function screenToWorld(
  vp: ViewportState,
  sx: number,
  sy: number,
): { x: number; y: number } {
  return {
    x: (sx - vp.x) / vp.zoom,
    y: (sy - vp.y) / vp.zoom,
  };
}

/**
 * Convert world coordinates to screen coordinates.
 */
export function worldToScreen(
  vp: ViewportState,
  wx: number,
  wy: number,
): { x: number; y: number } {
  return {
    x: wx * vp.zoom + vp.x,
    y: wy * vp.zoom + vp.y,
  };
}
