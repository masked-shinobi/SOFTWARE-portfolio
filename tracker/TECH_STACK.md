# 🛠️ Tech Stack & Dependencies

> Confirmed technology choices and version constraints for the project.  
> **Last Updated:** 2026-09-12

---

## Core Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | Next.js (App Router) | File-based routing, SSR/SSG, Server Components |
| **Language** | TypeScript | Type safety across frontend + backend types |
| **UI Library** | React | Component model |
| **Styling** | Tailwind CSS | Utility-first CSS framework |
| **Animation** | Motion (Framer Motion) | Smooth animations, cursor, transitions |
| **Theming** | next-themes | Dark/light mode toggle, system preference, persistence |

---

## Backend

| Technology | Purpose |
|---|---|
| **Supabase** | PostgreSQL database, Auth, Storage, Row Level Security |
| **Supabase Studio** | Admin interface for plain content editing (bio, projects, skills) |

---

## DevOps & Infrastructure

| Technology | Purpose |
|---|---|
| **Vercel** | Production deployment (builds from source) |
| **Git / GitHub** | Source control |

---

## Future (Post-v3)

| Technology | Purpose | When |
|---|---|---|
| **Docker / Docker Compose** | Local Supabase environment (dev parity, offline dev) | Phase F |
| **Three.js** | 3D rendering for Story experience | Phase F |
| **React Three Fiber (R3F)** | React bindings for Three.js | Phase F |

---

## Installed Versions

> Fill in actual versions as packages are installed.

| Package | Version | Installed In |
|---|---|---|
| next | 16.3.4 | B1 |
| react | 19.2.8 | B1 |
| typescript | 5.x | B1 |
| tailwindcss | 4.x | B1 |
| motion | 13.2.0 | B3 |
| next-themes | — | — |
| @supabase/supabase-js | 2.116.0 | A6 |
| @supabase/ssr | 0.12.7 | A6 |
| supabase (CLI) | — | — |
| docker | — | — |
| node | — | — |

---

## Key Architecture Constraints

1. **Shared backend, independent frontends** — Developer and Creative read from the same Supabase tables but render completely differently.
2. **Server Components for Developer** — SEO-relevant, read-only content benefits from SSR.
3. **Client Components for Creative** — Canvas interactions (pan/zoom/drag) and future Three.js need full client-side rendering.
4. **No SSR for spatial/3D content** — SSR adds friction, not value, for drag/zoom/pan or WebGL scenes.
5. **RLS is the security boundary** — The hidden `/admin` route is a UX convenience; real security is Supabase Auth + RLS.
