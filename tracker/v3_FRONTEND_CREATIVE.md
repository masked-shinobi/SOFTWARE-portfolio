# 🎨 v3.0 — Frontend Creative Style Tracker

> **Status:** 🔴 Not Started  
> **Goal:** Build the Creative canvas experience (Figma-style, pan/zoom/drag) and the custom admin editor for spatial content.  
> **Merge to main when:** All stages D1–D3, E1–E3 are 🟢 and the Creative experience + admin editor is complete.

---

## Phase D — Creative Experience

### D1. Creative Schema 🔴
> **Track:** Backend | **Depends on:** A6 (v1.0)

**Tasks:**
- [ ] Design `creative_blocks` table:
  - [ ] `type` (text / image / project / gallery / video / 3d / custom)
  - [ ] `content_ref` (reference to content)
  - [ ] `x`, `y` (position)
  - [ ] `width`, `height` (dimensions)
  - [ ] `rotation` (degrees)
  - [ ] `z_index` (layering)
  - [ ] `visibility` (boolean)
  - [ ] `canvas_page` (for multi-page canvas)
- [ ] Write SQL migration
- [ ] Apply RLS: public `SELECT`, admin full CRUD
- [ ] Seed with placeholder creative blocks
- [ ] Add `getCreativeBlocks()` to data access layer
- [ ] Generate updated TypeScript types

**Notes:**
- Do this small backend addition right before it's needed, not back in Phase A.
- Schema shape will be refined as the canvas engine is built.

**Completed:** —  
**Blockers:** —

---

### D2. Canvas Engine 🔴
> **Track:** Frontend | **Depends on:** B3 (v1.0)

**Tasks:**
- [ ] Build base canvas container component
- [ ] Implement pan interaction (click + drag canvas background)
- [ ] Implement zoom interaction (scroll wheel / pinch)
- [ ] Implement block drag interaction (click + drag blocks)
- [ ] Render placeholder rectangles at fixed positions
- [ ] Coordinate system (world coordinates vs screen coordinates)
- [ ] Viewport bounds and constraints
- [ ] Performance: use transforms, avoid layout recalculation
- [ ] Minimap or navigation indicator (optional, nice-to-have)

**Notes:**
- Prove the interaction model with placeholders BEFORE connecting real data.
- Almost entirely client components — SSR adds friction, not value here.

**Completed:** —  
**Blockers:** —

---

### D3. Creative Theme, Cursor & Real Blocks 🔴
> **Track:** Frontend | **Depends on:** D1, D2

**Tasks:**
- [ ] Design Creative dark theme CSS tokens (`--creative-bg`, `--creative-accent`, etc.)
- [ ] Design Creative light theme CSS tokens
- [ ] Wire `next-themes` for Creative scope
- [ ] Custom cursor: Creative config (larger, magnetic hover toward blocks)
- [ ] Fetch real `creative_blocks` from Supabase
- [ ] Build block type renderers:
  - [ ] Text block renderer
  - [ ] Image block renderer
  - [ ] Project block renderer (links to project data)
  - [ ] Gallery block renderer
  - [ ] Video block renderer (future-ready)
- [ ] Render positioned blocks on canvas from real data
- [ ] Block hover/focus states
- [ ] Canvas feels like its own world, visually distinct from Developer

**Notes:**
- This is where Creative starts to feel like a separate world.
- Each block reads content from the shared backend, rendered spatially.

**Completed:** —  
**Blockers:** —

---

## Phase E — Admin

### E1. Admin Auth Gate 🔴
> **Track:** Backend + Frontend | **Depends on:** A4 (v1.0), B1 (v1.0)

**Tasks:**
- [ ] Supabase Auth session check in Next.js middleware
- [ ] Redirect unauthenticated visitors away from `/admin`
- [ ] Admin login page / flow
- [ ] Confirm hidden `/admin` route is NOT the security boundary (RLS is)
- [ ] Test: authenticated user can access `/admin`
- [ ] Test: unauthenticated user is redirected

**Notes:**
- Content editing (bio, projects, images) happens in Supabase Studio — no custom UI.
- The only custom admin surface is the Creative canvas editor.

**Completed:** —  
**Blockers:** —

---

### E2. Creative Canvas Editor 🔴
> **Track:** Frontend | **Depends on:** D3, E1

**Tasks:**
- [ ] Build `/admin/creative` route
- [ ] Layers panel (list of blocks, reorder, select)
- [ ] Properties panel:
  - [ ] x, y position inputs
  - [ ] width, height inputs
  - [ ] rotation input
  - [ ] visibility toggle
  - [ ] z-index control
- [ ] Add new block (with type selector)
- [ ] Delete block (with confirmation)
- [ ] Duplicate block
- [ ] Drag to move blocks (saves to DB)
- [ ] Drag to resize blocks (saves to DB)
- [ ] Save changes to `creative_blocks` table
- [ ] Undo/redo (nice-to-have, optional first pass)
- [ ] Visual feedback: selected block highlight, resize handles

**Notes:**
- This is the ONE thing Supabase Studio can't give you — spatial data needs a visual editor.
- Figma-style interaction paradigm.

**Completed:** —  
**Blockers:** —

---

### E3. Preview / Publish Workflow 🔴 (Optional)
> **Track:** Frontend | **Depends on:** E2

**Tasks:**
- [ ] Add `draft` boolean to `creative_blocks` (if useful)
- [ ] Preview toggle in the editor (see draft vs published)
- [ ] Publish action (mark blocks as published)
- [ ] Public frontend only shows published blocks

**Notes:**
- Skip this entirely if direct-save is good enough for a personal site.
- Decision to build this will be made when reaching this stage.

**Completed:** —  
**Blockers:** —

---

## v3.0 Completion Checklist

- [ ] `creative_blocks` schema designed, migrated, seeded
- [ ] Canvas engine: pan, zoom, drag all working smoothly
- [ ] Creative theme (dark/light) is distinct from Developer
- [ ] Custom cursor with Creative config (magnetic hover)
- [ ] All block types render real data on canvas
- [ ] Admin auth gate locks `/admin` behind Supabase Auth
- [ ] Creative canvas editor: add, edit, delete, move, resize blocks
- [ ] Changes in editor persist to database
- [ ] Public Creative experience reads from `creative_blocks`
- [ ] `dev` branch merged to `main` and tagged `v3.0`
