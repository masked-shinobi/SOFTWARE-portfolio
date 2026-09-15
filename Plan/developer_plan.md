# 📐 Developer Experience — 1st Pager Section Plan (`developer_plan.md`)

> **Scope:** Architecture, UI layout, GSAP morph orchestration, and component breakdown for the **1st Pager Section** (Developer Bento Landing) of the Developer Experience (`/developer`).  
> **Status:** 🟢 Complete & Verified in Browser — Layout, uniform resolution scaling, route gating, and GSAP morph transition fully validated.  
> **Design Targets:** Light Mode & Dark Mode reference designs (`public/developer-experience/targeted page design/`).  
> **Target Folder:** `Plan/developer_plan.md`  
> **Tracker Link:** Referenced alongside [`design_tracker.md`](file:///d:/SEMESTER%20-%207/PORTFOLIO%20SOFTWARE/design_tracker.md) and [`tracker/v2_FRONTEND_DEVELOPER.md`](file:///d:/SEMESTER%20-%207/PORTFOLIO%20SOFTWARE/tracker/v2_FRONTEND_DEVELOPER.md).

---

## 1. Vision & Core Objectives

1. **1st Pager Section Landing:**
   The developer page is a continuous scrolling experience divided into cohesive sectional designs. The **1st Pager Section** is the high-impact executive bento hub that greets the visitor upon entering Developer Mode.
2. **GSAP Choice-to-Grid Morph Concept:**
   Instead of a static page jump, GSAP will orchestrate a signature transition: the full-screen **Choice Screen** (`<ChoiceScreen />`) will smoothly, slowly compress, scale down, and dock directly into **Grid Card #1** (top-left) of the Bento layout, while the remaining cards elegantly cascade into view. Direct URL visits will gracefully render the docked state with an entrance stagger.
3. **Reusable Component Architecture (shadcn/ui + Radix):**
   Strict adherence to the principle: **Never invent ad-hoc designs when established, battle-tested UI primitives exist**. We utilize shadcn/ui components (`Card`, `Badge`, `Button`, `Dialog`/`Sheet`, `Tabs`, `Tooltip`, `Separator`, `Toast`) styled with our scoped `terminal-core.css` tokens.
4. **Adaptive Dual-Theme Blueprint Atmosphere:**
   Reuses the Three.js cursor-revealed schematic wireframe blueprint background (`dark_background.png` and `light_background.png`) with feathered radial falloff, ensuring visual continuity with the entry portal.

---

## 2. Bento Grid Structural Breakdown (Target Image Mapping)

Based on the target designs (`dark.png` and `light.png`), the 1st Pager Section is structured as an asymmetrical 2x2 Bento Grid:

```
+-------------------------------------------------------------+------------------------------------+
|                                                             |                                    |
|   GRID CARD 1: MORPHED CHOICE PORTAL                        |   GRID CARD 2: MY JOURNEY          |
|   - Compressed Choice Screen Component                      |   - Mountain trail illustration    |
|   - Sanjay's cutout portrait + Speech Bubble                |   - Iceland headline badge         |
|   - Developer / Creative choice circles                     |   - Milestone / Story launcher     |
|   - "Sanjay Baskar" display identity                        |                                    |
|                                                             |                                    |
+-------------------------------------------------------------+------------------------------------+
|                                                             |                                    |
|   GRID CARD 3: TECHNICAL STACK & RESUME                     |   GRID CARD 4: FEATURED PROJECT    |
|   - Left: Mini Resume / CV Interactive Card                 |   - Apple Website 3D showcase      |
|   - Right Top: Frontend badges (React, Next, TS, Tailwind)  |   - Tech tags + "Visit Project"    |
|   - Right Bottom: Backend badges (Node, Python, Supa, PG)   |   - Collaboration contact widget   |
|   - Click-to-inspect resume modal / sheet                   |   - "Copy email" + "Explore ↗"     |
|                                                             |                                    |
+-------------------------------------------------------------+------------------------------------+
```

### Grid Matrix Specification:
- **Desktop (>= 1024px):** 12-column grid or 2-column flex-grid with `min-h-[85vh]` to `min-h-screen`.
  - Row 1: Card 1 (`col-span-7` or ~58% width) | Card 2 (`col-span-5` or ~42% width)
  - Row 2: Card 3 (`col-span-7` or ~58% width) | Card 4 (`col-span-5` or ~42% width)
- **Tablet / Responsive (768px - 1023px):** Adaptive 2-column with proportionate auto-scaling.
- **Mobile (< 768px):** Protected by `<MobileUnsupported />` as per architectural rules.

---

## 3. Recommended shadcn/ui & Radix Component Mapping

To keep implementation clean, robust, and maintainable, we map each visual element to standard shadcn/ui components:

| Grid Area | Visual Element | Recommended shadcn / Reusable Component | Justification & Features |
|---|---|---|---|
| **Bento Grid Container** | Bento layout wrapper | Aceternity / shadcn Bento Grid pattern | Standard responsive grid layout with subtle border bevels and rounded corners. |
| **All Cards** | Bento card containers | `Card`, `CardHeader`, `CardContent`, `CardFooter` | Provides built-in border, background tokenization, elevation, and backdrop blur. |
| **Card 1 (Choice Portal)** | Embedded identity block | Sub-composition of existing `<ChoiceScreen />` | Reuses character cutout, speech bubble, choice buttons, and Iceland typography inside the Card container. |
| **Card 2 (Journey)** | "MY JOURNEY" Banner & Art | `Card` + `Badge` + `Sheet` / `Drawer` | Houses `journey.png` with an interactive overlay sheet that reveals career story and timeline milestones. |
| **Card 3 (Tech Stack)** | Resume / CV Preview | `Dialog` or `Sheet` + `ScrollArea` | Clicking the mini resume opens an interactive, zoomable modal of the full resume without leaving the page. |
| **Card 3 (Tech Stack)** | Frontend & Backend Categories | `Badge` + `Tabs` + `Tooltip` | Displays technology pills (`React`, `Next.js`, `TypeScript`, `Tailwind CSS`, `Node.js`, `Python`, `Supabase`, `PostgreSQL`) with tooltip descriptions and proficiency telemetry. |
| **Card 4 (Projects)** | Apple Website 3D Showcase | `Card` + `Badge` + `Button` (`outline` / `default`) | Displays 3D mockup image (`projects.png`), tech stack chips, and primary "VISIT PROJECT" external link button. |
| **Card 4 (Projects)** | Collaboration / Email Card | `Card` + `Button` + `Sonner` / `Toast` | Contact card with "Copy my email address" triggering a clipboard write and toast feedback, plus "Explore ↗" navigation button. |

---

## 4. Asset Inventory & Theming Strategy

### Assets from `public/developer-experience/`:
- `journey.png` (876 KB): High-resolution artistic illustration of traveler hiking the mountain path. Used in **Grid Card 2**.
- `projects.png` (109 KB): Apple 3D Titanium preview mockup. Used in **Grid Card 4**.
- `tech_stack_dark.png` (69 KB): Dark mode technical stack reference / preview graphic. Used in **Grid Card 3**.
- `tech_stack_light.png` (75 KB): Light mode technical stack reference / preview graphic. Used in **Grid Card 3**.

### Assets from `public/dev-hero-section/assets/`:
- `dark_background.png` & `light_background.png`: 1440x1024 schematic blueprint backgrounds for cursor spotlight canvas.
- `my_image.png`, `cloud_message.png`, `dev_choice_icon.png`, `creative_choice_icon.png`: Reused inside the compressed Choice Card.

### Theme Handling:
- Full support for system preferences (`prefers-color-scheme`) and runtime theme switching.
- Scoped tokens applied through `src/styles/terminal-core.css` with dark obsidian/cyan highlights and crisp slate borders in light mode.

---

## 5. GSAP Smooth Choice-to-Grid Morph Orchestration

### The Transition Concept:
1. **Initial Trigger:**
   - From `/`: When the user clicks the **DEVELOPER** round button, Next.js route transition or animated page state initiates.
   - The Choice Screen does NOT abruptly disappear.
2. **Morph Timeline (`gsap.timeline`):**
   - **Step 1 (Anchor Lock):** Full-screen `<ChoiceScreen />` calculates the target bounding rect of **Grid Card #1** within the bento container.
   - **Step 2 (Smooth Compression):** GSAP scales and translates the Choice Screen elements (portrait scales down from `95vh` to fit card dimensions, headline text scales down cleanly, choice pills adapt) over `0.85s - 1.1s` with an organic ease (`power3.inOut` or `expo.out`).
   - **Step 3 (Bento Unfurl):** As Card 1 reaches its docked position, Grid Cards 2, 3, and 4 stagger-fade into view with subtle upward translation (`y: 30 -> 0`, `opacity: 0 -> 1`, `stagger: 0.12`).
   - **Step 4 (Background Parity):** The interactive Three.js blueprint background seamlessly persists without flickering, maintaining cursor tracking.
3. **Direct Navigation Fallback:**
   - When a user lands directly on `/developer` (e.g. refresh or direct link), the transition plays a streamlined entrance animation: Card 1 starts in its docked position, and all 4 cards cascade in with GSAP ease.

---

## 6. Phased Implementation Roadmap (Execution Stages)

We will execute the implementation strictly in sequential stages, testing and verifying at each milestone:

```
[Stage 1: Background & Environment Canvas]
       │
       ▼
[Stage 2: Bento Grid Layout & Placeholder Skeleton]
       │
       ▼
[Stage 3: GSAP Morph & Compression Orchestration]
       │
       ▼
[Stage 4: Slot-by-Slot Card Implementation]
       ├── Card 1: Compressed Choice Screen Persona
       ├── Card 2: "My Journey" Story Card
       ├── Card 3: Technical Stack & Resume Modal
       └── Card 4: Apple 3D Project & Contact Teaser
       │
       ▼
[Stage 5: Polish, Typography, Dark/Light Parity & Verification]
```

### Detailed Breakdown of Stages:

#### 🟢 Stage 1: Pure Blueprint Cursor Reveal Canvas (Complete & Verified)
- Integrated `dark_background.png` and `light_background.png` into the Three.js radial mask shader via `<ChoiceBackgroundCanvas />`.
- **Clean Screen:** Entire 1st sectional page rendered with **zero text** and clean background canvas only.
- **Dynamic Spotlight:** As the cursor moves, the schematic blueprint reveals seamlessly with 60fps lerp tracking and feathered falloff, matching the choice page experience.
- **Theme Support:** Dynamically selects `dark_background.png` (dark) or `light_background.png` (light) based on browser setting.
- **Browser Verified:** Tested mouse tracking at center and offset coordinates with screenshot validation and 0 console errors.

#### 🟢 Stage 2: Bento Grid Skeleton & Exact Targeted Structures (Complete & Verified)
- **Direct Component Reuse:** Reused `<ChoiceScreen />` directly inside **Card 1** via `embedded={true}` mode — preserving all original layers, cutout portrait, choice trigger rounds, Iceland typography, animations, and hover speech bubble without redesigning.
- **Matched Layout & Dimensions:** Two-column asymmetrical bento grid strictly matching `targeted page design` (`dark_view.png` & `light_view.png`):
  - **Left Column (~58.5% width):** Card 1 (Choice Screen, 520px) + Card 3 (Technical Stack, 350px) = 902px total height.
  - **Right Column (~41.5% width):** Card 2 (My Journey, 430px) + Card 4 (Apple 3D & Collab, 440px) = 902px total height.
- **Grey Stroke Borders:** Solid grey stroke border (`border-[2px] border-[#555555]` / `border-[#6b7280]`) with `rounded-[30px]` on all 4 cards.
- **Centered & Symmetrical Spacing:** Switched to a 12-column CSS Grid (`col-span-7` and `col-span-5`) wrapped in `max-w-[1400px] mx-auto` with mathematically equal left and right outer margins.
#### 🟢 Stage 3: GSAP Morph & Docking Orchestration (Complete & Refined)
- **Route Gated Execution:** Triggers **only** when navigating from the Choice Screen (`/` → `/developer?from=choice` via `sessionStorage` and query flag). Direct URL visits, manual links, and page reloads render directly in the docked grid with **zero animation** and **zero delay**.
- **Zero-Delay & Zero-Glitch:** Eliminated all arbitrary delays and timeouts; the morph begins immediately on route mount.
- **Pure Uniform Resolution Scaling:** Rather than non-uniform transform scales or clipping boxes that cut off content, the entire 1440x1024 Choice Screen scales down with **100% uniform proportions** (`scaleX == scaleY`), perfectly matching the natural effect of changing display resolution. Zero elements squeezed, zero pixels cut off.
- **Replay Button:** Accessible at bottom-right for testing the animation on demand.

#### 🟢 Stage 4: Card 4 — Featured Project & Collaboration (Complete & Verified)
- Built [`src/components/developer/cards/project-showcase-card.tsx`](file:///d:/SEMESTER%20-%207/PORTFOLIO%20SOFTWARE/src/components/developer/cards/project-showcase-card.tsx).
- **Apple Website 3D Showcase:** High-resolution cropped Titanium mockup (`apple_iphone_mockup.png`), tech stack chips (`GSAP`, `NEXT JS`, `TS`, `TAILWIND CSS`, `MOTION`, `THREE JS`), and interactive "VISIT PROJECT" button.
- **Collaboration & Contact Hub:** Deep purple-violet iridescent glassmorphic container with functional "Copy my email address" (`sanjaybaskar.in@gmail.com`) triggering animated checkmark feedback and floating toast notification, plus interactive "Explore ↗" button.
- **Cards 2 & 3:** Preserved with targeted design mockups as requested.

#### 🟢 Stage 4: Progressive Slot-by-Slot Implementation
- **Slot 1 (Choice Portal):** Refactor `<ChoiceScreen />` to support responsive container docking mode (`compact={true}` or docked variant).
- **Slot 2 (My Journey):** Integrate `journey.png`, "MY JOURNEY" Iceland headline, and click-to-expand story drawer/sheet.
- **Slot 3 (Technical Stack):** Build the two-column tech card with interactive resume preview (`tech_stack_dark.png` / `tech_stack_light.png`), resume dialog viewer, and categorized frontend/backend tech chips.
- **Slot 4 (Projects & Contact):** Build the Apple 3D showcase card with `projects.png`, tech badges, "VISIT PROJECT" action, and interactive "Copy email" button with toast notification + "Explore ↗" button.

#### 🟢 Stage 5: System Parity, Scrolling Context & Verification
- Verify dark and light mode rendering against target mockups.
- Confirm keyboard accessibility and link routing.
- Ensure 1st Pager Section anchors smoothly to upcoming scrollable sections of the developer route.
- Run `npm run build` and `tsc --noEmit` to guarantee zero type errors or hydration warnings.

---

## 7. Rules of Engagement & Guardrails

- **No Premature Code Execution:** No build code will be written until the user explicitly approves this plan.
- **Tracker Integrity:** This document remains an unofficial staging plan under `Plan/developer_plan.md` and will not mutate official `tracker/` documents until declared ready.
- **Component Reusability:** No bespoke one-off CSS hacks; all styling flows through `src/styles/terminal-core.css` and standard shadcn UI components.
