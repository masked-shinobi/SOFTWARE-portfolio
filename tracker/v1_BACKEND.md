# 🔧 v1.0 — Backend Tracker

> **Status:** 🟡 In Progress (Phase A 🟢 Complete, Phase B 🔴 Pending)  
> **Goal:** Build and prove the entire backend + frontend scaffold before building any experience UI.  
> **Merge to main when:** All stages A1–B3 are 🟢 and data renders in the frontend.

---

## Phase A — Backend Foundation

### A1. Supabase Project Setup 🟢
> **Track:** Backend | **Depends on:** Nothing

**Tasks:**
- [x] Create hosted Supabase project (free tier)
- [x] Note down API URL, `anon` key, `service_role` key
- [x] Create `.env.local` with Supabase credentials
- [x] Create `.gitignore` (node_modules, .env*, .next, etc.)
- [x] Verify Supabase Studio is accessible via dashboard

**Notes:**
- Using hosted Supabase to start — faster than configuring Docker on day one.
- Docker local dev parity is deferred to Phase F (post-v3 polish).
- No Next.js at this stage — backend only.
- Project ref: `jhrlkrkwynsucdrodxza`
- Dashboard: https://supabase.com/dashboard/project/jhrlkrkwynsucdrodxza

**Completed:** 2026-09-11  
**Blockers:** —

---

### A2. Core Schema Design 🟢
> **Track:** Backend | **Depends on:** A1

**Tasks:**
- [x] Design `profile` table (bio, headline, social_links, resume_metadata)
- [x] Design `projects` table (title, description, tech_stack, links, images[], featured)
- [x] Design `skills` table (name, category, proficiency — kept minimal)
- [x] Design `media` table (storage_ref, alt_text, type)
- [x] Write SQL migration files (not manual clicks)
- [x] Run migrations against hosted Supabase

**Notes:**
- Keep it small. `creative_blocks` and `resume_sections` come later, NOT now.
- Use SQL migration files for reproducibility.
- Blueprint saved at `tracker/SCHEMA_BLUEPRINT.md`
- Migration file created at `supabase/migrations/001_core_schema.sql`

**Completed:** 2026-09-11  
**Blockers:** —

---

### A3. Row Level Security 🟢
> **Track:** Backend | **Depends on:** A2

**Tasks:**
- [x] Enable RLS on every table
- [x] Public policy: `SELECT` only on published rows
- [x] Confirm anon key CANNOT insert, update, or delete (test via REST API)
- [x] Document RLS policies applied

**Notes:**
- Do this BEFORE writing any frontend fetch code.
- Build against real security constraints from day one.
- Migration file: `supabase/migrations/002_rls_policies.sql`
- Policies applied:
  - `profile_public_read` — SELECT for anon, all rows
  - `projects_public_read` — SELECT for anon, `published = true` only
  - `skills_public_read` — SELECT for anon, all rows
  - `media_public_read` — SELECT for anon, all rows
  - `portfolio_bucket_public_read` — SELECT on storage.objects for anon, bucket `portfolio`
- No INSERT/UPDATE/DELETE policies → RLS default deny blocks all writes for anon
- Verified via REST API: INSERT returns 401, UPDATE/DELETE return 0 rows, unpublished projects hidden

**Completed:** 2026-09-11  
**Blockers:** —

---

### A4. Auth Setup 🟢
> **Track:** Backend | **Depends on:** A3

**Tasks:**
- [x] Enable Supabase Auth (email + password)
- [x] Create admin user account
- [x] Write admin-only RLS policy checked against `auth.uid()`
- [x] Prove policy works via Studio (admin can CRUD, anon cannot)

**Notes:**
- No admin UI needed yet — just prove the policy works.
- Admin user: `maskedprogrammer.in@gmail.com`
- Admin UUID: `428d026c-33dd-4845-a903-4831adfb7e56`
- Migration file: `supabase/migrations/003_admin_rls_policies.sql`
- Policies created: 4 tables × 4 operations (SELECT, INSERT, UPDATE, DELETE) = 16 policies + 4 storage policies
- All policies check `auth.uid() = '<admin-uuid>'` — only the admin can write
- Verified via REST API: admin CRUD works, anon INSERT blocked (401), unpublished projects hidden from anon

**Completed:** 2026-09-11  
**Blockers:** —

---

### A5. Seed Data 🟢
> **Track:** Backend | **Depends on:** A2, A3

**Tasks:**
- [x] Add 2–3 real projects with full data (18 projects seeded)
- [x] Write real bio/profile content (1 profile row with full bio, headline, social links)
- [x] Upload 2+ real images to Supabase Storage (9 images uploaded via Node.js script)
- [x] Confirm images load via public Storage URL (avatar verified: HTTP 200)
- [x] Add skills data (29 skills across 6 categories)

**Notes:**
- Used REAL content migrated from old portfolio via `migration/seed_data.json`
- Project thumbnails/screenshots skipped (old site used CSS/canvas, not static images) — `thumbnail_url` set to NULL, to be added in frontend phase
- 9 images uploaded to `portfolio` bucket via `scripts/upload_images.mjs` (service_role key)
- Media table seeded with 9 rows (storage paths, public URLs, alt text, file sizes)
- Migration files: `004_seed_data.sql` (profile + projects + skills), `005_seed_media.sql` (media rows)
- All INSERT statements use `ON CONFLICT ... DO UPDATE` for safe re-runs
- UNIQUE constraint added to `skills.name` (required for ON CONFLICT)

**Completed:** 2026-09-11  
**Blockers:** —

---

### A6. Data Access Layer 🟢
> **Track:** Backend | **Depends on:** A5

**Tasks:**
- [x] Set up Supabase client (browser) configuration
- [x] Set up Supabase server (SSR) configuration
- [x] Generate TypeScript types from Supabase schema
- [x] Write `getProfile()` function
- [x] Write `getProjects()` function
- [x] Write `getSkills()` function
- [x] Write `getMedia()` function
- [x] Test all fetch functions return correct typed data

**Notes:**
- This is the seam between backend and frontend. Get it right once, both experiences reuse it.
- Hand-wrote TypeScript types from `SCHEMA_BLUEPRINT.md` — exact match to schema, no CLI overhead
- Installed `@supabase/ssr` for cookie-aware server client (Next.js App Router compatible)
- All fetch functions accept an optional `client` parameter — injectable from Next.js server/browser clients
- Additional convenience functions: `getFeaturedProjects()`, `getProjectBySlug()`, `getSkillsByCategory()`, `getMediaByType()`
- Barrel export at `src/lib/data/index.ts` for clean imports
- Verification script (`scripts/test_data_layer.ts`) — 15/15 tests passed
- Files created:
  - `src/types/database.types.ts` — Full Database interface + Row/Insert/Update types
  - `src/lib/supabase/client.ts` — Browser client (Client Components)
  - `src/lib/supabase/server.ts` — Server client (Server Components, SSR)
  - `src/lib/data/profile.ts` — `getProfile()`
  - `src/lib/data/projects.ts` — `getProjects()`, `getFeaturedProjects()`, `getProjectBySlug()`
  - `src/lib/data/skills.ts` — `getSkills()`, `getSkillsByCategory()`
  - `src/lib/data/media.ts` — `getMedia()`, `getMediaByType()`
  - `src/lib/data/index.ts` — Barrel export

**Completed:** 2026-09-11  
**Blockers:** —

---

## Phase B — Frontend Foundation

### B1. Next.js Scaffold 🟢
> **Track:** Frontend | **Depends on:** A6

**Tasks:**
- [x] Create Next.js + TypeScript + Tailwind project
- [x] Set up App Router folder structure:
  - [x] `app/page.tsx` (Entry)
  - [x] `app/developer/layout.tsx` + `page.tsx`
  - [x] `app/developer/resume/page.tsx` (placeholder)
  - [x] `app/creative/layout.tsx` + `page.tsx`
  - [x] `app/story/page.tsx` (placeholder)
  - [x] `app/admin/layout.tsx` + `page.tsx`
  - [x] `app/admin/creative/page.tsx` (placeholder)
- [x] Connect env vars to local Supabase
- [x] Set up `experiences/`, `components/`, `lib/` folder structure

**Notes:**
- Initialized Next.js 16.3.4 (App Router) with TypeScript, Tailwind CSS v4, and ESLint.
- Restored and integrated existing data access layer (`src/lib/data`, `src/lib/supabase`, `src/types`).
- Created placeholder routes for `/`, `/developer`, `/developer/resume`, `/creative`, `/story`, `/admin`, `/admin/creative`.
- Set up directory structure: `src/components/`, `src/experiences/developer/`, `src/experiences/creative/`.
- Verified production build compiles 100% cleanly (`npm run build`).
- Verified all 15 data layer tests pass (`test_data_layer.ts`).

**Completed:** 2026-09-11  
**Blockers:** —

---

### B2. Prove Data Connection 🟢
> **Track:** Frontend | **Depends on:** B1

**Tasks:**
- [x] Call `getProjects()` on a plain page (in Server Component)
- [x] Render seeded project titles as plain text
- [x] Confirm RLS blocks writes from the frontend client
- [x] Verify TypeScript types work end-to-end

**Notes:**
- Created `/proof` route (`src/app/proof/page.tsx`) as a Server Component checkpoint.
- Verified server-side data fetching via typed data access layer:
  - `profile`: 1 row (Sanjay Baskar, headline, bio, avatar, resume, social links)
  - `projects`: 18 published projects rendered with tech stack and slug metadata
  - `skills`: 29 skills rendered across 6 categories
  - `media`: 9 items rendered with public URLs and types
- Created client-side interactive test component (`src/app/proof/rls-write-test.tsx`):
  - Attempted `INSERT` with anon key: **Blocked by RLS** (`new row violates row-level security policy for table "projects"`)
  - Attempted `UPDATE` with anon key: **0 rows affected / Blocked**
  - Attempted `DELETE` with anon key: **0 rows affected / Blocked**
- Verified TypeScript types flow cleanly end-to-end (`Profile`, `Project`, `Skill`, `Media` without `any` casts in data layer).

**Completed:** 2026-09-12  
**Blockers:** —

---

### B3. Boot Loader & Entry Page 🟢
> **Track:** Frontend | **Depends on:** B2

**Tasks:**
- [x] Build boot/loading animation
- [x] Build Entry/Choice page UI (Dual Choice: `/developer`, `/creative`)
- [x] Integrate screen width / viewport detector (`< 768px`)
- [x] Dedicated Mobile Unsupported placeholder page (`MobileUnsupported`)
- [x] Basic styling, glassmorphism, and transitions

**Notes:**
- Boot Loader: Full-screen typewriter animation of portfolio owner's name with blinking cursor, headline fade-in, glitch effect, and auto-transition after ~3s. "Skip →" button in bottom-right corner.
- Entry/Choice Page: Refined to a clean **Dual-Choice Gateway** featuring two primary experience cards (Developer & Creative) side-by-side with staggered entrance, hover glow/scale effects, and dedicated accent colors (cyan for Developer, violet for Creative).
- Story experience removed from entry choices as it will live inside Creative / Phase F scope.
- Automatic Mobile Detection: Added `useViewportWidth` hook tracking mobile breakpoint (`< 768px`). When accessed on mobile devices or resized below 768px, the platform automatically presents the `MobileUnsupported` placeholder screen.
- Mobile Guard Screen: Diagnostic readout with live detected viewport width (`{width}px`), minimum required width (`≥ 768px`), explanation of desktop optimization, and quick contact links (GitHub, LinkedIn, Email).
- Dark premium aesthetic with gradient mesh background (animated orbs), grid overlay, and smooth motion transitions.
- Profile data (name, headline) fetched server-side via `getProfile()` and passed to client component.
- Files created: `src/components/boot-loader.tsx`, `src/components/experience-card.tsx`, `src/components/mobile-unsupported.tsx`, `src/lib/use-viewport-width.ts`, `src/app/entry-client.tsx`
- Files modified: `src/app/page.tsx`, `src/app/layout.tsx`, `src/app/globals.css`
- Google Fonts: Inter (sans-serif) + Fira Code (monospace) via `next/font/google`
- Production build passes cleanly (`npm run build`). Desktop and mobile viewports visually verified.

**Completed:** 2026-09-12  
**Blockers:** —

---

## v1.0 Completion Checklist

- [x] All Phase A stages (A1–A6) are 🟢
- [x] All Phase B stages (B1–B3) are 🟢
- [x] Data flows from Supabase → Data Layer → Frontend correctly
- [x] RLS is enforced and tested
- [x] Auth works for admin operations
- [x] Entry page routes to all experiences
- [x] `dev` branch merged to `main` and tagged `v1.0`
