# 📝 Architecture & Design Decisions Record

> Every significant decision is logged here with context, so future-you understands WHY something was chosen.

---

## Format

```
### DEC-XXX: [Decision Title]
**Date:** YYYY-MM-DD  
**Stage:** [Which stage this relates to]  
**Context:** Why this decision was needed  
**Decision:** What was decided  
**Alternatives Considered:** What else was on the table  
**Consequences:** What this means going forward  
```

---

## Decisions

---

### DEC-001: Three Major Versions as Milestones
**Date:** 2026-09-10  
**Stage:** Project Setup  
**Context:** The project has three fundamentally different concerns (backend infrastructure, Developer scroll-UI, Creative canvas-UI) that benefit from sequential focus rather than parallel development.  
**Decision:** Split into v1.0 (Backend + Foundation), v2.0 (Frontend Developer Style), v3.0 (Frontend Creative Style). Each version is a merge-to-main milestone.  
**Alternatives Considered:** Single linear build with no version milestones; feature-branch-per-experience with parallel work.  
**Consequences:** Work is sequential — v2.0 doesn't start until v1.0 is merged to main. Prevents half-built backend + half-built frontend. Forces the backend to be proven before UI work begins.

---

### DEC-002: Admin Scope Reduction
**Date:** 2026-09-10  
**Stage:** Architecture  
**Context:** Original plan had a full custom admin UI for content (bio, projects, images) AND a separate creative canvas editor.  
**Decision:** Use Supabase Studio for plain content editing. Only build a custom admin for the Creative canvas (spatial data). Removes ~1/3 of admin work.  
**Alternatives Considered:** Full custom admin for everything.  
**Consequences:** No need to build CRUD forms for profile/projects/skills. Supabase Studio handles that natively. The only custom admin is the Figma-style canvas editor.

---

### DEC-003: Adaptive Resume Scoped Inside Developer
**Date:** 2026-09-10  
**Stage:** Architecture  
**Context:** The adaptive interactive resume could be a 4th top-level experience or a mode within Developer.  
**Decision:** Keep it inside Developer at `/developer/resume`. It shares Developer's "structured, technical" identity and doesn't need its own routing subsystem.  
**Alternatives Considered:** Separate 4th top-level route.  
**Consequences:** No 4th architectural branch. Resume shares Developer's theme, layout system, and data flow patterns.

---

### DEC-004: Docker for Local Dev Only
**Date:** 2026-09-10  
**Stage:** Architecture  
**Context:** Docker could serve as both local dev environment and production runtime.  
**Decision:** Docker is for local Supabase parity only. Vercel builds from source for production. Docker is not part of the deployed runtime.  
**Alternatives Considered:** Docker-based deployment; no Docker at all (use hosted Supabase for dev too).  
**Consequences:** `docker-compose.yml` runs local Supabase (Postgres + Auth + Storage). Production uses hosted Supabase + Vercel. Simpler deployment story.

---

### DEC-005: Per-Experience Theming, Not Global
**Date:** 2026-09-10  
**Stage:** Architecture  
**Context:** The experiences could share one global color palette or each define their own.  
**Decision:** Each experience defines its own CSS custom property tokens. Developer and Creative should feel like separate worlds, not the same template recolored.  
**Alternatives Considered:** One shared global palette with accent overrides.  
**Consequences:** More CSS tokens to maintain, but stronger visual distinction between experiences. Each experience's dark/light pair is independent.

---

### DEC-006: Docker Deferred to End (Phase F)
**Date:** 2026-09-10  
**Stage:** A1 Reorder  
**Context:** Original Stage A1 started with Docker Compose to run Supabase locally. This adds setup friction on day one when the actual backend work (schema, RLS, auth, data layer) is identical whether Supabase is local or hosted.  
**Decision:** Use hosted Supabase (free tier) from the start. Defer Docker local dev parity to Phase F (post-v3), alongside deployment polish.  
**Alternatives Considered:** Docker-first as originally planned; running hosted Supabase for everything permanently.  
**Consequences:** A1 becomes a 10-minute setup (create project, grab keys, `.env.local`) instead of a Docker debugging session. Docker gets added in Phase F when everything works and offline parity actually matters.

---

### DEC-007: RLS Strategy — Deny-All Default with Public SELECT Only
**Date:** 2026-09-11  
**Stage:** A3 — Row Level Security  
**Context:** With RLS enabled, we need to decide what access pattern to use. The anon role (public visitors) should only read published content. Admin write access requires auth, which isn't set up until A4.  
**Decision:** Enable RLS on all tables (deny-all by default). Create SELECT-only policies for the `anon` role. `projects` filters on `published = true`; other tables allow all rows. No INSERT/UPDATE/DELETE policies — writes are blocked by default. Admin write policies will be added in A4 when `auth.uid()` is available.  
**Alternatives Considered:** Creating placeholder admin write policies now with a dummy UUID check; using Supabase's built-in "Enable RLS" toggle without explicit policies.  
**Consequences:** Tables are locked down from day one. The anon key can only read, never write. Unpublished projects are invisible to the public. Admin writes are impossible until A4 (by design — forces us to complete auth before any content management).

---

### DEC-008: Admin Auth — Single Hardcoded UUID, No Role Column
**Date:** 2026-09-11  
**Stage:** A4 — Auth Setup  
**Context:** We need admin write access via RLS. Options: (a) hardcode the admin's `auth.uid()` in each policy, (b) add a `role` column to a `users` table and check that, or (c) use Supabase custom claims/JWT.  
**Decision:** Hardcode the admin UUID (`428d026c-33dd-4845-a903-4831adfb7e56`) directly in all RLS policies. This is a single-user portfolio — there will only ever be one admin.  
**Alternatives Considered:** Role column in a users table (overkill for single admin); Supabase custom claims (adds JWT complexity); service_role key for all writes (bypasses RLS entirely, defeats the purpose).  
**Consequences:** Simple and secure. If the admin account is ever recreated, the UUID in all policies must be updated. No need for a users table or role management. Any other authenticated user is denied by default.

---

### DEC-009: Skip Project Thumbnails — Add During Frontend Phase
**Date:** 2026-09-11  
**Stage:** A5 — Seed Data  
**Context:** The old portfolio used CSS/canvas-generated visuals (animated bubbles, SVG badges) instead of static screenshots for project cards. Generating or capturing 18 static thumbnails would delay A5 completion with no backend value.  
**Decision:** Set `thumbnail_url` and `images` to NULL/empty for all 18 projects. Add real screenshots or generated images during the frontend build phase (v2.0) when we know exactly what format and dimensions are needed.  
**Alternatives Considered:** Generate AI placeholder thumbnails now (premature — don't know final card dimensions); manually screenshot each GitHub repo (time-consuming, low quality).  
**Consequences:** Project rows have no image data until frontend development. This is acceptable because A5's purpose is proving the data pipeline works, not producing final assets.

---

### DEC-010: Programmatic Image Upload via Node.js Script
**Date:** 2026-09-11  
**Stage:** A5 — Seed Data  
**Context:** 9 local images needed to be uploaded to the Supabase `portfolio` storage bucket. Could upload manually via Dashboard or automate with a script.  
**Decision:** Wrote `scripts/upload_images.mjs` using `@supabase/supabase-js` with the `service_role` key to upload all 9 images programmatically. Script also auto-generates `005_seed_media.sql` with the media table seed data.  
**Alternatives Considered:** Manual upload via Supabase Dashboard (not reproducible, no record of what was uploaded).  
**Consequences:** Uploads are reproducible and documented. Script can be re-run with `upsert: true` if images need updating. Media seed SQL is auto-generated with correct public URLs and file sizes.

---

### DEC-011: Hand-Written TypeScript Types (No CLI Gen)
**Date:** 2026-09-11  
**Stage:** A6 — Data Access Layer  
**Context:** Supabase offers `supabase gen types typescript` to auto-generate database types. However, the CLI needs to be linked to the project, and we only have 4 simple tables with well-documented schemas.  
**Decision:** Hand-write the TypeScript types in `src/types/database.types.ts` based on `SCHEMA_BLUEPRINT.md`. Include a full `Database` interface compatible with `createClient<Database>()`, plus separate `Row`, `Insert`, and `Update` type aliases for each table.  
**Alternatives Considered:** Auto-generate via Supabase CLI (requires project linking and CLI installation before Next.js exists — overhead with no accuracy benefit for 4 tables).  
**Consequences:** Types are version-controlled and readable. If the schema changes, types must be updated manually (but schema changes also require a migration, so this is a natural checkpoint). Can switch to auto-generation in the future if table count grows significantly.

---

### DEC-012: Injectable Supabase Client in Fetch Functions
**Date:** 2026-09-11  
**Stage:** A6 — Data Access Layer  
**Context:** Data access functions need a Supabase client. In Next.js, the client differs between Server Components (cookie-aware) and Client Components (browser-based). Outside Next.js (scripts, tests), a standalone client is needed.  
**Decision:** All fetch functions accept an optional `client` parameter. When called from Next.js, pass the server or browser client. When called standalone (scripts, tests), omit the parameter and a fallback client is created automatically using `@supabase/supabase-js`.  
**Alternatives Considered:** Separate function signatures for server vs. client; global singleton client (breaks SSR cookie handling); always require client parameter (inconvenient for scripts).  
**Consequences:** Maximum flexibility — same functions work in Server Components, Client Components, and standalone scripts. The optional parameter pattern avoids coupling to any specific runtime.

---
