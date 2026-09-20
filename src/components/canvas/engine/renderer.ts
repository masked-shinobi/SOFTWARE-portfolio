/**
 * Canvas Renderer
 *
 * Handles all drawing operations on the native Canvas 2D context.
 * Each "layer" is a function that receives the context and viewport state.
 *
 * Rendering pipeline:
 *   1. Clear canvas
 *   2. Draw background
 *   3. Draw dotted grid
 *   (future: 4. Design objects → 5. Connectors → 6. Selection → 7. Overlays)
 */

import {
  type ViewportState,
  type CanvasSize,
  type CursorState,
  type ThemeConfig,
  THEME_DARK,
  THEME_LIGHT,
  GRID_SPACING,
  DOT_RADIUS,
  PROXIMITY_RADIUS,
} from "./viewport";
import { drawHero } from "./hero";

// ---------------------------------------------------------------------------
// Background layer
// ---------------------------------------------------------------------------

function drawBackground(
  ctx: CanvasRenderingContext2D,
  size: CanvasSize,
  theme: ThemeConfig,
): void {
  ctx.fillStyle = theme.background;
  ctx.fillRect(0, 0, size.width, size.height);
}

// ---------------------------------------------------------------------------
// Dotted grid layer
// ---------------------------------------------------------------------------

/**
 * Renders the dotted matrix background with cursor proximity illumination.
 *
 * Strategy:
 *   1. Compute visible viewport bounds in world coordinates.
 *   2. Batch render all visible dots with base theme opacity.
 *   3. If cursor is present on canvas, calculate nearby dots within PROXIMITY_RADIUS.
 *   4. Illuminate proximate dots smoothly based on distance to cursor:
 *      - Dark mode: dots glow vivid white
 *      - Light mode: dots turn crisp black
 *      - Dots expand slightly near the cursor center for a tactile spotlight feel.
 */
function drawDottedGrid(
  ctx: CanvasRenderingContext2D,
  vp: ViewportState,
  size: CanvasSize,
  theme: ThemeConfig,
  cursor: CursorState | null,
): void {
  const spacing = GRID_SPACING;
  const zoom = vp.zoom;

  // Screen-space grid spacing
  const screenSpacing = spacing * zoom;

  // If dots would be too dense (< 4px apart on screen), skip every other line
  let step = spacing;
  let effectiveScreenSpacing = screenSpacing;
  while (effectiveScreenSpacing < 4) {
    step *= 2;
    effectiveScreenSpacing = step * zoom;
  }

  // World-space bounding box of the visible viewport
  const worldLeft = -vp.x / zoom;
  const worldTop = -vp.y / zoom;
  const worldRight = (size.width - vp.x) / zoom;
  const worldBottom = (size.height - vp.y) / zoom;

  // Snap to grid start
  const startX = Math.floor(worldLeft / step) * step;
  const startY = Math.floor(worldTop / step) * step;
  const endX = Math.ceil(worldRight / step) * step;
  const endY = Math.ceil(worldBottom / step) * step;

  // Adaptive base dot size: scaled for clear visibility & thickness
  const baseDotSize = DOT_RADIUS * 2; // 2.8px diameter at 1x
  const dotSize = Math.max(1.4, Math.min(4.5, baseDotSize * Math.sqrt(zoom)));

  // Adaptive base opacity: gentle fade below 0.5x zoom
  let baseOpacity = theme.dotBaseAlpha;
  if (zoom < 0.5) {
    baseOpacity = theme.dotBaseAlpha * (zoom / 0.5);
  }

  // -------------------------------------------------------------------------
  // Pass 1: Batch-render all visible ambient dots
  // -------------------------------------------------------------------------
  ctx.fillStyle = `rgba(${theme.dotBaseRgb}, ${baseOpacity})`;

  const useCircles = zoom >= 0.5;
  if (useCircles) {
    ctx.beginPath();
  }

  for (let wx = startX; wx <= endX; wx += step) {
    for (let wy = startY; wy <= endY; wy += step) {
      const sx = wx * zoom + vp.x;
      const sy = wy * zoom + vp.y;

      if (sx < -dotSize || sx > size.width + dotSize) continue;
      if (sy < -dotSize || sy > size.height + dotSize) continue;

      if (useCircles) {
        ctx.moveTo(sx + dotSize * 0.5, sy);
        ctx.arc(sx, sy, dotSize * 0.5, 0, Math.PI * 2);
      } else {
        ctx.fillRect(
          sx - dotSize * 0.5,
          sy - dotSize * 0.5,
          dotSize,
          dotSize,
        );
      }
    }
  }

  if (useCircles) {
    ctx.fill();
  }

  // -------------------------------------------------------------------------
  // Pass 2: Cursor proximity spotlight illumination
  // -------------------------------------------------------------------------
  if (cursor != null && typeof cursor.x === "number") {
    const radius = PROXIMITY_RADIUS;
    const radiusSq = radius * radius;

    // Proximity bounding box in world space
    const proxWorldLeft = (cursor.x - radius - vp.x) / zoom;
    const proxWorldTop = (cursor.y - radius - vp.y) / zoom;
    const proxWorldRight = (cursor.x + radius - vp.x) / zoom;
    const proxWorldBottom = (cursor.y + radius - vp.y) / zoom;

    const proxStartX = Math.floor(proxWorldLeft / step) * step;
    const proxStartY = Math.floor(proxWorldTop / step) * step;
    const proxEndX = Math.ceil(proxWorldRight / step) * step;
    const proxEndY = Math.ceil(proxWorldBottom / step) * step;

    for (let wx = proxStartX; wx <= proxEndX; wx += step) {
      for (let wy = proxStartY; wy <= proxEndY; wy += step) {
        const sx = wx * zoom + vp.x;
        const sy = wy * zoom + vp.y;

        const dx = sx - cursor.x;
        const dy = sy - cursor.y;
        const distSq = dx * dx + dy * dy;

        if (distSq < radiusSq) {
          const dist = Math.sqrt(distSq);
          // Smooth falloff curve
          const t = Math.pow(1 - dist / radius, 1.4);

          // Smoothly transitions from ambient base dot to dark/white highlight
          const highlightAlpha = Math.min(1.0, t * theme.dotHighlightAlpha);
          const highlightSize = dotSize + t * 2.2;

          ctx.fillStyle = `rgba(${theme.dotHighlightRgb}, ${highlightAlpha})`;
          ctx.beginPath();
          ctx.arc(sx, sy, highlightSize * 0.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Main render function
// ---------------------------------------------------------------------------

/**
 * Full render pass. Called by requestAnimationFrame.
 *
 * Automatically adapts to system dark/light mode and highlights dots
 * around the user cursor position.
 */
export function renderFrame(
  ctx: CanvasRenderingContext2D,
  vp: ViewportState,
  size: CanvasSize,
  cursor: CursorState | null = null,
  isDark: boolean = true,
): void {
  // Reset transform and apply DPR scaling
  ctx.setTransform(size.dpr, 0, 0, size.dpr, 0, 0);

  const theme = isDark ? THEME_DARK : THEME_LIGHT;

  // Layer 1: Background
  drawBackground(ctx, size, theme);

  // Layer 2: Dotted grid with cursor proximity illumination
  drawDottedGrid(ctx, vp, size, theme, cursor);

  // Layer 3: Hero Section (character sticker, title, subtitle)
  drawHero(ctx, vp, isDark);

  // Future layers:
  // Layer 4: Design cards / tiles
  // Layer 5: Connectors
  // Layer 6: Selection
  // Layer 7: Interaction overlays
}
