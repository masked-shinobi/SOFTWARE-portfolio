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
