# 🖥️ v2.0 — Frontend Developer Style Tracker

> **Status:** 🔴 Not Started  
> **Goal:** Build the full Developer experience — scroll-based, structured, code-controlled, reading real data from backend.  
> **Merge to main when:** All stages C1–C3, T1–T2 are 🟢 and the Developer experience is complete.

---

## Phase C — Developer Experience

### C1. Developer Layout & Theme 🔴
> **Track:** Frontend | **Depends on:** B3 (v1.0)

**Tasks:**
- [ ] Create Developer-specific `layout.tsx`
- [ ] Design Developer dark theme CSS token set (`--dev-bg`, `--dev-accent`, `--dev-text`, etc.)
- [ ] Design Developer light theme CSS token set
- [ ] Wire up `next-themes` for Developer scope
- [ ] Add theme toggle component (Developer-styled)
- [ ] Implement `<CustomCursor />` with Developer config (small, precise dot/crosshair)
- [ ] Verify cursor disables on touch devices
- [ ] Verify theme persistence across page reloads

**Notes:**
- Developer has its OWN color palette — it should NOT share tokens with Creative.
- Prove theming + cursor on Developer first, then replicate pattern for Creative in v3.0.

**Completed:** —  
**Blockers:** —

---

### C2. Developer Sections 🔴
> **Track:** Frontend | **Depends on:** C1

**Tasks:**
- [ ] Hero section (name, headline, social links from `profile`)
- [ ] About / Bio section (from `profile`)
- [ ] Projects section — technical cards rendered from `getProjects()` data
  - [ ] Project card component (title, description, tech stack badges, links, images)
  - [ ] Featured projects highlighted
  - [ ] Grid/list layout
- [ ] Skills section — rendered from `getSkills()` data
  - [ ] Categorized display
  - [ ] Visual proficiency indicators (if applicable)
- [ ] Case studies / deep-dive section (if applicable)
- [ ] Contact / footer section
- [ ] Smooth scroll navigation
- [ ] Scroll-triggered animations / micro-interactions
- [ ] Section transitions

**Notes:**
- Structure is code-controlled — NOT admin-editable by design.
- All content reads from the data access layer (backend), not hardcoded.

**Completed:** —  
**Blockers:** —

---

### C3. Adaptive Interactive Resume 🔴
> **Track:** Frontend | **Depends on:** C2

**Tasks:**
- [ ] Create `/developer/resume` route
- [ ] Add `resume_sections` table to backend (if needed)
  - [ ] Section type, content, visibility rules
  - [ ] RLS policies for resume_sections
- [ ] Build resume layout component
- [ ] Implement view modes:
  - [ ] Default / full view
  - [ ] Recruiter view (condensed, key highlights)
- [ ] Simple visibility toggle logic between modes
- [ ] Print / export-friendly styling (CSS `@media print`)
- [ ] Navigation between resume and main Developer experience

**Notes:**
- Lives INSIDE Developer, not a separate top-level route.
- Start with static toggled sections — don't build a rules engine yet.
- Share Developer's "structured, technical" identity.

**Completed:** —  
**Blockers:** —

---

## Theming & Polish

### T1. Dark/Light Theme Tokens (Developer) 🔴
> **Track:** Frontend | **Depends on:** C1

**Tasks:**
- [ ] Finalize Developer dark palette (colors, backgrounds, borders, shadows)
- [ ] Finalize Developer light palette
- [ ] Test all components in both themes
- [ ] Verify no hard-coded colors remain
- [ ] Test system-preference detection

**Completed:** —  
**Blockers:** —

---

### T2. Custom Animated Cursor (Developer) 🔴
> **Track:** Frontend | **Depends on:** C1

**Tasks:**
- [ ] Implement pointer-tracking with `pointermove`
- [ ] Motion animation (transform-only, GPU-friendly)
- [ ] Developer config: small, precise dot/crosshair
- [ ] Hover state changes on interactive elements
- [ ] Touch device detection and auto-disable
- [ ] Performance validation (no layout thrashing)

**Completed:** —  
**Blockers:** —

---

## v2.0 Completion Checklist

- [ ] Developer layout with own theme is complete
- [ ] All Developer sections render real data from backend
- [ ] Dark/light theme works correctly and persists
- [ ] Custom cursor works with Developer config
- [ ] Adaptive resume has at least 2 view modes
- [ ] Smooth scroll and micro-interactions are polished
- [ ] No hardcoded content — everything from data layer
- [ ] Responsive (desktop-first, reasonable on tablet)
- [ ] `dev` branch merged to `main` and tagged `v2.0`
