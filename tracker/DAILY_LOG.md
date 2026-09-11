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
**Stage(s):** A1 — Supabase Project Setup, A2 — Core Schema Design, A3 — Row Level Security

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
- Updated `v1_BACKEND.md` — A1, A2, and A3 marked 🟢
- Updated `MASTER_PROGRESS.md` — A1, A2, and A3 marked 🟢

**Decisions Made:**
- Used base URL format (`https://xxx.supabase.co`) for `NEXT_PUBLIC_SUPABASE_URL`
- Created dedicated `tracker/SCHEMA_BLUEPRINT.md` as the single source of truth and data preparation guide for Stage A5
- DEC-007: RLS strategy — deny-all default with public SELECT policies; admin write access deferred to A4

**Blockers / Issues:**
- None

**Next Session Plan:**
- Begin v1.0 Stage A4: Auth Setup (Admin account, admin-only RLS)
  - Enable Supabase Auth (email + password)
  - Create admin user account
  - Write admin-only RLS policy checked against `auth.uid()`
  - Prove policy works (admin can CRUD, anon cannot)

---
