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
**Stage(s):** A1 — Supabase Project Setup

**Work Done:**
- Completed Stage A1 (all 5 tasks ✅)
- Created hosted Supabase project (free tier, ref: `jhrlkrkwynsucdrodxza`)
- Noted API URL, anon key, and service_role key
- Created `.env.local` with standard Next.js Supabase env var naming (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`)
- Verified `.gitignore` already covers all needed patterns (node_modules, .env*, .next, etc.)
- Verified Supabase project is live and responding (API returns auth-gated responses, not DNS/timeout errors)
- Updated `v1_BACKEND.md` — A1 marked 🟢
- Updated `MASTER_PROGRESS.md` — A1 row updated to 🟢

**Decisions Made:**
- Used base URL format (`https://xxx.supabase.co`) for `NEXT_PUBLIC_SUPABASE_URL` — this is what `@supabase/supabase-js` expects (it appends `/rest/v1/`, `/auth/v1/`, etc. internally)

**Blockers / Issues:**
- None

**Next Session Plan:**
- Begin v1.0 Stage A2: Core Schema Design
  - Design `profile`, `projects`, `skills`, `media` tables
  - Write SQL migration files
  - Run migrations against hosted Supabase

---
