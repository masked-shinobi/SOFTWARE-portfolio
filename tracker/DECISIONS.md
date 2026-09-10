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
