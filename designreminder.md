# Design Experience — Development Tracker & Rules

> **This file is the persistent development instruction/tracker for the Design Experience.**
> It must be consulted before any development work and updated after every stage completion.

---

## 1. Technology Constraints

```
Native HTML5 Canvas only.

Rendering: <canvas> + CanvasRenderingContext2D
Framework: React 19 / Next.js 16 (App Router, client components)
Events:    Native browser mouse, pointer, wheel, resize events
Animation: requestAnimationFrame

DO NOT USE:
- Konva
- react-konva
- Fabric.js
- PixiJS
- Any other canvas abstraction/rendering library

These libraries are STRICTLY PROHIBITED for this project.
The canvas engine is built entirely from scratch using the native Canvas 2D API.
```

---

## 2. Development Philosophy

Build the canvas engine **incrementally**.

**Do NOT build the entire editor at once.**

Each stage must:

1. Have a clearly defined goal.
2. Implement only the required functionality for that stage.
3. Verify the functionality works correctly.
4. Update `design_experience.md` with actual implementation details.
5. Update this file (`designreminder.md`) with progress.
6. **Wait for the user to confirm completion with "done"** before proceeding to the next stage.

---

## 3. Completion Rule

When the user says **"done"**:

1. Inspect what was actually implemented (read the code).
2. Update `design_experience.md`:
   - Record completed functionality (actual, not planned).
   - Record important implementation decisions.
   - Record any limitations, bugs, or remaining work.
3. Update this file (`designreminder.md`):
   - Move the completed stage to "Completed Stages".
   - Update "Current Stage" to the next stage.
   - Record any decisions or notes.
4. **Only then** prepare for the next stage.

**Do NOT silently skip documentation updates.**

---

## 4. Current Stage

### Stage 1: Foundational Canvas Engine, Pan/Zoom & Dotted Matrix

**Status**: 🔄 IN PROGRESS

**Goal**: Create a smooth, fullscreen, infinite-feeling canvas viewport using native HTML5 Canvas with dotted matrix background, panning, and cursor-centered zoom.

**Requirements**:
- Native `<canvas>` element (100vw × 100vh)
- `requestAnimationFrame` rendering loop
- Layer-based rendering architecture (background → grid → future layers)
- Dotted matrix background (only visible dots rendered)
- Mouse drag panning
- Cursor-centered wheel/trackpad zoom (0.25x – 2.5x)
- Window resize handling with devicePixelRatio support
- High-frequency viewport state stored in refs (not React state)
- System dark/light mode detection (`prefers-color-scheme` with live change listener)
- Cursor proximity spotlight glow (dots turn bright white in dark mode, bold black in light mode, following cursor motion)

---

## 5. Completed Stages

*(None yet — awaiting user "done" confirmation for Stage 1)*

---

## 6. Development Workflow

```
1. Read designreminder.md (this file)
2. Read design_experience.md
3. Understand current stage requirements
4. Implement ONLY current stage features
5. Verify implementation
6. Wait for user to say "done"
7. Update both documentation files
8. Proceed to next stage
```

---

## 7. Documentation Workflow

### design_experience.md
- Technology & architecture reference
- Records ACTUAL implementation (not plans)
- Updated after each stage completion
- Contains: Technology, Architecture, Current Stage, Completed Features, Decisions, Known Issues

### designreminder.md (this file)
- Development rules & workflow tracker
- Contains: Rules, Current Stage, Completed Stages, Decisions, Pending Work
- Prevents accidental introduction of prohibited libraries

---

## 8. Important Decisions

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-09-20 | Native HTML5 Canvas (no Konva) | Full control over rendering, performance, no third-party abstractions |
| 2026-09-20 | Viewport state in React refs | Avoid React re-renders during high-frequency pointer events |
| 2026-09-20 | requestAnimationFrame rendering | Smooth 60fps rendering decoupled from React lifecycle |
| 2026-09-20 | Two-Pass Proximity Spotlight | Batch draw ambient dots + localized spotlight pass for 60/120fps performance |
| 2026-09-20 | System Theme Detection | Native `window.matchMedia('(prefers-color-scheme: dark)')` with dynamic listener |
| 2026-09-20 | Enhanced Dot Thickness & Contrast | Base dot diameter 2.8px (scaled via Math.sqrt(zoom)) with slate-600 grey (0.55 alpha) for distinct visibility |
| 2026-09-20 | Layer 3 Canvas Hero Renderer | Centered theme-adaptive character sticker + Outfit typography ("Non-Linear Creative.") |
| 2026-09-20 | Optical Hero Centering | Symmetrically balanced entire 362px hero assembly at originY for true vertical centering |
| 2026-09-20 | Floating Recenter Button | Bottom-left glassmorphic crosshair button with 380ms ease-out cubic glide to center |
| 2026-09-20 | Animated ThemeToggle HUD | Recreated legacy portfolio day/night toggle with floating clouds, twinkling stars, 360-deg rotation & craters |

---

## 9. Pending Work

- Stage 1 awaiting user confirmation ("done")
- Stages 2–8 (not started)

---

## 10. File Locations

| Purpose | Path |
|---------|------|
| Canvas page | `src/app/creative/page.tsx` |
| Canvas component | `src/components/canvas/` |
| Design docs | `design_experience.md` |
| Dev tracker | `designreminder.md` (this file) |
