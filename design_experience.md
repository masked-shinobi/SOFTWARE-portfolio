# Design Experience — Architecture & Progress

## Canvas-Based Infinite Portfolio with Live Admin Editing

---

## 1. Executive Summary & Vision

The objective is to craft an **infinite, interactive 2D canvas portfolio** inspired by modern spatial design tools like **Figma, Miro, and Milanote**.

Rather than scrolling down a traditional vertical webpage, visitors navigate an expansive, ambient workspace—panning, zooming, and clicking into floating project cards.

For the portfolio owner, the canvas acts as a **live WYSIWYG studio**: logging into Admin mode unlocks real-time drag-and-drop repositioning, multi-handle resizing via bounding transformers, snapping to an ambient dotted grid, and persisting layout coordinates directly into Supabase.

---

## 2. Technology Decision

### ⚠️ CRITICAL: Native HTML5 Canvas ONLY

The canvas engine is built entirely from scratch using:

- **Native `<canvas>` element**
- **Canvas 2D API (`CanvasRenderingContext2D`)**
- **React/Next.js client components** (`"use client"`)
- **Native browser events** (mouse, pointer, wheel, resize)
- **`requestAnimationFrame`** for rendering loops

### ❌ STRICTLY PROHIBITED

The following libraries are **explicitly excluded** from this project:

- **Konva** / **react-konva**
- **Fabric.js**
- **PixiJS**
- **Any other canvas abstraction/rendering library**

**Rationale**: Full control over rendering pipeline, performance optimization, and elimination of third-party abstractions. The canvas engine is purpose-built for this specific use case.

---

## 3. System Architecture & Tech Stack

```
                     +-------------------------------------------------------+
                     |                 Next.js Client (App Router)            |
                     |                                                       |
                     |  +---------------------+    +----------------------+  |
                     |  |  Canvas Viewport    |    |  Floating HUD Chrome |  |
                     |  |  - Pan & Zoom Engine|    |  - Zoom Pill & Radar |  |
                     |  |  - Dotted Matrix BG |    |  - Public/Admin Mode |  |
                     |  |  - Native Canvas 2D |    |  - Batch Save / Undo |  |
                     |  +----------+----------+    +----------+-----------+  |
                     +-------------|--------------------------|--------------+
                                   |                          |
                     +-------------v--------------------------v--------------+
                     |               Admin & State Layer                     |
                     |  - Selection & Transformer Control                    |
                     |  - Staged Changes State (Dirty Tracker)               |
                     |  - Supabase Auth Gate                                 |
                     +---------------------------+---------------------------+
                                                 |
                                     (REST / Realtime WS)
                                                 |
                     +---------------------------v---------------------------+
                     |                    Supabase Backend                   |
                     |  - Database: `portfolio_tiles` (PostgreSQL)           |
                     |  - Auth: Gated Admin User                             |
                     |  - Storage: Project Imagery CDN                       |
                     |  - Realtime: WebSocket Broadcasts                     |
                     +-------------------------------------------------------+
```

### Core Technologies

- **Rendering Engine**: Native HTML5 Canvas 2D API — custom-built rendering pipeline with `requestAnimationFrame`, viewport transform management, and layer-based rendering.
- **Frontend Framework**: `Next.js 16` (App Router) + `React 19` (Client-side components with `"use client"` directive).
- **Styling & UI Chrome**: `Tailwind CSS v4` + `Lucide React` (for floating HUD controls, glassmorphic status pills, and detail drawers).
- **Backend & Database**: `Supabase` (PostgreSQL table for project records, Row Level Security, and Realtime sync).
- **Authentication**: `Supabase Auth` (Secure session checking to restrict editing permissions to the portfolio admin).
- **Asset Storage**: `Supabase Storage` bucket for project covers, assets, and media.

---

## 4. Canvas Engine Architecture

### Rendering Pipeline

```
World coordinates
       ↓
Viewport Transform (panX, panY, zoom)
       ↓
Screen coordinates
       ↓
Canvas 2D rendering (ctx.fillRect, ctx.arc, etc.)
```

### Layer Rendering Order

```
Background (solid color)
       ↓
Grid (dotted matrix)
       ↓
Design objects (tiles, cards)
       ↓
Connectors (lines between objects)
       ↓
Selection (bounding boxes, handles)
       ↓
Interaction overlays (cursors, guides)
```

### State Architecture

High-frequency interaction values are stored outside React state to avoid unnecessary re-renders:

```
viewportRef (React ref)
├── x      (pan offset X)
├── y      (pan offset Y)
└── zoom   (scale factor)
```

The rendering loop reads from the ref directly. React state is only used for UI that genuinely needs React re-renders (HUD controls, modals, etc.).

---

## 5. Canvas Visual Design & HUD Elements

### A. Dotted Grid Background System

1. **Dynamic Dot Matrix**:
   - Rendered using native Canvas 2D API (`ctx.arc()` or `ctx.fillRect()`)
   - Grid spacing: Default 32px between dots
   - Dot appearance: Subtle `rgba(255, 255, 255, 0.15)` dots on a deep dark canvas (`#0b0f19`)
   - Only visible-viewport dots are rendered (no pre-rendered giant canvas)
   - Dots are mathematically derived from the viewport transform

2. **Zoom-Adaptive Opacity**:
   - As the user zooms out beyond 0.5x, dot opacity scales down gracefully

3. **World Coordinate Indicator**:
   - Displays current viewport center coordinate in a minimalist readout

### B. Floating Overlay UI (HUD Chrome)

The HUD floats above the canvas (`z-index: 20`):

1. **Navigation Pill**: Zoom controls, reset, fit view
2. **Minimap / Radar View**: Compact preview with viewport frustum
3. **Mode & Authentication Pill**: Public/Admin mode toggle
4. **Tile Inspection Drawer**: Detail view on tile click

---

## 6. Data Model & Database Schema

Each card/tile rendered on the canvas corresponds to a persistent record in PostgreSQL:

```sql
create table public.portfolio_tiles (
  id text primary key default gen_random_uuid()::text,
  title text not null,
  blurb text,
  description text,
  category text default 'Engineering',
  x double precision not null default 0,
  y double precision not null default 0,
  width double precision not null default 320,
  height double precision not null default 220,
  z_index integer default 1,
  image_url text,
  live_url text,
  github_url text,
  tags text[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

---

## 7. Stage-by-Stage Implementation Roadmap

```
+-----------------------------------------------------------------------------+
| Stage 1: Foundational Canvas Engine, Pan/Zoom & Dotted Matrix               |
+-----------------------------------------------------------------------------+
                                       │
                                       ▼
+-----------------------------------------------------------------------------+
| Stage 2: Tile Graphics, Card Anatomy & Public Interaction                   |
+-----------------------------------------------------------------------------+
                                       │
                                       ▼
+-----------------------------------------------------------------------------+
| Stage 3: HUD Overlay Chrome (Zoom Controls, Origin Reset, Minimap Radar)    |
+-----------------------------------------------------------------------------+
                                       │
                                       ▼
+-----------------------------------------------------------------------------+
| Stage 4: Supabase Data Integration & Public Schema Wiring                   |
+-----------------------------------------------------------------------------+
                                       │
                                       ▼
+-----------------------------------------------------------------------------+
| Stage 5: Admin Auth Gate & Studio Mode Switch                               |
+-----------------------------------------------------------------------------+
                                       │
                                       ▼
+-----------------------------------------------------------------------------+
| Stage 6: Interactive Manipulators (Drag, Resize Handles & Snap-to-Grid)     |
+-----------------------------------------------------------------------------+
                                       │
                                       ▼
+-----------------------------------------------------------------------------+
| Stage 7: Staging, Batch Persistence & Database Writeback                    |
+-----------------------------------------------------------------------------+
                                       │
                                       ▼
+-----------------------------------------------------------------------------+
| Stage 8: Polish, Realtime Broadcasts, Undo/Redo & Image Uploads             |
+-----------------------------------------------------------------------------+
```

---

## 8. Current Stage: Stage 1 — Foundational Canvas Engine

**Status**: 🔄 IN PROGRESS

### Goal
Create a smooth, fullscreen, infinite-feeling canvas viewport using native HTML5 Canvas.

### Requirements
- [x] Native `<canvas>` element setup (100vw × 100vh)
- [x] `requestAnimationFrame` rendering loop with dirty-flag checking
- [x] Layer-based rendering architecture (Background, Dotted Grid, future layers)
- [x] Dotted matrix background (viewport-relative rendering, moiré prevention via step doubling)
- [x] Mouse drag panning with `setPointerCapture` and grabbing cursor
- [x] Cursor-centered wheel/trackpad zoom (0.25x – 2.5x)
- [x] Window resize handling with DPR support (`devicePixelRatio`)
- [x] High-frequency state stored in refs (zero React re-renders during interactions)
- [x] System dark/light mode detection (`prefers-color-scheme` with live change listener)
- [x] Dynamic cursor proximity spotlight effect (dots glow white in dark mode, black in light mode, with tactile expansion)
- [x] Centered Hero section on canvas (`Hero-image.png` in light mode, `Hero-image-dark.png` in dark mode)
- [x] Matching brand typography ("Non-Linear Creative." and subtitle in Outfit geometric sans)
- [x] Optical vertical centering of the entire hero block (sticker + title + subtitle balanced at originY)
- [x] Floating bottom-left location / recenter button with smooth ease-out cubic glide to origin

### Completed Features
- Viewport state math (`zoomAtPoint`, `screenToWorld`, `worldToScreen`, `clampZoom`)
- Two-pass dotted grid rendering with ambient batch pass and localized cursor proximity pass
- Automatic OS theme synchronization (`THEME_DARK` with `#0b0f19` / `THEME_LIGHT` with `#ffffff`)
- Smooth radial falloff for cursor proximity illumination (`PROXIMITY_RADIUS = 140px`)
- World origin viewport centering (`(0, 0)` placed directly in screen center on load)
- Layer 3 Canvas Hero Renderer:
  - Theme-adaptive raw character artwork (`Hero-image.png` / `Hero-image-dark.png`)
  - Title: `"Non-Linear Creative."` (semi-bold Outfit geometric font)
  - Subtitle: `"DESIGN ENGINEER • AI & WEB & CLOUD ENGINEERING"` (tracked uppercase)
  - Symmetrically centered vertically around world origin `(0, 0)`
  - Scales and pans natively with the viewport transform
- Floating Recenter Button (HUD Chrome):
  - Bottom-left location crosshair icon with glassmorphic styling
  - Smooth 380ms ease-out cubic glide animation restoring viewport to center `(width/2, height/2)` and 1.0x zoom
- Animated ThemeToggle Component (HUD Chrome):
  - Recreated from legacy portfolio reference (`ThemeToggle.jsx` & `old_portfolio_style.css`)
  - Modularized into `src/components/canvas/ui/ThemeToggle.tsx` and scoped CSS Module `ThemeToggle.module.css`
  - Daytime state: Sky-blue pill (`#2196f3`), yellow sun orb (`#ffd700`) with 3 concentric light rays, 6 floating clouds (`cloud-light`, `cloud-dark`) with infinite drift keyframes
  - Nighttime state: Midnight black pill (`#0b0f19`), starry sky with 4 twinkling bezier stars, full 360-degree rotation transition (`rotateCenter`), 3 grey moon craters (`moon-dot-1..3`)
  - Bidirectional theme synchronization: toggling the component switches `isDarkRef.current` and `isDarkUI`, repaints canvas background, adapts dotted matrix proximity glow, and swaps hero artwork between `Hero-image.png` and `Hero-image-dark.png`

### Implementation Decisions
- **Two-Pass Grid Rendering**: Rather than evaluating cursor distance for thousands of visible dots, visible ambient dots are drawn in a single batched pass, and only dots within the cursor's world-space proximity bounding box are evaluated for spotlight illumination.
- **Window-Level Pointer Tracking**: Pointer move/up listeners are attached to `window` rather than `<canvas>` to ensure panning and cursor illumination never drop frames during rapid cursor movement across screen boundaries.
- **Dynamic Theme Synchronization**: Auto-detects system theme on mount, and supports instant toggle switching via the top-right `ThemeToggle` HUD control, dynamically swapping between `#0b0f19` dark canvas with bright white cursor dots and `#ffffff` light canvas with visible neutral grey dots (`rgba(71, 85, 105, 0.55)`).
- **Enhanced Dot Thickness & Contrast**: Base dot diameter increased to `2.8px` (scaled gently via `Math.sqrt(zoom)`), and light mode opacity increased to `0.55` with slate-600 coloring for crisp, unmistakable visibility. Proximity spotlight expands dots up to `5.0px` with pitch black `1.0` opacity directly under the cursor.
- **Optical Hero Centering**: Evaluates the cumulative height of the sticker, gaps, title, and subtitle (`~362px`), placing the visual center of the entire assembly at `originY` with balanced breathing room above and below.
- **Layer 3 Canvas 2D Object Pipeline**: The hero sticker and typography are rendered directly on the Canvas 2D context using `worldToScreen(vp, 0, 0)` transforms, guaranteeing 0-lag 60fps synchronization with the dotted matrix background when panning and zooming.

### Performance Decisions
- Viewport coordinates, pan states, and cursor positions are stored exclusively in React refs (`viewportRef`, `cursorRef`, `isDirtyRef`), guaranteeing zero React component re-renders during high-frequency pointer movements.

### Known Issues
- None at this stage. Everything runs at 60/120fps.

---

## 9. Technical Checklist & Edge Case Safeguards

| Feature / Scenario | Safeguard / Implementation Detail |
| :--- | :--- |
| **Next.js SSR Hydration** | Canvas component uses `"use client"` directive. Canvas element is only accessed after mount via `useEffect`. |
| **DPR / HiDPI Displays** | Canvas dimensions are multiplied by `devicePixelRatio` and CSS dimensions set to logical size. `ctx.scale(dpr, dpr)` applied. |
| **Performance with Images** | Use preloaded `HTMLImageElement` and memoize references. |
| **Zoom Centering** | Zoom calculations adjust `panX` and `panY` relative to the pointer's canvas coordinate so the mouse focal point remains stationary during zoom. |
| **Accidental Drags vs Clicks** | Differentiate using a movement threshold distance (< 5px drag = click). |
| **Unauthorized Mutations** | Supabase Row Level Security (RLS) enforced server-side. |
