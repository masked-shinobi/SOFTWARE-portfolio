# 📅 Daily Work Log

> Track what was worked on each day, decisions made, and any blockers.

---

## Format

```
### YYYY-MM-DD (Day X) — [Major Version Working On]
**Stage(s):** [Which stages were touched]
**Work Done:**
- Bullet points of what was accomplished

**Decisions Made:**
- Any design or architecture decisions

**Blockers / Issues:**
- Problems encountered

**Next Session Plan:**
- What to pick up next time
```

---

## Log

---

### 2026-09-10 (Day 1) — Project Setup
**Stage(s):** N/A — Project initialization

**Work Done:**
- Created Plan documents (architecture + stage plan)
- Initialized Git repository with `dev` and `main` branches
- Set up `tracker/` folder with full tracking system:
  - `README.md` — tracker overview, versioning strategy, branching model
  - `MASTER_PROGRESS.md` — bird's-eye view of all phases
  - `v1_BACKEND.md` — detailed v1.0 Backend task tracker
  - `v2_FRONTEND_DEVELOPER.md` — detailed v2.0 Developer task tracker
  - `v3_FRONTEND_CREATIVE.md` — detailed v3.0 Creative task tracker
  - `DAILY_LOG.md` — this file
  - `DECISIONS.md` — architecture decision record
  - `TECH_STACK.md` — confirmed stack and versions
  - `REMINDER.txt` — AI session context and pre-work rules
- Connected GitHub remote (`https://github.com/masked-shinobi/SOFTWARE-portfolio.git`)
- Pushed initial `Plan/` and `tracker/` folders to both `main` and `dev` on GitHub
- Switched active working branch back to `dev` for day-to-day development
- Ready to start Version 1 (v1.0 Backend) upon user confirmation

**Decisions Made:**
- 3 major versions: v1.0 (Backend), v2.0 (Developer FE), v3.0 (Creative FE)
- `main` only receives merges when a major version is fully complete
- All daily work on `dev` branch
- Story, Mobile, Deployment are post-v3 scope
- **Docker deferred to Phase F** — using hosted Supabase (free tier) from the start instead of local Docker setup. Docker adds setup friction on day one with zero benefit since schema/RLS/auth work is identical on hosted vs local.

**Blockers / Issues:**
- None

**Next Session Plan:**
- Begin v1.0 Stage A1: Supabase project setup (hosted, free tier — create project, grab keys, .env.local)

---

### 2026-09-11 (Day 2) — v1.0 Backend
**Stage(s):** A1 — Supabase Project Setup, A2 — Core Schema Design, A3 — Row Level Security, A4 — Auth Setup

**Work Done:**
- Completed Stage A1 (all 5 tasks ✅)
  - Created hosted Supabase project (free tier, ref: `jhrlkrkwynsucdrodxza`)
  - Created `.env.local` with Supabase keys
  - Verified project is reachable
- Completed Stage A2 (all 6 tasks ✅)
  - Created schema blueprint document: `tracker/SCHEMA_BLUEPRINT.md` detailing all tables, types, JSON shapes, and seed preparation checklists
  - Created SQL migration: `supabase/migrations/001_core_schema.sql` defining `profile`, `projects`, `skills`, `media`, and `portfolio` storage bucket
  - Executed migration successfully on Supabase
  - Verified `projects` table response via REST endpoint
- Completed Stage A3 (all 4 tasks ✅)
  - Created SQL migration: `supabase/migrations/002_rls_policies.sql`
  - Enabled RLS on all 4 core tables (profile, projects, skills, media)
  - Created 4 public read-only SELECT policies + 1 storage bucket read policy
  - `projects` table filters on `published = true` — unpublished rows hidden from public
  - No write policies created → RLS default deny blocks INSERT/UPDATE/DELETE for anon
  - Verified via REST API tests:
    - Anon SELECT on published projects → ✅ works
    - Anon INSERT → ✅ blocked (401)
    - Anon UPDATE → ✅ blocked (0 rows affected)
    - Anon DELETE → ✅ blocked (0 rows affected)
    - Unpublished project hidden from anon → ✅ confirmed
- Completed Stage A4 (all 4 tasks ✅)
  - Enabled Supabase Auth (email + password) via Dashboard
  - Created admin user: `maskedprogrammer.in@gmail.com` (UUID: `428d026c-33dd-4845-a903-4831adfb7e56`)
  - Created SQL migration: `supabase/migrations/003_admin_rls_policies.sql`
  - 16 admin policies on 4 tables (SELECT, INSERT, UPDATE, DELETE each) + 4 storage policies
  - All policies check `auth.uid() = '<admin-uuid>'`
  - Verified via REST API tests:
    - Admin INSERT → ✅ works
    - Admin SELECT (unpublished) → ✅ sees all rows
    - Anon SELECT (unpublished) → ✅ hidden (empty result)
    - Admin UPDATE → ✅ works
    - Anon INSERT → ✅ blocked (401)
    - Admin DELETE → ✅ works (test row cleaned up)
- Updated `v1_BACKEND.md` — A1, A2, A3, and A4 marked 🟢
- Updated `MASTER_PROGRESS.md` — A1, A2, A3, and A4 marked 🟢
- Git Sync & Branch Management:
  - Pulled and merged `dev` branch into `main` cleanly
  - Pushed `main` to origin
  - Confirmed default repository branch is `main`, active development remains on `dev`

**Decisions Made:**
- Used base URL format (`https://xxx.supabase.co`) for `NEXT_PUBLIC_SUPABASE_URL`
- Created dedicated `tracker/SCHEMA_BLUEPRINT.md` as the single source of truth and data preparation guide for Stage A5
- DEC-007: RLS strategy — deny-all default with public SELECT policies; admin write access deferred to A4
- DEC-008: Admin auth — single hardcoded UUID in RLS policies, no role column needed (single-user portfolio)

**Blockers / Issues:**
- None

**Next Session Plan:**
- Begin v1.0 Stage A5: Seed Data (Real/realistic content)
  - Add 2–3 real projects with full data
  - Write real bio/profile content
  - Upload 2+ real images to Supabase Storage
  - Confirm images load via public Storage URL
  - Add skills data

---

### 2026-09-11 (Day 3) — v1.0 Backend
**Stage(s):** A5 — Seed Data

**Work Done:**
- Completed Stage A5 (all 5 tasks ✅)
  - Migrated real content from old portfolio (`migration/seed_data.json`) into Supabase
  - Added UNIQUE constraint on `skills.name` (required for `ON CONFLICT` upserts)
  - Seeded `profile` table: 1 row (Sanjay Baskar — full bio, headline, social links, resume URL)
  - Seeded `projects` table: 18 projects with slugs, tech stacks, descriptions, featured/published flags
  - Seeded `skills` table: 29 skills across 6 categories (Languages, Frameworks, Databases, Cloud & DevOps, Tools, Other)
  - Wrote Node.js upload script (`scripts/upload_images.mjs`) to push images to Supabase Storage
  - Uploaded 9 images to `portfolio` bucket (avatar, hero stickers, chat mascot, contact logo, floating stickers)
  - Seeded `media` table: 9 rows with storage paths, public URLs, alt text, MIME types, file sizes
  - Verified avatar public URL loads (HTTP 200, 3.2 MB)
  - Verified all table row counts: profile=1, projects=18, skills=29, media=9
- Created migration files:
  - `supabase/migrations/004_seed_data.sql` (skills unique constraint + profile + projects + skills)
  - `supabase/migrations/005_seed_media.sql` (auto-generated media table seed)
- Initialized `package.json` and installed `@supabase/supabase-js` for upload script
- Updated `v1_BACKEND.md` — A5 marked 🟢
- Updated `MASTER_PROGRESS.md` — A5 marked 🟢

**Decisions Made:**
- DEC-009: Skipped project thumbnails/screenshots — old portfolio used CSS/canvas-generated visuals, not static images. Set `thumbnail_url` to NULL; will add real images during frontend phase
- DEC-010: Programmatic image upload via Node.js script using service_role key, rather than manual Dashboard uploads

**Blockers / Issues:**
- None

**Next Session Plan:**
- Begin v1.0 Stage A6: Data Access Layer (typed fetch functions)
  - Set up Supabase client (browser + SSR)
  - Generate TypeScript types from Supabase schema
  - Write `getProfile()`, `getProjects()`, `getSkills()`, `getMedia()` functions
  - Test all fetch functions return correct typed data

---

### 2026-09-11 (Day 4) — v1.0 Backend
**Stage(s):** A6 — Data Access Layer

**Work Done:**
- Completed Stage A6 (all 8 tasks ✅)
  - Hand-wrote TypeScript types from `SCHEMA_BLUEPRINT.md` → `src/types/database.types.ts`
    - Full `Database` interface for Supabase client generic typing
    - Separate `Row`, `Insert`, `Update` types for all 4 tables
    - `SocialLinks` interface for profile JSONB column
  - Created Supabase browser client → `src/lib/supabase/client.ts`
    - Uses `createBrowserClient()` from `@supabase/ssr`
    - For Client Components (`'use client'`)
  - Created Supabase server client → `src/lib/supabase/server.ts`
    - Uses `createServerClient()` from `@supabase/ssr` with cookie handling
    - For Server Components, Route Handlers, Server Actions
  - Wrote 8 typed fetch functions across 4 data modules:
    - `getProfile()` — single row, returns `Profile | null`
    - `getProjects()` — all published, ordered by display_order
    - `getFeaturedProjects()` — featured only
    - `getProjectBySlug(slug)` — single project by URL slug
    - `getSkills()` — all skills, ordered by category + display_order
    - `getSkillsByCategory()` — grouped by category → `Record<string, Skill[]>`
    - `getMedia()` — all media, newest first
    - `getMediaByType(type)` — filtered by image/video/document
  - All functions accept optional `client` parameter for dependency injection
  - Barrel export at `src/lib/data/index.ts`
  - Created verification script (`scripts/test_data_layer.ts`) — **15/15 tests passed**
  - Installed `@supabase/ssr`, `typescript`, `tsx`
- Updated `v1_BACKEND.md` — A6 marked 🟢, Phase A marked 🟢 Complete
- Updated `MASTER_PROGRESS.md` — A6 marked 🟢, v1.0 marked 🟡 In Progress, Merge History updated
- Merged `dev` → `main` for Phase A completion (A1–A6)

**Decisions Made:**
- DEC-011: Hand-wrote types instead of using `supabase gen types` CLI — faster, equally accurate for 4 simple tables, avoids CLI setup before Next.js exists
- DEC-012: All fetch functions accept optional Supabase client parameter — enables dependency injection from either server or browser client in Next.js, plus standalone usage in scripts

**Blockers / Issues:**
- IDE shows lint errors for `@/` path alias, `next/headers`, `@types/node` — expected since Next.js project doesn't exist yet (Stage B1). All code executes correctly via `tsx`.

**Next Session Plan:**
- Begin v1.0 Stage B1: Next.js Scaffold
  - Create Next.js + TypeScript + Tailwind project
  - Set up App Router folder structure (entry, developer, creative, story, admin routes)
  - Connect env vars
  - Set up `@/` path alias (resolves current lint errors)
  - Move `src/` files into the Next.js project structure

---

### 2026-09-11 (Day 5) — v1.0 Frontend Foundation
**Stage(s):** B1 — Next.js Scaffold

**Work Done:**
- Completed Stage B1 (all tasks ✅)
- Backed up existing `src/` (data layer & types) and initialized Next.js 16.3.4 (App Router) with TypeScript and Tailwind CSS v4
- Restored data access layer files into `src/lib/` and `src/types/`
- Re-installed dependencies: `@supabase/supabase-js`, `@supabase/ssr`, `tsx`
- Created App Router route skeleton:
  - `src/app/page.tsx` (Entry Page placeholder)
  - `src/app/developer/layout.tsx` + `page.tsx` (Developer Experience placeholder)
  - `src/app/developer/resume/page.tsx` (Adaptive Resume placeholder)
  - `src/app/creative/layout.tsx` + `page.tsx` (Creative Experience placeholder)
  - `src/app/story/page.tsx` (Story Experience placeholder)
  - `src/app/admin/layout.tsx` + `page.tsx` (Admin Dashboard placeholder)
  - `src/app/admin/creative/page.tsx` (Creative Canvas Editor placeholder)
- Created directory structure:
  - `src/components/` (shared components)
  - `src/experiences/developer/` (developer experience modules)
  - `src/experiences/creative/` (creative experience modules)
- Cleaned up root layout and configured path aliases (`@/*` mapping to `./src/*`)
- Verified production build: `npm run build` completed successfully (all 8 routes statically pre-rendered)
- Verified data layer verification suite: all 15 tests passed (`test_data_layer.ts`)
- Updated `v1_BACKEND.md`, `MASTER_PROGRESS.md`, `TECH_STACK.md`, `DECISIONS.md`

**Decisions Made:**
- DEC-013: Next.js 16.3.4 + App Router Scaffold in Existing Repository with Tailwind CSS v4 and TypeScript

**Blockers / Issues:**
- None. Production build and test suite are 100% green.

**Next Session Plan:**
- Begin v1.0 Stage B2: Prove Data Connection
  - Call `getProjects()` on a plain page (in Server Component)
  - Render seeded project titles as plain text
  - Confirm RLS blocks writes from the frontend client
  - Verify TypeScript types work end-to-end

---

### 2026-09-12 (Day 6) — v1.0 Frontend Foundation
**Stage(s):** B2 — Prove Data Connection

**Work Done:**
- Completed Stage B2 (all 4 tasks ✅)
- Created `/proof` route (`src/app/proof/page.tsx`) as a Server Component verifying end-to-end data flow:
  - Fetched `profile` via `getProfile()`: 1 row (Sanjay Baskar, headline, bio, avatar, resume, 5 social links)
  - Fetched `projects` via `getProjects()`: 18 published projects rendered with tech stack and slug metadata
  - Fetched `skills` via `getSkillsByCategory()`: 29 skills rendered across 6 categories
  - Fetched `media` via `getMedia()`: 9 items rendered with public URLs, MIME types, and file sizes
- Built client-side RLS write test component (`src/app/proof/rls-write-test.tsx`):
  - Verified browser anon key `INSERT` into `projects` is blocked by RLS (`new row violates row-level security policy for table "projects"`)
  - Verified browser anon key `UPDATE` on `projects` affects 0 rows
  - Verified browser anon key `DELETE` on `projects` affects 0 rows
- Verified full production build passes (`npm run build`) with dynamic rendering for `/proof`
- Verified end-to-end type safety: `Database` interface and Row types flow cleanly without casting
- Updated `v1_BACKEND.md` and `MASTER_PROGRESS.md` (Stage B2 marked 🟢)

**Decisions Made:**
- DEC-014: Created dedicated `/proof` route with interactive client-side RLS test component to verify data pipeline before building UI features.

**Blockers / Issues:**
- None. All data connects smoothly from Supabase and RLS security policies hold on all client write attempts.

**Next Session Plan:**
- Begin v1.0 Stage B3: Boot Loader & Entry Page
  - Build boot / loading animation
  - Build Entry / Choice page UI (`/`)
  - Add navigation routes to `/developer`, `/creative`, and `/story` (with graceful fallback/placeholder)
  - Polish layout, transitions, and basic aesthetics

---

### 2026-09-12 (Day 7) — v1.0 Frontend Foundation (B3 Complete & v1.0 Milestone)
**Stage(s):** B3 — Boot Loader & Entry Page

**Work Done:**
- Completed Stage B3 (all 5 tasks ✅)
- Installed animation dependency: `motion` (v13.2.0)
- Configured Google Fonts in root layout (`src/app/layout.tsx`):
  - `Inter` (sans-serif variable) for body/display
  - `Fira Code` (monospace variable) for terminal/code accents
- Enhanced global styling system (`src/app/globals.css`):
  - Custom scrollbars, glassmorphism utilities (`glass`, `glass-card`), glowing border gradients, scanlines, and animated mesh background
- Created `BootLoader` component (`src/components/boot-loader.tsx`):
  - Typewriter sequence displaying "Sanjay Baskar" with realistic variable typing delays and blinking cursor
  - Headline fade-in and subtle glitch animation effect
  - Interactive "Skip →" button with keyboard accessibility
  - Smooth 3-second auto-transition to the main choice page
- Refined Entry/Choice Page to a **Dual-Choice Gateway** (`src/app/entry-client.tsx`):
  - Streamlined to two primary experience choices: **Developer** (`/developer`) and **Creative** (`/creative`)
  - Third choice (Story / 3D) removed from entry cards as it will live inside the Creative experience / Phase F
  - Grid updated to balanced 2-column desktop layout (`max-width: 760px`)
- Implemented **Automatic Mobile Viewport Width Detector** (`src/lib/use-viewport-width.ts`):
  - React hook listening to window dimensions and tracking mobile breakpoint (`< 768px`)
  - SSR-safe with clean hydration
- Built **Dedicated Mobile Unsupported Screen** (`src/components/mobile-unsupported.tsx`):
  - Displays when viewport width is below 768px (phone form factor or resized window)
  - Diagnostic specs showing detected width (e.g. `390px`), required width (`≥ 768px`), and mobile scope (`Phase F`)
  - Informative copy explaining desktop requirement and quick-contact links (GitHub, LinkedIn, Email)
- Refactored `src/app/page.tsx` as a Server Component:
  - Fetches live profile data from Supabase via `getProfile()`
  - Passes name and headline down to `EntryClient`
- Verified visual presentation with headless browser subagent:
  - Boot loader typing sequence confirmed
  - 2-card desktop layout and hover physics verified
  - Mobile detector triggered at 390px and responsive placeholder verified
- Verified full production build (`npm run build`):
  - Exit code 0, all 9 routes compile cleanly
- v1.0 Backend is now fully complete (Phase A & Phase B) 🟢

**Decisions Made:**
- DEC-015: Boot Loader & Entry Page Architecture with Server Component Data Fetching, Motion Transitions, and Experience Card Layout.
- DEC-016: Dual Experience Gateway (2 Choices) & Automatic Mobile Viewport Guard.

**Blockers / Issues:**
- None. Build passes cleanly and both desktop and mobile viewports are verified.

**Next Session Plan:**
- Merge `dev` into `main` and tag `v1.0` (as required by v1.0 completion checklist and branching rules)
- Push merge and tag to GitHub
- Proceed to v2.0 Frontend Developer Style:
  - Stage C1: Developer Layout & Theme (CSS tokens, cursor)
  - Stage T1 / T2: Theming tokens and custom cursor configuration

---

### 2026-09-13 (Day 8) — Modular Sectional Styles Setup & Design Tracker Initialization
**Stage(s):** Design Architecture & Transition Tracking (Tracked via `design_tracker.md`)

**Work Done:**
- Formulated and established three distinct sectional style personas:
  - **Developer Style:** `Terminal Core` (technical, structured, monospace, telemetry-driven, cyan/emerald accents)
  - **Creative Style:** `Chromatic Canvas` (fluid glassmorphism, iridescent gradients, spatial depth, violet/pink accents)
  - **Hero Style:** `Nexus Genesis` (atmospheric, gravitational focal point, high-contrast typography, dual-spectrum glow)
- Created dedicated modular design CSS files:
  - `src/styles/terminal-core.css`
  - `src/styles/chromatic-canvas.css`
  - `src/styles/nexus-genesis.css`
- Integrated style modules into `src/app/globals.css` with Tailwind CSS v4.
- Initialized `design_tracker.md` at project root to track intermediate design transitions, custom styles, tokens, and component breakdown independently of fixed phases.
- Implemented **Dual-Theme Video Boot Loader**:
  - Replaced the typewriter intro with media-query-driven video intro (`public/port-loader/`).
  - Added CSS `@media (prefers-color-scheme: dark)` and `@media (prefers-color-scheme: light)` rules to set background to `#000000` or `#ffffff`.
  - Processed video assets using ffmpeg to strip the initial 1-second static/glitch artifact (`dark-loader-stripped.mp4` and `light-loader-stripped.mp4`).
  - Centered video relative to viewport width and height with responsive `object-contain`.
  - Added seamless `onEnded` transition and subtle theme-aware "Skip →" button.

**Decisions Made:**
- DEC-017: Established modular style architecture separating Developer (`Terminal Core`), Creative (`Chromatic Canvas`), and Hero (`Nexus Genesis`) into scoped Tailwind + CSS modules tracked in `design_tracker.md`.
- DEC-018: Implemented Dual-Theme Video Boot Loader with automatic browser `@media (prefers-color-scheme)` detection, pure black/white backdrops, and 1-second-trimmed video assets.

**Blockers / Issues:**
- None. Build passes cleanly (`npm run build`).

**Next Session Plan:**
- Proceed with user-guided intermediate design transition steps and component creation.

---

### 2026-09-15 (Day 10) — v2.0 Developer Experience (Roles Section & Lenis Smooth Scroll)
**Stage(s):** Developer Experience (`/developer`) — Roles Pinned Scroll-Reveal Section, Lenis Smooth Scroll & GSAP ScrollTrigger Integration, Fredericka the Great Typography

**Work Done:**
- Created dynamic roles data in `src/data/roles.json` with 3 roles (Frontend developer, Backend developer, ML engineer) and descriptions.
- Built `<RolesSection />` (`src/components/developer/RolesSection.tsx`):
  - GSAP ScrollTrigger-driven pinned section (`pin: true`, `pinSpacing: true`, `scrub: true`, `end: '+=300%'`) that transitions through the 3 role slides.
  - "I am" prefix stays fixed in position; only role text and description animate with a calm fade + vertical slide (`translateY ±25px`).
  - Minimalist white backdrop with high-contrast black bar accents (top-right ~65% width, bottom-left ~55% width) matching target visual mockups.
  - Integrated `prefers-reduced-motion` detection (skips pinning and renders the final slide statically if enabled).
- Added `Fredericka the Great` Google Font via `next/font/google` in `src/app/layout.tsx` and registered `--font-fredericka` via Tailwind CSS v4 `@theme inline` in `src/app/globals.css`.
- Built `<ScrollProgressBar />` (`src/components/developer/ScrollProgressBar.tsx`):
  - 3px top progress bar fixed to viewport, tracking overall page scroll progress via Lenis (`useLenis()`) with GPU-accelerated `scaleX` and `--progress-accent: #ff4d6d`.
- Integrated Lenis Smooth Scroll with GSAP ScrollTrigger in `src/components/developer/developer-smooth-scroll.tsx`:
  - Bidirectional sync: `lenis.on('scroll', ScrollTrigger.update)` forwards scroll frames to GSAP.
  - `ScrollTrigger.addEventListener('refresh', () => lenis.resize())` recalculates Lenis scroll limit when pin spacers expand document height.
- Diagnosed and resolved the scroll-freeze issue on `/developer`:
  - Root cause: `<main>` had `flex flex-col`. GSAP ScrollTrigger intentionally disables `pinSpacing` by default when the trigger's parent element is `display: flex`, resulting in `paddingBottom: 0px` on `.pin-spacer` and clamping document height to 1760px.
  - Fix: Changed `<main>` to standard block layout (`w-full min-h-screen`) and explicitly set `pinSpacing: true` on the ScrollTrigger timeline.
  - Document height properly expanded to 3950px (+2190px pin spacer).
- Verified complete scroll flow using live Chrome DevTools Protocol automation:
  - Slide 1 ("Frontend developer") at 1030px → Slide 2 ("Backend developer") at 1760px → Slide 3 ("ML engineer") at 3220px.
  - Simulated continuous mouse wheel scrolling and smooth reverse scrolling back to top.
- Updated `design_tracker.md` with Section 6 architectural guidelines on flex containers, `pinSpacing: true`, and Lenis sync for future pages.
- Built **Light Screen Inverted Color Mode** for `<RolesSection theme={theme} />`:
  - When in light mode (`theme === "light"` or system prefers-color-scheme light), inverted background to pure black (`bg-black`), accent bars to white (`bg-white`), "I am" and role title text to white (`text-white`), and description to light gray (`#d1d5db`), delivering high-contrast sectional alternation against the white Section 1.
  - In dark mode, maintains the classic white backdrop with black accent bars and black text.
  - Added smooth 500ms CSS transitions (`transition-colors duration-500`) across all elements.
  - Verified live via CDP light-mode emulation and screenshot capture (`inverted_light_screen_verified.png`).

**Decisions Made:**
- DEC-019: Roles Section Pinned Architecture — dynamic JSON-driven multi-role slides with fixed "I am" prefix, absolute stacking, and calm GSAP scroll scrubbing.
- DEC-020: Container Display Rule for Pinned Sections — always use standard block layout (`display: block`) on parent containers wrapping pinned ScrollTrigger sections to prevent GSAP from auto-disabling `pinSpacing`.
- DEC-021: Inverted Light Screen Sectional Contrast — `<RolesSection />` renders with pure black background and white accents/text when in light mode, ensuring striking visual contrast against the white hero section.

**Blockers / Issues:**
- Encountered scroll freeze where scrolling stopped at "Frontend developer". Identified that GSAP ScrollTrigger silently disables `pinSpacing` when the parent element is `display: flex`. Rectified by switching `<main>` to block flow, explicitly adding `pinSpacing: true`, and binding `lenis.resize()` to ScrollTrigger's `refresh` event.

**Next Session Plan:**
- Continue with Developer Experience section 3 / cards / telemetry components, or transition to Creative experience components as directed by user.

