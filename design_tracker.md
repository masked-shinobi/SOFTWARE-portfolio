# 🎨 Design Tracker — Sectional Styles & Modular Component System

> **Scope:** Design iterations, intermediate transitions, and modular componentization.  
> **Status:** 🟡 Active Tracking — Intermediate Redesign Step  
> **Architecture:** Tailwind CSS v4 + Modular Scoped Custom Design Styles (`src/styles/*.css`).  
> **Operational Protocol:** This tracker serves as the dynamic sandbox for redesigning and component prototyping before updating the official `tracker/` files (`MASTER_PROGRESS.md`, `v2_FRONTEND_DEVELOPER.md`, `v3_FRONTEND_CREATIVE.md`, etc.).  
> **Implementation Status:** The Choice Screen redesign plan ([`Plan/choice-screen-redesign-plan.md`](file:///d:/SEMESTER%20-%207/PORTFOLIO%20SOFTWARE/Plan/choice-screen-redesign-plan.md)) has been fully executed, verified, and wired into the primary entry gateway (`entry-client.tsx`). Marked 🟢 Complete below.

---

## 1. System Context & Progress Synchronization

### Where We Stand (from `tracker/`):
- **v1.0 Foundation — Completed 🟢**:
  - Full Supabase backend connected (Phase A: profile, projects, skills, media tables, strict RLS, auth).
  - Data access layer (`src/lib/data.ts`) typed and operational.
  - Next.js 16 App Router scaffolded with TypeScript and Tailwind CSS v4.
  - `/proof` route validating live client/server data and RLS denial.
  - Automatic Mobile Guard (`<MobileUnsupported />` for viewport `< 768px`).
- **Current Intermediate Redesign Step (Active 🟡)**:
  - Decoupled styling architecture into three scoped persona modules.
  - Implemented Dual-Theme Video Boot Loader with true page-load gating and asset optimization.
  - Drafting and prototyping UI components for Developer (`Terminal Core`), Creative (`Chromatic Canvas`), and Hero (`Nexus Genesis`) ahead of locking formal stages in `tracker/`.
- **Target Roadmaps Being Redesigned**:
  - **v2.0 Developer Style (C1–C3, T1–T2)**: Structured, scroll-driven, telemetry, technical cards, adaptive resume, crosshair cursor.
  - **v3.0 Creative Style (D1–D3, E1–E3)**: Spatial canvas, floating blocks, pan/zoom engine, Figma-like admin editor.

---

## 2. The Three Sectional Style Personas

| Sectional Target | Style Persona Name | Core Aesthetic & Mood | Primary Tech & Accent Palette | Associated Modular File |
|---|---|---|---|---|
| **Developer** | **`Terminal Core`** | Structured, technical, code-controlled, precision telemetry, monospace-forward. | Sky / Cyan (`#38bdf8`), Emerald (`#34d399`), Obsidian (`#07090e`), Slate borders | [`src/styles/terminal-core.css`](file:///d:/SEMESTER%20-%207/PORTFOLIO%20SOFTWARE/src/styles/terminal-core.css) |
| **Creative** | **`Chromatic Canvas`** | Expressive, fluid glassmorphism, iridescent spatial depth, dynamic floating cards. | Violet (`#c084fc`), Hot Pink (`#f472b6`), Deep Indigo (`#130d22`), Prismatic blur | [`src/styles/chromatic-canvas.css`](file:///d:/SEMESTER%20-%207/PORTFOLIO%20SOFTWARE/src/styles/chromatic-canvas.css) |
| **Hero / Gateway** | **`Nexus Genesis`** | Atmospheric, gravitational focal point, high-contrast typography, celestial ambient lighting. | Radiant Gradient text, Dual-spectrum glow (`#38bdf8` & `#c084fc`), Deep Space (`#050508`) | [`src/styles/nexus-genesis.css`](file:///d:/SEMESTER%20-%207/PORTFOLIO%20SOFTWARE/src/styles/nexus-genesis.css) |

---

## 3. Modular Architecture & Custom Styling Strategy

Each sectional style is decoupled into its own styling module to avoid global style collisions while fully leveraging Tailwind CSS:

1. **Tailwind CSS Utility Foundation**: Standard Tailwind utility classes (`flex`, `grid`, `gap-*`, `p-*`, `transition-*`) provide structural layout, responsive breakpoints, and spacing.
2. **Scoped Design Modules (`src/styles/`)**:
   - `terminal-core.css` → Scoped with `.style-terminal-core`, `.terminal-card`, `.terminal-prompt`, `.terminal-tag`.
   - `chromatic-canvas.css` → Scoped with `.style-chromatic-canvas`, `.creative-card`, `.creative-gradient-text`.
   - `nexus-genesis.css` → Scoped with `.style-nexus-genesis`, `.hero-headline-gradient`, `.hero-portal-card`.
3. **On-Demand Extensibility**: As we create custom-made designs in each section, custom tokens and utility classes are added directly into their respective module file.
4. **Decoupled Iteration**: Changes made here do not disturb production trackers until design maturity is verified in live browser previews.

---

## 4. Comprehensive Component & Section Breakdown

| Area / Stage | Style Persona | Planned / Target Component | Module Class / Tokens | Status | Notes & Tracker Reference |
|---|---|---|---|---|---|
| **Entry / Loader** | Dual-Theme Video | Video Boot Loader (`<BootLoader />`) | `@media (prefers-color-scheme)` | 🟢 Complete | B3 refinement; dark & light trimmed video loaders with dynamic page load gating. |
| **Hero Gateway** | Nexus Genesis | Choice Screen Redesign (`<ChoiceScreen />`) | `.style-nexus-genesis`, Three.js cursor mask | 🟢 Complete | Full 5-layer redesign wired into `entry-client.tsx` (Three.js spotlight, portrait, dual choice rounds, Iceland font, and hover cloud message). |
| **Hero Gateway** | Nexus Genesis | Dual Experience Cards | `.hero-portal-card` | 🟡 Active Prototype | Links to `/developer` and `/creative`; currently tested in `entry-client.tsx`. |
| **Hero Gateway** | Nexus Genesis | Mode Transition Switcher | `.hero-portal-card` | ⚪ Pending | Seamless toggle between Dev & Creative modes from any sub-page. |
| **Developer (C1)** | Terminal Core | Developer Layout & Root Shell | `.style-terminal-core` | ⚪ Pending | C1: Dedicated developer shell with monospace telemetry status bar. |
| **Developer (T1)** | Terminal Core | Dev Dark/Light CSS Tokens | `--dev-bg`, `--dev-accent`, `--dev-text` | ⚪ Pending | T1: Dedicated palette (Cyan/Emerald/Obsidian) separate from Creative. |
| **Developer (T2)** | Terminal Core | Precision Custom Cursor | `.dev-crosshair-cursor` | ⚪ Pending | T2: Small, high-precision dot/crosshair cursor with touch auto-disable. |
| **Developer (C2)** | Terminal Core | Terminal Header & System Telemetry | `.terminal-prompt`, `.terminal-card` | ⚪ Pending | C2: System status indicators, live telemetry stats, uptime, breadcrumbs. |
| **Developer (C2)** | Terminal Core | Hero & Bio Console | `.style-terminal-core` | ⚪ Pending | C2: Bio from Supabase `profile`, social command links, CLI-inspired accents. |
| **Developer (C2)** | Terminal Core | Roles Pinned Scroll-Reveal | `.roles-slide`, Fredericka font | 🟢 Complete | GSAP pinned section scrubs 3 roles (Frontend, Backend, ML) with fixed "I am" prefix. |
| **Developer (Global)**| Terminal Core | Lenis Scroll Progress Bar | `#lenis-scroll-progress-bar` | 🟢 Complete | 3px top progress bar synchronized with Lenis smooth scroll instances. |
| **Developer (C2)** | Terminal Core | Project Tech Cards Grid | `.terminal-card`, `.terminal-tag` | ⚪ Pending | C2: Tech stack tags, repo links, live demo triggers, status badges from `getProjects()`. |
| **Developer (C2)** | Terminal Core | Skills Matrix Terminal | `.terminal-card`, `.terminal-prompt` | ⚪ Pending | C2: Categorized command prompt skill chips reading from `getSkillsByCategory()`. |
| **Developer (C3)** | Terminal Core | Adaptive Interactive Resume | `.terminal-card` | ⚪ Pending | C3: `/developer/resume` with Full vs Recruiter views and `@media print` layout. |
| **Creative (D1)** | Chromatic Canvas | Spatial Data Schema Bridge | `creative_blocks` bridge | ⚪ Pending | D1: Schema preparation for positioned blocks (x, y, width, height, rotation, z). |
| **Creative (D2)** | Chromatic Canvas | Canvas Pan/Zoom Engine | Spatial coordinate container | ⚪ Pending | D2: GPU-accelerated transforms, pan/zoom mechanics, bounds constraints. |
| **Creative (D3)** | Chromatic Canvas | Spatial Project & Media Cards | `.style-chromatic-canvas`, `.creative-card` | ⚪ Pending | D3: Iridescent borders, fluid glassmorphism, hover elevation, glowing cards. |
| **Creative (D3)** | Chromatic Canvas | Magnetic Custom Cursor | `.creative-magnetic-cursor` | ⚪ Pending | D3: Larger ring with magnetic physics snapping toward interactive blocks. |
| **Creative (E1-E3)**| Chromatic Canvas | Visual Canvas Editor & Admin Gate | Admin spatial property controls | ⚪ Pending | E1–E3: Figma-style layers and spatial positioning panel. |

---

## 5. Intermediate Transition Workflow

```
[ tracker/ (v1.0 Complete) ]
             │
             ▼
[ design_tracker.md (Intermediate Redesign Step) ] ◄── (WE ARE HERE)
  • Prototype scoped sectional styles
  • Refine UI interactions & custom tokens
  • Test visual hierarchy & responsiveness
             │
             ▼
[ User Approval & Polish ]
             │
             ▼
[ Sync & Update tracker/ (v2.0 & v3.0 formal stages) ]
```

1. **Step 1 — Style Setup & Modular Registration** (✅ Completed):
   - Established persona identities: `Terminal Core`, `Chromatic Canvas`, `Nexus Genesis`.
   - Created scoped style modules in `src/styles/` and registered them into `globals.css`.
   - Built the Dual-Theme Video Boot Loader with auto-detection and page load gating.

2. **Step 2 — Intermediate Redesign Architecture & Synchronization** (✅ Completed):
   - Aligned the component roadmap in `design_tracker.md` with the full `tracker/` scope (C1–C3, T1–T2, D1–D3, E1–E3).
   - Documented the intermediate redesign sandbox boundary so `tracker/` files remain untouched until components are validated.

3. **Step 3 — Prototyping Sectional Components (Next)**:
   - Construct standalone modular components utilizing Tailwind v4 and the scoped CSS modules.
   - Test micro-interactions, responsive behavior, and dark/light dynamics.

4. **Step 4 — Finalize & Promote to Main Tracker**:
   - Once design components meet aesthetic and architectural standards, sync progress to `tracker/v2_FRONTEND_DEVELOPER.md` and `tracker/MASTER_PROGRESS.md`.

---

## 6. Architecture Guidelines: Pinned Scroll-Reveal & Smooth Scroll (Lenis + GSAP ScrollTrigger)

When implementing pinned scroll-driven pages or sections (e.g. multi-slide text reveals, horizontal pin galleries, or sticky showcases):

### ⚠️ Critical Issue: Flex Container Auto-Disables Pin Spacing
In GSAP ScrollTrigger's source code (`ScrollTrigger.js`), there is an explicit check on the trigger element's parent container:
```javascript
pinSpacing = !pinSpacing && pin.parentNode && _getComputedStyle(pin.parentNode).display === "flex" ? false : _padding;
// if the parent is display: flex, don't apply pinSpacing by default.
```
If a parent container (such as `<main>` or an outer wrapper `<div>`) has `display: flex` (e.g. Tailwind `flex flex-col`):
1. ScrollTrigger **silently disables `pinSpacing`** and sets `padding-bottom: 0px` on `.pin-spacer`.
2. Because no spacer height is added to the DOM, the document does not expand to accommodate the scroll travel distance (e.g. `end: "+=300%"`).
3. The page reaches its unpinned bottom boundary the moment the pinned section reaches `top top`.
4. **Result:** Lenis smooth scroll and native wheel scrolling clamp at that exact pixel height, and the scroll freezes completely at the first slide.

### 🛠️ How to Rectify & Rules for Building New Pages:

1. **Standard Block Flow for Page Layouts**:
   - Never use `flex flex-col` on `<main>` or immediate parent containers that wrap pinned sections.
   - Use standard block flow (`<main className="w-full min-h-screen">` or standard `<div>` elements) so elements stack naturally in normal document flow.

2. **Always Set `pinSpacing: true` Explicitly**:
   - In any GSAP `ScrollTrigger` timeline or tween with `pin: true`, always explicitly define `pinSpacing: true`:
     ```typescript
     const tl = gsap.timeline({
       scrollTrigger: {
         trigger: sectionRef.current,
         pin: true,
         pinSpacing: true, // Guarantees spacer padding even if parent styles change
         scrub: true,
         start: "top top",
         end: "+=300%",
         anticipatePin: 1,
       },
     });
     ```

3. **Bidirectional Lenis ↔ GSAP Synchronization**:
   - Lenis smooth scroll and GSAP ScrollTrigger must stay in sync across two dimensions:
     1. **Scroll Frame Forwarding**: Lenis must notify ScrollTrigger on every frame:
        ```typescript
        lenis.on("scroll", ScrollTrigger.update);
        ```
     2. **Document Resize / Spacer Recalculation**: When ScrollTrigger pins an element and inserts the `.pin-spacer`, document height changes. Lenis must recalculate its scroll limit (`limit = scrollHeight - windowHeight`):
        ```typescript
        ScrollTrigger.addEventListener("refresh", () => lenis.resize());
        ```
     3. **Mount-Time Refresh**:
        ```typescript
        requestAnimationFrame(() => {
          lenis.resize();
          ScrollTrigger.refresh();
        });
        ```

4. **Quick Diagnostic Checklist if a Section Freezes**:
   - [ ] Check `.pin-spacer` in DevTools: Is `padding-bottom` (or `margin-bottom`) non-zero? (Should equal `end - start`, e.g. `2190px`).
   - [ ] Check parent container computed style: Is `display` set to `flex`? If so, switch to `block`.
   - [ ] Check `document.documentElement.scrollHeight`: Is it `~contentHeight + pinDistance`?
   - [ ] Check `lenis.limit`: Does `lenis.limit === document.documentElement.scrollHeight - window.innerHeight`?

---

## 7. Design Iteration Log

### 2026-09-13 — System Initialization & Dual-Theme Video Boot Loader
- Established three sectional style designations:
  - **`Terminal Core`** for Developer
  - **`Chromatic Canvas`** for Creative
  - **`Nexus Genesis`** for Hero
- Created modular CSS architecture:
  - `src/styles/terminal-core.css`
  - `src/styles/chromatic-canvas.css`
  - `src/styles/nexus-genesis.css`
- Imported modules into `src/app/globals.css` with Tailwind CSS v4.
- Created `design_tracker.md` to track design transitions and custom-made additions.
- Replaced typewriter boot loader with **Dual-Theme Video Boot Loader**:
  - Automatically detects browser preference (`prefers-color-scheme`) via CSS `@media` queries and `window.matchMedia`.
  - Sets viewport background to `#000000` (black) in dark mode and `#ffffff` (white) in light mode via `@media (prefers-color-scheme)`.
  - Stripped the first 1-second static/glitch artifact from both videos using ffmpeg (`public/port-loader/dark-loader-stripped.mp4` and `light-loader-stripped.mp4`).
  - Centered video relative to screen width and height (`max-w-[90vw]`, `max-h-[85vh]`, 16:9 aspect ratio, `object-contain`).
  - Implemented seamless `onEnded` transition and subtle theme-aware "Skip →" button.
- **Loader Timing Refinement (True Page Load Gate)**:
  - Modified loader to stay visible only while the website is actually loading (`document.readyState`, font loading, asset fetch).
  - Added smooth loop to the video while loading is in progress.
  - As soon as the page is ready, dismisses automatically (with a minimal ~1.2s aesthetic floor to prevent jarring flicker).
  - Dynamically loads only the single matching theme video (cutting bandwidth in half from 3.2MB to 1.6MB).

### 2026-09-13 — Intermediate Redesign Synchronization & Roadmap Alignment
- Synchronized `design_tracker.md` with the full `tracker/` roadmap:
  - Integrated v1.0 completion baseline (backend data layer, `/proof` route, mobile viewport guard).
  - Mapped v2.0 Developer scope (C1 layout/tokens, C2 telemetry/hero/projects/skills, C3 adaptive resume, T1/T2 tokens & crosshair cursor) to `Terminal Core`.
  - Mapped v3.0 Creative scope (D1 schema, D2 canvas engine, D3 spatial cards & magnetic cursor, E1–E3 canvas editor) to `Chromatic Canvas`.
  - Mapped Entry & Gateway features to `Nexus Genesis`.
- Formalized the intermediate redesign protocol: prototyping and styling remain tracked within `design_tracker.md` without modifying `tracker/` files until designs are ready to be organized and committed.

### 2026-09-14 — Choice Screen Redesign Complete & Wired into Entry Gateway
- Engineered `<ChoiceScreen />` modular component in `src/components/choice-screen/`:
  - **Layer 1 (Three.js Canvas)**: Cursor-revealed blueprint background with custom WebGL fragment shader, smooth linear interpolation (`lerp`), and native 1:1 unexpanded tiled layout.
  - **Layer 2 (Character Portrait & Cover)**: Cutout image (`my_image.png`) anchored bottom-left with responsive relative measurements (`h-[95vh]`, `max-h-[97vh]`), blended into bottom surface via `dark_overlay.png` / `light_overlay.png`.
  - **Layer 3 (Dual Choice Rounds)**: High-contrast circular portals for Developer (`dev_choice_icon.png`) and Creative (`creative_choice_icon.png`) with pill badges, cyan/violet hover glows, and motion spring interactions linking to `/developer` and `/creative`.
  - **Layer 4 (Identity Typography)**: Google Font `Iceland` imported for "Sanjay Baskar", "CSE ASPIRANT", and "CHOICE PAGE" capsule badge.
  - **Layer 5 (Hover Cloud Message)**: `"CHOOSE TO EXPLORE THE WORK !!!"` speech bubble (`cloud_message.png`) animated with `motion` spring reveal on portrait hover.
- **Entry Gateway Integration**:
  - Replaced legacy choice cards in `src/app/entry-client.tsx` with `<ChoiceScreen />`.
  - Tested across viewports (`1536x730`, `1510x650`, `1536x800`) in both dark and light modes.
  - Full TypeScript and production build verified with zero errors.
- **Button Spacing & Roomy Padding Refinements**:
  - Increased spacing between the circular rounds and buttons using flex gap (`gap-7 sm:gap-9 md:gap-10`) for clear, airy separation.
  - Substantially increased room around text inside `DEVELOPER` and `CREATIVE` buttons with `min-h-[54px] sm:min-h-[60px]`, `min-w-[210px] sm:min-w-[250px]`, and `px-12 sm:px-16 md:px-20 py-4 sm:py-5 md:py-6`, combined with balanced typography (`text-sm sm:text-base md:text-lg`) matching the target mockup.
  - Substantially expanded `CHOICE PAGE` capsule badge with `min-h-[38px] sm:min-h-[44px]` and `px-14 sm:px-18 md:px-20 py-3 sm:py-3.5 md:py-4` for an elegant, spacious capsule appearance.

### 2026-09-14 — Full-Viewport Background Stacking, Chest-Level Buttons & Transition Alignment
- **Preserved Fit-Scaled Center Stage for Morph Transition**:
  - Retained the exact `1440×1024` artboard dimensions scaled via `fitScaleForViewport()` (`Math.min(vw/1440, vh/1024)`) in `<ChoiceStageFrame />`.
  - Guarantees 1:1 scale and spatial coordinate matching with the GSAP morph overlay in `developer-bento-hero.tsx` (`getFitScale()`) for a seamless, glitch-free zoom-and-dock transition into `/developer`.
- **Full-Viewport Background Blueprint Stacking**:
  - Elevated `<ChoiceBackgroundCanvas />` to the outer `<ChoiceStageFrame />` covering `100vw × 100vh` (`absolute inset-0 z-0`).
  - Utilized native WebGL repeat shader wrapping (`fract((offsetFromCenter / u_texSize) + vec2(0.5, 0.5))`) to tile the schematic blueprint pattern across the entire viewport, completely replacing the black letterbox sidebars.
  - Extended the bottom atmospheric vignette (`dark_overlay.png` / `light_overlay.png`) across the full viewport width at `z-[5]`.
  - Configured inner `<ChoiceScreen />` with `showCanvas={false}` and `bg-transparent` so the outer tiled blueprint shines through seamlessly.
- **Chest-Level Choice Button Repositioning**:
  - Adjusted choice buttons container vertical positioning from `top-[21%]` (forehead/head level) down to `top-[34%]` (chest level, matching target design `dark.png` at y ~ 350px).
  - Shifted horizontal alignment to `left-[44%] right-[2%]` with `gap-12 lg:gap-16`, giving proper clearance from Sanjay's raised hand and shoulder.
- **Speech Cloud Message Alignment**:
  - Adjusted hover cloud position from `top-[8%] left-[28%]` to `top-[13%] left-[39%]` (`h-[76px]`).
  - Floats cleanly beside Sanjay's head and above his raised hand without overlapping facial features.
- **Portrait Sizing & Grounding**:
  - Relaxed portrait width constraints from `max-w-[44%]` to `max-w-[55%]` with `h-[93%]`.
  - Prevents premature horizontal clamping, allowing Sanjay's cutout to render at full natural height grounded against the bottom edge.
- **Verification**:
  - Type checking verified with `tsc --noEmit` (0 errors).
  - Browser visual preview verified via headless screenshot capture across viewport sizes.

### 2026-09-14 — First-Visit Boot Loader Gating (Session Persistence)
- **Session-Scoped Gating (`sessionStorage` + In-Memory Fallback)**:
  - Updated [`entry-client.tsx`](file:///d:/SEMESTER%20-%207/PORTFOLIO%20SOFTWARE/src/app/entry-client.tsx) so `showBoot` initializes from `sessionStorage.getItem("portfolio_boot_completed")`.
  - When a visitor enters the website for the very first time in a browsing session, the video boot loader plays normally.
  - Upon loader completion (or skip), `portfolio_boot_completed` is committed to `sessionStorage` and in-memory state.
  - Subsequent navigations back to `/` from `/developer`, `/creative`, or anywhere else in the application skip the loader immediately, presenting the choice screen without delay or unneeded re-rendering.
  - Navigating to `/developer` directly also marks the session as loaded so returning to `/` never re-triggers the boot loader.
- **Verification**:
  - `tsc --noEmit` passed with 0 errors.
  - Verified client-side navigation preserves choice screen state without repeated loading screens.

### 2026-09-15 — Roles Pinned Scroll-Reveal Section & Scroll Progress Bar
- **Roles Section (`RolesSection.tsx`)** — Developer Experience Section 2:
  - GSAP ScrollTrigger-driven pinned section (`pin: true`, `scrub: true`, `end: '+=300%'`) that reveals 3 role slides via scroll: Frontend developer → Backend developer → ML engineer.
  - "I am" text stays fixed; role name + description animate with calm fade + vertical slide (`translateY ±25px`, `power2` easing).
  - All 3 slides are absolutely-stacked in the same position — GSAP drives `opacity` and `y` transforms between them. No DOM innerHTML swaps.
  - Minimal white layout with generous negative space. Thick black bar accent top-right (~65% width) and mirrored bottom-left (~55% width), matching the reference images.
  - `prefers-reduced-motion` respected: if set, skips all ScrollTrigger pinning and shows the last slide (ML engineer) statically.
  - Uses `@gsap/react` `useGSAP()` hook for automatic cleanup on unmount.
  - Data sourced from [`roles.json`](file:///d:/SEMESTER%20-%207/PORTFOLIO%20SOFTWARE/src/data/roles.json) — mapped dynamically, no hardcoded JSX blocks.
- **Fredericka the Great Font**:
  - Loaded via `next/font/google` (`Fredericka_the_Great`, weight 400) in [`layout.tsx`](file:///d:/SEMESTER%20-%207/PORTFOLIO%20SOFTWARE/src/app/layout.tsx).
  - CSS variable `--font-fredericka` registered via `@theme inline` in [`globals.css`](file:///d:/SEMESTER%20-%207/PORTFOLIO%20SOFTWARE/src/app/globals.css).
  - Applied to "I am" prefix and role name display text in the Roles section.
- **Scroll Progress Bar (`ScrollProgressBar.tsx`)**:
  - Thin 3px fixed bar at viewport top, `z-[9999]`, fills left-to-right tracking overall page scroll progress.
  - Reads from existing Lenis instance via `useLenis` hook — stays in sync with smooth scroll.
  - Uses `scaleX` transform (GPU-accelerated) with `--progress-accent: #ff4d6d` CSS variable.
  - Mounted inside `<ReactLenis root>` in [`developer-smooth-scroll.tsx`](file:///d:/SEMESTER%20-%207/PORTFOLIO%20SOFTWARE/src/components/developer/developer-smooth-scroll.tsx).
- **Dependency Added**: `@gsap/react` for `useGSAP()` hook.
- **Scroll Freeze Diagnostic & Fix**:
  - Identified that `<main className="w-full flex flex-col min-h-screen">` caused GSAP ScrollTrigger to automatically set `pinSpacing: false` (GSAP intentionally disables pin spacing when parent is `display: flex`).
  - Switched `<main>` to standard block layout (`w-full min-h-screen`) and explicitly added `pinSpacing: true` to the ScrollTrigger timeline.
  - Spacer offset height correctly expanded document height from 1760px to 3950px (+2190px pin space).
  - Verified full scroll transitions via automated CDP mouse wheel simulation: Frontend developer → Backend developer → ML engineer, as well as smooth reverse scrolling back to top.
- **Light Screen Inverted Color Mode**:
  - Implemented dynamic theme awareness on `<RolesSection theme={theme} />`:
    - **Light screen (`theme === "light"` / `prefers-color-scheme: light`)**: Background inverted to sleek pure black (`bg-black`), accent bars inverted to white (`bg-white` at top-right ~65% and bottom-left ~55%), "I am" prefix in white, role text in white (`text-white`), and description in crisp light gray (`#d1d5db`).
    - **Dark screen (`theme === "dark"` / `prefers-color-scheme: dark`)**: Minimalist white background (`bg-white`), black accent bars (`bg-black`), black typography (`text-black`), and gray description (`#6b7280`).
  - Added smooth CSS color transitions (`transition-colors duration-500`) across the section backdrop, accent bars, and text.
  - Automatically falls back to system `window.matchMedia("(prefers-color-scheme: light)")` if no `theme` prop is explicitly supplied.
  - Verified in live browser via CDP emulation and screenshot capture (`inverted_light_screen_verified.png`).
- **Verification**:
  - `tsc --noEmit` passed with 0 errors.
  - Automated CDP scroll tests verified all slide opacities and transforms at `scrollY` 1030, 1760, and 3220.
  - Live CDP media emulation verified active `bg-black` and white accents under light mode.
