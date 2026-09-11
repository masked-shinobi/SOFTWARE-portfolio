# 🔧 v1.0 — Backend Tracker

> **Status:** 🔴 Not Started  
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

### A2. Core Schema Design 🔴
> **Track:** Backend | **Depends on:** A1

**Tasks:**
- [ ] Design `profile` table (bio, headline, social_links, resume_metadata)
- [ ] Design `projects` table (title, description, tech_stack, links, images[], featured)
- [ ] Design `skills` table (name, category, proficiency — kept minimal)
- [ ] Design `media` table (storage_ref, alt_text, type)
- [ ] Write SQL migration files (not manual clicks)
- [ ] Run migrations against local Supabase

**Notes:**
- Keep it small. `creative_blocks` and `resume_sections` come later, NOT now.
- Use SQL migration files for reproducibility.

**Completed:** —  
**Blockers:** —

---

### A3. Row Level Security 🔴
> **Track:** Backend | **Depends on:** A2

**Tasks:**
- [ ] Enable RLS on every table
- [ ] Public policy: `SELECT` only on published rows
- [ ] Confirm anon key CANNOT insert, update, or delete (test via Studio SQL)
- [ ] Document RLS policies applied

**Notes:**
- Do this BEFORE writing any frontend fetch code.
- Build against real security constraints from day one.

**Completed:** —  
**Blockers:** —

---

### A4. Auth Setup 🔴
> **Track:** Backend | **Depends on:** A3

**Tasks:**
- [ ] Enable Supabase Auth (email + password)
- [ ] Create admin user account
- [ ] Write admin-only RLS policy checked against `auth.uid()`
- [ ] Prove policy works via Studio (admin can CRUD, anon cannot)

**Notes:**
- No admin UI needed yet — just prove the policy works.

**Completed:** —  
**Blockers:** —

---

### A5. Seed Data 🔴
> **Track:** Backend | **Depends on:** A2, A3

**Tasks:**
- [ ] Add 2–3 real projects with full data
- [ ] Write real bio/profile content
- [ ] Upload 2+ real images to Supabase Storage
- [ ] Confirm images load via public Storage URL
- [ ] Add skills data

**Notes:**
- Use REAL content where possible. Lorem ipsum makes later frontend decisions harder.

**Completed:** —  
**Blockers:** —

---

### A6. Data Access Layer 🔴
> **Track:** Backend | **Depends on:** A5

**Tasks:**
- [ ] Set up Supabase client (browser) configuration
- [ ] Set up Supabase server (SSR) configuration
- [ ] Generate TypeScript types from Supabase schema
- [ ] Write `getProfile()` function
- [ ] Write `getProjects()` function
- [ ] Write `getSkills()` function
- [ ] Write `getMedia()` function
- [ ] Test all fetch functions return correct typed data

**Notes:**
- This is the seam between backend and frontend. Get it right once, both experiences reuse it.

**Completed:** —  
**Blockers:** —

---

## Phase B — Frontend Foundation

### B1. Next.js Scaffold 🔴
> **Track:** Frontend | **Depends on:** A6

**Tasks:**
- [ ] Create Next.js + TypeScript + Tailwind project
- [ ] Set up App Router folder structure:
  - [ ] `app/page.tsx` (Entry)
  - [ ] `app/developer/layout.tsx` + `page.tsx`
  - [ ] `app/developer/resume/page.tsx` (placeholder)
  - [ ] `app/creative/layout.tsx` + `page.tsx`
  - [ ] `app/story/page.tsx` (placeholder)
  - [ ] `app/admin/layout.tsx` + `page.tsx`
  - [ ] `app/admin/creative/page.tsx` (placeholder)
- [ ] Connect env vars to local Supabase
- [ ] Set up `experiences/`, `components/`, `lib/` folder structure

**Notes:**
- Every route just shows its name on a blank page at this point.
- Pure scaffold, no visual design.

**Completed:** —  
**Blockers:** —

---

### B2. Prove Data Connection 🔴
> **Track:** Frontend | **Depends on:** B1

**Tasks:**
- [ ] Call `getProjects()` on a plain page
- [ ] Render seeded project titles as plain text
- [ ] Confirm RLS blocks writes from the frontend client
- [ ] Verify TypeScript types work end-to-end

**Notes:**
- This is a CHECKPOINT, not a feature.
- Once real data renders anywhere, Phase A is proven end-to-end.

**Completed:** —  
**Blockers:** —

---

### B3. Boot Loader & Entry Page 🔴
> **Track:** Frontend | **Depends on:** B2

**Tasks:**
- [ ] Build boot/loading animation
- [ ] Build Entry/Choice page UI
- [ ] Add links to `/developer`, `/creative`, `/story`
- [ ] Story link gracefully handles 404 / placeholder state
- [ ] Basic styling and transitions

**Notes:**
- Keep animation simple at first, polish later once everything works.

**Completed:** —  
**Blockers:** —

---

## v1.0 Completion Checklist

- [ ] All Phase A stages (A1–A6) are 🟢
- [ ] All Phase B stages (B1–B3) are 🟢
- [ ] Data flows from Supabase → Data Layer → Frontend correctly
- [ ] RLS is enforced and tested
- [ ] Auth works for admin operations
- [ ] Entry page routes to all experiences
- [ ] `dev` branch merged to `main` and tagged `v1.0`
