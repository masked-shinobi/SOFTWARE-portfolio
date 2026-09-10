# Interactive Dual/Triple-Experience Portfolio Platform
## Master Architecture & Build Plan

**Core principle for the whole project:** Shared backend, independent frontend experiences. Not one giant frontend that conditionally changes everything.

---

## 1. Concept Overview

The site is not a conventional single-page portfolio. It is an **Entry Point → multiple independently-designed experiences**, all reading from one centralized data source.

```
                         MY PORTFOLIO
                              │
              ┌───────────────┼───────────────┐
              │               │               │
              ▼               ▼               ▼
         DEVELOPER         CREATIVE         STORY
              │               │               │
        Technical UI      Visual Canvas     Future
        (scroll-based,    (Figma-style      Narrative
        code-controlled)  spatial canvas,   (Three.js /
                           admin-editable)   React Three
                                             Fiber, WebGL)
```

- **Developer** — conventional-ish scroll UI, but visually distinct. Structure controlled entirely in code, not admin-editable. Reads content from the backend.
- **Creative** — Figma-inspired spatial canvas. Pan/zoom/drag exploration of positioned blocks. Fully admin-editable (position, size, layers, content).
- **Story** — future immersive Three.js/React Three Fiber narrative experience. Route exists from day one as a placeholder; nothing built yet.
- **Adaptive Interactive Resume** — **not** a fourth top-level experience. It's a mode/section inside the Developer experience (e.g. `/developer/resume` or a resume panel within Developer) that adapts based on viewer context (recruiter view vs deep-dive vs print/export). Decided to keep it scoped inside Developer rather than adding a fourth architectural branch, since it shares Developer's "structured, technical" identity and doesn't need its own routing subsystem.

---

## 2. What Changed From the Original Brief

| Addition | Decision |
|---|---|
| Mobile version | Confirmed later phase (Stage 11), separate rendering logic per experience, not a shrunk desktop layout |
| Story mode (Three.js) | Confirmed later phase (Stage 10), placeholder route exists from Stage 1 |
| Adaptive interactive resume | New — lives *inside* Developer experience, not a separate top-level route |
| Dockerize | Local dev parity only. Vercel remains the deployment target; Docker is not the production runtime |
| Dark/light theme | New — CSS variable tokens + `next-themes`, scoped per-experience |
| Animated custom cursor | New — one reusable component, different visual config per experience |
| Admin scope | Reduced — see Section 6 |

---

## 3. Experience Design Language

| | Developer | Creative | Story |
|---|---|---|---|
| Feel | Technical, structured, precise | Visual, spatial, expressive | Immersive, emotional, narrative |
| Navigation | Vertical scroll | Pan / zoom / drag canvas | Camera-driven / scroll-triggered 3D |
| Editable via admin | No (code-controlled) | Yes (full visual editor) | Not yet — future |
| Cursor | Small, precise (e.g. dot/crosshair) | Larger, magnetic to blocks | TBD later |
| Theme tokens | Own dark/light palette | Own dark/light palette | Own palette (later) |

Each experience defines its **own** color tokens rather than sharing one global theme — they should feel like separate worlds unified by the same person, not the same template recolored.

---

## 4. Data vs Rendering (core architectural rule)

Content lives once in Supabase. Each experience renders it differently.

```
                     SAME DATA (Supabase)
                        │
              ┌─────────┴─────────┐
              │                   │
              ▼                   ▼
       DEVELOPER RENDERER   CREATIVE RENDERER
              │                   │
              ▼                   ▼
       Technical Project     Visual Canvas
       Card                  Object
```

Example: a `projects` row has `title, description, images, links, technologies, metadata`. Developer renders it as a structured card in a grid. Creative renders the same row as a positioned, draggable canvas object using separately-stored `x, y, width, height, rotation, layer` values.

---

## 5. Centralized Backend (Supabase)

```
                    SUPABASE
                       │
          ┌────────────┼────────────┐
          │            │            │
       Content       Assets       Layout
          │            │            │
       Projects      Images      Creative
       Bio           Videos      Block
       Skills        Media       Positions
```

### Rough schema sketch (design incrementally, don't over-build up front)

- `profile` — bio, headline, social links, resume metadata
- `projects` — title, description, tech stack, links, images[], featured flag
- `skills` — name, category, proficiency (optional, keep minimal)
- `creative_blocks` — type (text/image/project/gallery/video/3d/custom), content_ref, x, y, width, height, rotation, z_index, visibility, canvas_page
- `media` — Supabase Storage references, alt text, type
- `resume_sections` (for the adaptive resume mode) — section type, content, visibility rules (e.g. "show in recruiter mode")

Row Level Security: public role = `SELECT` only on published content. Admin role = full CRUD, gated by Supabase Auth + RLS policies checked against `auth.uid()`.

---

## 6. Admin — Simplified (this is the key scope reduction)

Original plan proposed a full custom "Backend Edit" admin UI for bio/projects/images alongside a custom "Frontend Edit" (Creative) editor. That duplicates what Supabase already provides.

**Simplified approach:**

```
                    ADMIN
                      │
            ┌─────────┴─────────┐
            │                   │
      CREATIVE EDITOR      SUPABASE STUDIO
      (custom-built,       (use as-is — table
      Figma-style)         editor + storage
            │              browser, no custom
            │              build needed)
            └─────────┬─────────┘
                      │
                      ▼
                   SUPABASE
```

- **Plain content** (bio, project text, skills, links, image uploads) → managed directly in **Supabase Studio**. It already has a full table editor and storage browser. Building a custom UI to edit rows Supabase already exposes is wasted effort.
- **Creative canvas layout** (position, size, rotation, layering, visibility of blocks) → this is the *only* thing that genuinely needs a custom admin, because spatial data isn't meaningfully editable in a table view. Build the Figma-inspired editor described in the original brief (Section 4) for this and only this.
- The Developer page and the adaptive resume mode remain code-controlled, never admin-editable, as originally specified.

This removes roughly a third of the originally scoped admin work and lets you get to a working product faster.

### Access model (unchanged from original brief)

- Public frontend: read-only against Supabase.
- Admin (custom Creative editor + Supabase Studio): authenticated read/write.
- Hidden `/admin` route is a UX convenience, not a security boundary — real security is Supabase Auth + RLS.

---

## 7. Theming (dark/light)

- CSS custom properties define color tokens per experience (`--dev-bg`, `--dev-accent`, `--creative-bg`, etc.), scoped at each experience's root layout.
- `next-themes` handles persistence + system preference detection + the toggle itself.
- Each experience's light/dark pair is designed independently rather than one global palette applied everywhere — keeps Developer and Creative visually distinct in both modes.

## 8. Custom Animated Cursor

- One reusable `<CustomCursor />` client component: tracks pointer position via `pointermove`, animates with Motion (transform-only, GPU-friendly, no layout thrashing).
- Mounted per-experience layout (not globally) with a config prop controlling size, shape, and behavior (e.g. Developer = small precise dot/crosshair; Creative = larger cursor that can "magnetize" toward canvas blocks on hover).
- Disabled automatically on touch devices (mobile phase).

---

## 9. Proposed Stack

**Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS, Motion
**Backend:** Supabase (PostgreSQL, Storage, Auth, Row Level Security)
**Future 3D:** Three.js, React Three Fiber
**Local dev:** Docker Compose running Supabase locally (Postgres + Auth + Storage emulated) for dev/prod parity
**Deployment:** Vercel (builds from source — Docker is not involved in the deployed runtime)
**Source control:** GitHub

### Why Next.js specifically fits this project

- File-based routing cleanly isolates `/developer`, `/creative`, `/story`, `/admin` as independent trees.
- Server Components suit Developer's read-only, SEO-relevant content — fast, no client waterfall.
- Middleware handles admin auth gating at the routing layer.
- Caveat: don't force server/client discipline everywhere. Creative's canvas and Story's WebGL scene should be almost entirely client components — SSR adds friction, not value, for drag/zoom/pan or Three.js scenes.

### Why Docker here specifically

Vercel builds from source, not from a Docker image, so Docker's role is **local environment parity**: a `docker-compose.yml` running Supabase's local stack so development matches production without touching the host machine's Postgres install. If self-hosting is considered later instead of Vercel, Docker's role would expand to production runtime — out of scope for now per your answer.

---

## 10. Routing Structure

```
/                    → Entry / Choice Page (boot loader → animation → entry)
/developer           → Developer Experience
/developer/resume    → Adaptive Interactive Resume (mode within Developer)
/creative             → Creative Experience (canvas)
/story                → Story Experience (placeholder for now)
/admin                → Private Admin (auth-gated)
/admin/creative       → Creative Canvas Editor (custom, Figma-style)
```

(No custom `/admin/content` — that's replaced by Supabase Studio, per Section 6.)

---

## 11. Code Organization

```
app/
├── page.tsx                 (Entry page)
├── developer/
│   ├── layout.tsx           (Developer theme + cursor config)
│   ├── page.tsx
│   └── resume/
├── creative/
│   ├── layout.tsx           (Creative theme + cursor config)
│   └── page.tsx
├── story/
│   └── page.tsx             (placeholder)
└── admin/
    ├── layout.tsx           (auth gate)
    ├── page.tsx
    └── creative/            (canvas editor)

experiences/
├── developer/                (Developer-specific components, renderers)
├── creative/                 (Creative-specific components, canvas engine)
└── story/                    (future Three.js scene components)

components/
├── cursor/                   (shared CustomCursor component)
├── theme/                    (theme provider, tokens)
└── ui/                       (shared primitives, used sparingly — avoid forcing shared UI across experiences)

lib/
├── supabase/                 (client, server, types)
└── data/                     (data-fetching functions, shared between renderers)
```

Developer, Creative, and Story renderers stay decoupled — they can each import shared data-fetching functions from `lib/data`, but should not share layout/presentation components with each other.

---

## 12. Explicit Non-Goals

- No generic portfolio template look.
- No identical scroll structure reused across all three experiences.
- No giant monolithic component.
- No hardcoded Creative content — it must come from `creative_blocks`.
- No admin editor for the Developer page or the adaptive resume.
- No custom admin UI for plain content — Supabase Studio handles that.
- No Three.js outside the Story experience.
- No mobile-as-shrunk-desktop.
- No building Story, mobile, or the full Creative editor before the core (Developer + Creative desktop + backend) actually works.

---

## 13. Build Stages (updated)

1. **Foundation** — Next.js + TypeScript + routing skeleton, Entry page, Developer page, Creative page, Story placeholder route.
2. **Developer experience** — full build, code-controlled, reads static/placeholder data first.
3. **Creative canvas** — pan/zoom/drag engine, block rendering, placeholder data first.
4. **Theming & cursor** — dark/light tokens per experience, `next-themes`, custom cursor component with per-experience config.
5. **Supabase integration** — schema creation, Docker Compose local dev setup, connect Developer + Creative to real data.
6. **Auth & admin shell** — Supabase Auth, RLS policies, `/admin` route gating.
7. **Creative visual editor** — the Figma-style canvas editor (layers, properties panel, drag/resize/reorder).
8. **Adaptive resume mode** — build within Developer, define visibility/section rules.
9. **Preview/publish workflow** — if useful, draft vs published state for Creative blocks.
10. **Story experience** — Three.js / React Three Fiber build-out.
11. **Mobile experiences** — dedicated (not shrunk) Developer and Creative mobile renderers, touch-first Creative interactions (pinch-zoom, tap, double-tap focus).
12. **Docker dev-parity hardening & deployment polish** — finalize local Supabase Docker setup, Vercel deployment config.

---

## 14. Open Decisions (revisit when you get there)

- Exact `creative_blocks` schema shape (finalize once you're building the canvas engine, not before).
- Whether the adaptive resume needs its own visibility-rule engine or can start as static toggled sections.
- Draft/preview/publish — worth building, or is direct-save sufficient for a personal site?
- Story experience's actual narrative structure — write this out separately when you reach Stage 10.
