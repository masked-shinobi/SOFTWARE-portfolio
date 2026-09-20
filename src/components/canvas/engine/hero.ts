/**
 * Canvas Hero Section Renderer
 *
 * Renders the central hero sticker and typography on the infinite canvas.
 * - Sticker: Theme-aware character artwork (Hero-image.png / Hero-image-dark.png)
 * - Title: "Non-Linear Creative." using the Outfit geometric sans font
 * - Subtitle: "DESIGN ENGINEER • AI & WEB & CLOUD ENGINEERING"
 *
 * All coordinates are in world space (origin 0,0) and scale seamlessly with viewport pan/zoom.
 */

import type { ViewportState } from "./viewport";

let heroImageLight: HTMLImageElement | null = null;
let heroImageDark: HTMLImageElement | null = null;
let isLoadedLight = false;
let isLoadedDark = false;

/**
 * Preloads hero images and notifies when ready to render.
 */
export function initHeroImages(onLoad: () => void): void {
  if (typeof window === "undefined") return;

  if (!heroImageLight) {
    heroImageLight = new Image();
    heroImageLight.src = "/creative%20experience/images/Hero-image.png";
    heroImageLight.onload = () => {
      isLoadedLight = true;
      onLoad();
    };
  }

  if (!heroImageDark) {
    heroImageDark = new Image();
    heroImageDark.src = "/creative%20experience/images/Hero-image-dark.png";
    heroImageDark.onload = () => {
      isLoadedDark = true;
      onLoad();
    };
  }
}

/**
 * Draws spaced text with full canvas compatibility.
 */
function fillSpacedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  spacing: number,
): void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anyCtx = ctx as any;
  if (typeof anyCtx.letterSpacing === "string") {
    anyCtx.letterSpacing = `${spacing}px`;
    ctx.fillText(text, x, y);
    anyCtx.letterSpacing = "0px";
  } else {
    let totalWidth = 0;
    for (let i = 0; i < text.length; i++) {
      totalWidth +=
        ctx.measureText(text[i]).width + (i < text.length - 1 ? spacing : 0);
    }
    const prevAlign = ctx.textAlign;
    ctx.textAlign = "left";
    let curX = x - totalWidth / 2;
    for (let i = 0; i < text.length; i++) {
      ctx.fillText(text[i], curX, y);
      curX += ctx.measureText(text[i]).width + spacing;
    }
    ctx.textAlign = prevAlign;
  }
}

/**
 * Renders the hero sticker, title, and subtitle centered at world origin (0, 0).
 */
export function drawHero(
  ctx: CanvasRenderingContext2D,
  vp: ViewportState,
  isDark: boolean,
): void {
  const zoom = vp.zoom;

  // Origin (0, 0) transformed to screen coordinates
  const originX = vp.x;
  const originY = vp.y;


  // -------------------------------------------------------------------------
  // 1. Hero Composition Measurements & Vertical Centering
  // -------------------------------------------------------------------------
  // Native image aspect ratio: 1468 x 2048
  const stickerWidth = 195 * zoom;
  const stickerHeight = (195 * (2048 / 1468)) * zoom; // ~272px at 1x
  const gapStickerToTitle = 20 * zoom;
  const titleFontSize = Math.round(46 * zoom);
  const gapTitleToSubtitle = 16 * zoom;
  const subtitleFontSize = Math.max(8, Math.round(12 * zoom));
  const letterSpacing = 3.5 * zoom;

  // Total height of the hero block:
  // Sticker (272) + gap (20) + Title (~42) + gap (16) + Subtitle (~12) = ~362px
  const totalHeroHeight =
    stickerHeight +
    gapStickerToTitle +
    titleFontSize * 0.9 +
    gapTitleToSubtitle +
    subtitleFontSize;

  // Start top Y so the optical center of the whole group is at originY (0, 0)
  const groupTopY = originY - totalHeroHeight * 0.5;

  // -------------------------------------------------------------------------
  // 2. Hero Sticker Image
  // -------------------------------------------------------------------------
  const img = isDark
    ? isLoadedDark
      ? heroImageDark
      : heroImageLight
    : isLoadedLight
      ? heroImageLight
      : heroImageDark;
  const isLoaded = isDark
    ? isLoadedDark || isLoadedLight
    : isLoadedLight || isLoadedDark;

  const stickerX = originX - stickerWidth / 2;
  const stickerY = groupTopY;

  if (img && isLoaded) {
    ctx.drawImage(img, stickerX, stickerY, stickerWidth, stickerHeight);
  }

  // -------------------------------------------------------------------------
  // 3. Title: "Non-Linear Creative."
  // -------------------------------------------------------------------------
  const titleY =
    stickerY + stickerHeight + gapStickerToTitle + titleFontSize * 0.45;

  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `600 ${titleFontSize}px Outfit, -apple-system, BlinkMacSystemFont, sans-serif`;
  ctx.fillStyle = isDark ? "#ffffff" : "#0f172a";
  ctx.fillText("Non-Linear Creative.", originX, titleY);

  // -------------------------------------------------------------------------
  // 4. Subtitle: "DESIGN ENGINEER • AI & WEB & CLOUD ENGINEERING"
  // -------------------------------------------------------------------------
  const subtitleY =
    titleY + titleFontSize * 0.45 + gapTitleToSubtitle + subtitleFontSize * 0.5;

  ctx.font = `600 ${subtitleFontSize}px Outfit, -apple-system, BlinkMacSystemFont, sans-serif`;
  ctx.fillStyle = isDark ? "#94a3b8" : "#64748b";

  fillSpacedText(
    ctx,
    "DESIGN ENGINEER \u2022 AI & WEB & CLOUD ENGINEERING",
    originX,
    subtitleY,
    letterSpacing,
  );

  ctx.restore();
}
