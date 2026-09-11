# 🗄️ Core Schema Blueprint

> **Version:** v1.0 (Backend)  
> **Stage:** A2 — Core Schema Design  
> **Last Updated:** 2026-09-11  
> **Migration File:** [`supabase/migrations/001_core_schema.sql`](file:///d:/SEMESTER%20-%207/PORTFOLIO%20SOFTWARE/supabase/migrations/001_core_schema.sql)

---

## Overview

Four core tables power both the Developer and Creative experiences.  
Creative-specific tables (`creative_blocks`, `resume_sections`) are **NOT** part of this schema — they come later in v3.0 (DEC-001).

```
┌──────────────────────────────────────────────────────┐
│                     SUPABASE                         │
│                                                      │
│   ┌─────────┐  ┌──────────┐  ┌────────┐  ┌───────┐  │
│   │ profile │  │ projects │  │ skills │  │ media │  │
│   │ (1 row) │  │ (many)   │  │ (many) │  │ (many)│  │
│   └─────────┘  └──────────┘  └────────┘  └───────┘  │
│                                                      │
│   profile ← 1 row (the portfolio owner)              │
│   projects ← each project/work item                  │
│   skills ← each skill, grouped by category           │
│   media ← references to Supabase Storage files       │
└──────────────────────────────────────────────────────┘
```

---

## Table: `profile`

> **Purpose:** Single-row table holding the portfolio owner's personal info.  
> **Who fills this:** You, once, in Stage A5.

| Column | Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | `uuid` | ❌ | `gen_random_uuid()` | Primary key |
| `full_name` | `text` | ❌ | — | Your full name |
| `headline` | `text` | ❌ | — | Role/title (e.g. "Full Stack Developer") |
| `short_bio` | `text` | ✅ | — | One-liner intro (used in meta tags, cards) |
| `long_bio` | `text` | ✅ | — | Detailed bio (used on Developer about section) |
| `avatar_url` | `text` | ✅ | — | Profile photo URL (Supabase Storage public URL) |
| `social_links` | `jsonb` | ✅ | `'{}'` | Object of social platform URLs |
| `resume_url` | `text` | ✅ | — | Direct link to downloadable resume PDF |
| `created_at` | `timestamptz` | ❌ | `now()` | Row creation timestamp |
| `updated_at` | `timestamptz` | ❌ | `now()` | Last modification timestamp |

### `social_links` JSON shape

```json
{
  "github": "https://github.com/your-username",
  "linkedin": "https://linkedin.com/in/your-profile",
  "twitter": "https://twitter.com/your-handle",
  "email": "you@example.com",
  "website": "https://your-site.com",
  "leetcode": "https://leetcode.com/your-profile",
  "devto": "https://dev.to/your-profile"
}
```

> **Tip:** Only include the links you actually have. JSONB is flexible — add/remove keys anytime without a schema change.

---

### 📝 What to prepare for `profile` (Stage A5)

- [ ] Your full name
- [ ] A headline / role title
- [ ] Short bio (1–2 sentences)
- [ ] Long bio (a paragraph or two)
- [ ] Profile photo (upload to Supabase Storage, grab the public URL)
- [ ] Social links (GitHub, LinkedIn, Twitter/X, Email, etc.)
- [ ] Resume PDF (optional — upload to Supabase Storage)

---

## Table: `projects`

> **Purpose:** Your portfolio projects/work items.  
> **Who fills this:** You, 2–3 real projects in Stage A5, more later.

| Column | Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | `uuid` | ❌ | `gen_random_uuid()` | Primary key |
| `title` | `text` | ❌ | — | Project name |
| `slug` | `text` | ❌ | — | URL-friendly identifier (unique) |
| `tagline` | `text` | ✅ | — | Short one-liner describing the project |
| `description` | `text` | ✅ | — | Full project description / writeup |
| `tech_stack` | `text[]` | ✅ | `'{}'` | Array of tech names (e.g. `{"React", "Node.js", "PostgreSQL"}`) |
| `live_url` | `text` | ✅ | — | Link to live demo |
| `github_url` | `text` | ✅ | — | Link to GitHub repo |
| `thumbnail_url` | `text` | ✅ | — | Main preview image URL |
| `images` | `text[]` | ✅ | `'{}'` | Additional screenshot URLs |
| `featured` | `boolean` | ❌ | `false` | Show prominently on portfolio |
| `published` | `boolean` | ❌ | `true` | Controls visibility via RLS |
| `display_order` | `integer` | ❌ | `0` | Sort order (lower = first) |
| `created_at` | `timestamptz` | ❌ | `now()` | Row creation timestamp |
| `updated_at` | `timestamptz` | ❌ | `now()` | Last modification timestamp |

### Constraints
- `slug` has a **UNIQUE** constraint (used in URLs like `/developer/projects/my-project`)

---

### 📝 What to prepare for each `project` (Stage A5)

- [ ] Project title
- [ ] A URL-friendly slug (e.g. `my-cool-project`)
- [ ] Short tagline (1 sentence)
- [ ] Full description (what it does, what problem it solves, your role)
- [ ] Tech stack list (e.g. React, Next.js, Python, etc.)
- [ ] Live demo URL (if available)
- [ ] GitHub repo URL (if public)
- [ ] 1 thumbnail image + any additional screenshots
- [ ] Is it featured? (yes/no)

---

## Table: `skills`

> **Purpose:** Skills grouped by category, kept minimal.  
> **Who fills this:** You, in Stage A5.

| Column | Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | `uuid` | ❌ | `gen_random_uuid()` | Primary key |
| `name` | `text` | ❌ | — | Skill name (e.g. "TypeScript") |
| `category` | `text` | ❌ | — | Group (e.g. "Languages", "Frameworks", "Tools", "Cloud") |
| `proficiency` | `integer` | ✅ | — | 1–100 scale (optional — use if you want skill bars) |
| `icon_name` | `text` | ✅ | — | Icon identifier (e.g. for devicons or simple-icons) |
| `display_order` | `integer` | ❌ | `0` | Sort order within category |
| `created_at` | `timestamptz` | ❌ | `now()` | Row creation timestamp |

### Suggested categories

| Category | Example skills |
|---|---|
| Languages | JavaScript, TypeScript, Python, Java, C++ |
| Frameworks | React, Next.js, Node.js, Express, Django |
| Databases | PostgreSQL, MongoDB, Redis, Supabase |
| Tools | Git, Docker, VS Code, Figma |
| Cloud & DevOps | AWS, Vercel, GitHub Actions, CI/CD |
| Other | REST APIs, GraphQL, WebSockets |

---

### 📝 What to prepare for `skills` (Stage A5)

- [ ] List of your skills
- [ ] Categorize them (Languages, Frameworks, Databases, Tools, Cloud, etc.)
- [ ] Optionally assign a proficiency level (1–100)
- [ ] Decide on ordering within each category

---

## Table: `media`

> **Purpose:** Registry of files uploaded to Supabase Storage. Tracks metadata so the frontend can render proper alt text, pick correct renderers, etc.  
> **Who fills this:** Automatically when you upload images/files in Stage A5.

| Column | Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | `uuid` | ❌ | `gen_random_uuid()` | Primary key |
| `storage_path` | `text` | ❌ | — | Path in Supabase Storage (e.g. `portfolio/projects/screenshot.png`) |
| `public_url` | `text` | ❌ | — | Full public URL to the file |
| `alt_text` | `text` | ✅ | — | Accessibility alt text |
| `type` | `text` | ❌ | `'image'` | File type: `image`, `video`, `document` |
| `filename` | `text` | ❌ | — | Original filename |
| `mime_type` | `text` | ✅ | — | MIME type (e.g. `image/png`, `application/pdf`) |
| `size_bytes` | `bigint` | ✅ | — | File size in bytes |
| `created_at` | `timestamptz` | ❌ | `now()` | Upload timestamp |

---

### 📝 What to prepare for `media` (Stage A5)

- [ ] Profile photo
- [ ] Project thumbnails (1 per project)
- [ ] Project screenshots (2–3 per project)
- [ ] Resume PDF (optional)

> **Upload target:** Supabase Storage → `portfolio` bucket  
> **Folder convention:**  
> `portfolio/avatar/` — profile photo  
> `portfolio/projects/<slug>/` — project images  
> `portfolio/resume/` — resume PDF  

---

## Tables NOT In This Schema

These come later — do NOT create them now:

| Table | Version | Stage | Purpose |
|---|---|---|---|
| `creative_blocks` | v3.0 | D1 | Spatial layout data for Creative canvas |
| `resume_sections` | v2.0 | C3 | Adaptive resume section visibility rules |

---

## Auto-Updated Timestamps

All tables with `updated_at` use a shared trigger function that automatically sets `updated_at = now()` on every `UPDATE`. You never need to manually set this column.

---

## Storage Bucket

A public Supabase Storage bucket named **`portfolio`** is created by the migration for storing all uploaded media files (images, PDFs, etc.).

---
