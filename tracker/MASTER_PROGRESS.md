# 🗺️ Master Progress — Portfolio Platform

> **Last Updated:** 2026-09-10

---

## v1.0 — Backend 🔴

> **Goal:** Build and prove the entire backend before any UI exists.

| Phase | Stage | Description | Status | Depends On |
|---|---|---|---|---|
| **A — Backend Foundation** | A1 | Supabase Project Setup (hosted, free tier) | 🔴 | — |
| | A2 | Core Schema Design (profile, projects, skills, media) | 🔴 | A1 |
| | A3 | Row Level Security (RLS policies) | 🔴 | A2 |
| | A4 | Auth Setup (Admin account, admin-only RLS) | 🔴 | A3 |
| | A5 | Seed Data (Real/realistic content) | 🔴 | A2, A3 |
| | A6 | Data Access Layer (typed fetch functions) | 🔴 | A5 |
| **B — Frontend Foundation** | B1 | Next.js Scaffold (routing skeleton, env vars) | 🔴 | A6 |
| | B2 | Prove Data Connection (render seeded data) | 🔴 | B1 |
| | B3 | Boot Loader & Entry Page | 🔴 | B2 |

---

## v2.0 — Frontend Developer Style 🔴

> **Goal:** Build the full Developer experience — scroll-based, code-controlled, reading from backend.

| Phase | Stage | Description | Status | Depends On |
|---|---|---|---|---|
| **C — Developer Experience** | C1 | Developer Layout & Theme (CSS tokens, cursor) | 🔴 | B3 |
| | C2 | Developer Sections (hero, projects, skills, scroll) | 🔴 | C1 |
| | C3 | Adaptive Interactive Resume (/developer/resume) | 🔴 | C2 |
| **Theming & Polish** | T1 | Dark/Light Theme Tokens (Developer) | 🔴 | C1 |
| | T2 | Custom Animated Cursor (Developer config) | 🔴 | C1 |

---

## v3.0 — Frontend Creative Style 🔴

> **Goal:** Build the Creative canvas experience and its admin editor.

| Phase | Stage | Description | Status | Depends On |
|---|---|---|---|---|
| **D — Creative Experience** | D1 | Creative Schema (creative_blocks table, RLS) | 🔴 | A6 |
| | D2 | Canvas Engine (pan, zoom, drag mechanics) | 🔴 | B3 |
| | D3 | Creative Theme, Cursor & Real Blocks | 🔴 | D1, D2 |
| **E — Admin** | E1 | Admin Auth Gate (middleware, redirect) | 🔴 | A4, B1 |
| | E2 | Creative Canvas Editor (Figma-style, layers panel) | 🔴 | D3, E1 |
| | E3 | Preview / Publish Workflow (optional) | 🔴 | E2 |

---

## Future Scope (Post-v3) 🔵

| Phase | Stage | Description | Status |
|---|---|---|---|
| **F — Story, Mobile, Deploy** | F1 | Story Experience (Three.js, R3F) | 🔵 |
| | F2 | Mobile Experiences (dedicated renderers) | 🔵 |
| | F3 | Docker Local Dev Parity (docker-compose for local Supabase) | 🔵 |
| | F4 | Deployment Polish (Vercel config, final docs) | 🔵 |

---

## Merge History

| Date | Version | Branch Merged | Tag | Notes |
|---|---|---|---|---|
| — | — | — | — | No merges yet |
