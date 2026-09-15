# 🎯 Choice Screen Redesign & Prototyping Plan

> **Scope:** Complete redesign of the initial Choice Screen (`/`) into a standalone, modular component.  
> **Status:** 🟢 Complete & Wired into Entry Gateway  
> **Component Target:** `src/components/choice-screen/` (`<ChoiceScreen />`, imported directly into `src/app/entry-client.tsx`).  
> **Design Targets:** [`public/dev-hero-section/target_images/dark.png`](file:///d:/SEMESTER%20-%207/PORTFOLIO%20SOFTWARE/public/dev-hero-section/target_images/dark.png) & [`light.png`](file:///d:/SEMESTER%20-%207/PORTFOLIO%20SOFTWARE/public/dev-hero-section/target_images/light.png).  
> **Tracker Link:** Referenced by [`design_tracker.md`](file:///d:/SEMESTER%20-%207/PORTFOLIO%20SOFTWARE/design_tracker.md).

---

## 1. Overview & Architectural Strategy

The choice screen has been engineered as an isolated, self-contained component (`<ChoiceScreen />`) and wired into `src/app/entry-client.tsx`.

The design features a 5-layer compositing approach:
1. **Interactive Three.js Masking Canvas (Bottom Layer):** The schematic blueprint background (`dark_background.png` / `light_background.png`) is hidden by default and dynamically revealed around the cursor within a smooth radial spotlight at native 1:1 unexpanded scale (tiled across width and height).
2. **Layered Character & Atmosphere (Middle Layer):** Sanjay's portrait cutout (`my_image.png`) anchored on the bottom-left with responsive scaling, blended via the atmospheric vignette overlay (`dark_overlay.png` / `light_overlay.png`).
3. **Dual Choice Circles (Interactive Core):** High-contrast circular action triggers for **DEVELOPER** and **CREATIVE** with glowing rings and pill labels linking to `/developer` and `/creative`.
4. **Brand & Identity Typography (Foreground Layer):** High-impact tech headline "Sanjay Baskar", "CSE ASPIRANT", and "CHOICE PAGE" anchor tag rendered in Google Font **Iceland**.
5. **Interactive Hover Cloud Message (Floating Layer):** "CHOOSE TO EXPLORE THE WORK !!!" appears floating above the character upon hovering over Sanjay's portrait with a spring animation and subtle floating motion.

---

## 2. Asset Inventory (`public/dev-hero-section/assets/`)

| Asset File | Role in Design | Theme Context |
|---|---|---|
| `dark_background.png` | Schematic wireframe blueprint background (1440x1024) | Dark Mode |
| `light_background.png` | Schematic wireframe blueprint background (1440x1024) | Light Mode |
| `dark_overlay.png` | Atmospheric vignette & gradient blend overlay (1440x267) | Dark Mode |
| `light_overlay.png` | Atmospheric vignette & gradient blend overlay (1440x267) | Light Mode |
| `my_image.png` | Cutout character portrait of Sanjay Baskar (652x754) | Universal (B&W duotone) |
| `cloud_message.png` | "CHOOSE TO EXPLORE THE WORK !!!" hover speech bubble (789x96) | Universal |
| `dev_choice_icon.png` | Developer avatar / coding icon in circle (256x256) | Developer Mode |
| `creative_choice_icon.png` | Lightbulb / ideation icon in circle (256x256) | Creative Mode |

---

## 3. Implementation Status Checklist

- [x] **Step 1: Three.js Cursor-Revealed Blueprint Background Canvas** (🟢 Complete):
  - Fragment shader radial mask with feathered falloff.
  - Linear interpolation (`lerp`) for smooth 60fps tracking.
  - Native 1:1 unexpanded scale with repeat wrapping across screen dimensions.
  - Automatic system theme preference detection (`prefers-color-scheme`).

- [x] **Step 2: Character Cutout & Atmospheric Cover Layer** (🟢 Complete):
  - Cutout portrait anchored at bottom-left (`h-[95vh] min-h-[520px] max-h-[97vh] max-w-[44vw]`).
  - Atmospheric vignette cover layer (`h-[42vh] min-h-[220px]`) blending lower torso into background.
  - Responsive relative measurements.

- [x] **Step 3: Identity & Typography in Google Font `Iceland`** (🟢 Complete):
  - Google Font `Iceland` loaded in `src/app/layout.tsx` and configured via `.font-iceland`.
  - "Sanjay Baskar" display title + "CSE ASPIRANT" subtitle + "CHOICE PAGE" capsule badge.
  - High-contrast drop shadows and dark/light mode adaptation.

- [x] **Step 4: Dual Experience Choice Circles** (🟢 Complete):
  - **DEVELOPER** round button with `dev_choice_icon.png`, pill badge, cyan hover glow, linking to `/developer`.
  - **CREATIVE** round button with `creative_choice_icon.png`, pill badge, purple hover glow, linking to `/creative`.
  - Spring-based hover lift and tap animations via `motion`.

- [x] **Step 5: Interactive Hover Cloud Message** (🟢 Complete):
  - Speech bubble `"CHOOSE TO EXPLORE THE WORK !!!"` floating at top-right of portrait.
  - `AnimatePresence` spring reveal on portrait hover with ambient floating loop.
  - Click-toggle support for touch/mobile devices.

- [x] **Step 6: Integration into Entry Gateway** (🟢 Complete):
  - Replaced legacy choice cards in `src/app/entry-client.tsx` with `<ChoiceScreen />`.
  - Full production build and type checking verified (`tsc --noEmit`).
