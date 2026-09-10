# 📋 Portfolio Platform — Project Tracker

> **Last Updated:** 2026-09-10  
> **Current Major Version:** `v1.0 — Backend`  
> **Current Branch:** `dev`

---

## 🏗️ Versioning Strategy

This project is divided into **3 major versions**, each representing a fundamental pillar of the platform. Work proceeds sequentially — a major version is completed and merged to `main` before the next begins.

| Major Version | Focus | Status |
|---|---|---|
| **v1.0** | Backend (Supabase, Schema, Auth, Data Layer) | 🔴 Not Started |
| **v2.0** | Frontend — Developer Style (Scroll-based, Code-controlled) | 🔴 Not Started |
| **v3.0** | Frontend — Creative Style (Canvas, Figma-style, Admin-editable) | 🔴 Not Started |

### Post-v3 (Future Scope)
- Story Experience (Three.js / React Three Fiber)
- Mobile Experiences (Dedicated renderers, touch-first)
- Deployment Polish & Docker Hardening

---

## 🌿 Branching Model

```
main ← only receives merges when a major version is COMPLETE and verified
 │
 └── dev ← daily working branch, all development happens here
      │
      └── feature/* ← optional feature branches off dev for complex tasks
```

**Rules:**
- `main` is **never** pushed to directly — only merged from `dev` when a major version is done.
- `dev` is the active working branch.
- Each merge to `main` is tagged with the major version (e.g. `v1.0`, `v2.0`, `v3.0`).

---

## 📂 Tracker Documents

| File | Purpose |
|---|---|
| [`MASTER_PROGRESS.md`](./MASTER_PROGRESS.md) | High-level bird's-eye view of all phases and their status |
| [`v1_BACKEND.md`](./v1_BACKEND.md) | Detailed task tracking for v1.0 — Backend |
| [`v2_FRONTEND_DEVELOPER.md`](./v2_FRONTEND_DEVELOPER.md) | Detailed task tracking for v2.0 — Developer Frontend |
| [`v3_FRONTEND_CREATIVE.md`](./v3_FRONTEND_CREATIVE.md) | Detailed task tracking for v3.0 — Creative Frontend |
| [`DAILY_LOG.md`](./DAILY_LOG.md) | Day-by-day work log with notes, decisions, blockers |
| [`DECISIONS.md`](./DECISIONS.md) | Architecture & design decisions record |
| [`TECH_STACK.md`](./TECH_STACK.md) | Confirmed tech stack and dependency versions |

---

## ✅ Status Legend

| Icon | Meaning |
|---|---|
| 🔴 | Not Started |
| 🟡 | In Progress |
| 🟢 | Complete |
| ⏸️ | Paused / Blocked |
| 🔵 | Future Scope (not in current major version) |
