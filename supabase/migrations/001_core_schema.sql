-- =============================================================================
-- Migration: 001_core_schema.sql
-- Description: Core tables for the portfolio platform (v1.0 Backend)
-- Tables: profile, projects, skills, media
-- Created: 2026-09-11
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. Helper: auto-update `updated_at` trigger function
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ---------------------------------------------------------------------------
-- 2. Table: profile
-- Single-row table for the portfolio owner's personal info.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profile (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name   text        NOT NULL,
  headline    text        NOT NULL,
  short_bio   text,
  long_bio    text,
  avatar_url  text,
  social_links jsonb      DEFAULT '{}'::jsonb,
  resume_url  text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- Auto-update updated_at on profile
CREATE TRIGGER on_profile_updated
  BEFORE UPDATE ON public.profile
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Add table comment
COMMENT ON TABLE public.profile IS 'Portfolio owner personal info (single row)';

-- ---------------------------------------------------------------------------
-- 3. Table: projects
-- Portfolio projects / work items.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title         text        NOT NULL,
  slug          text        NOT NULL UNIQUE,
  tagline       text,
  description   text,
  tech_stack    text[]      DEFAULT '{}',
  live_url      text,
  github_url    text,
  thumbnail_url text,
  images        text[]      DEFAULT '{}',
  featured      boolean     NOT NULL DEFAULT false,
  published     boolean     NOT NULL DEFAULT true,
  display_order integer     NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- Auto-update updated_at on projects
CREATE TRIGGER on_projects_updated
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Index for slug lookups (unique constraint already creates one, but explicit for clarity)
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects (slug);

-- Index for display ordering
CREATE INDEX IF NOT EXISTS idx_projects_display_order ON public.projects (display_order);

-- Add table comment
COMMENT ON TABLE public.projects IS 'Portfolio projects and work items';

-- ---------------------------------------------------------------------------
-- 4. Table: skills
-- Skills grouped by category, kept minimal.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.skills (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text        NOT NULL,
  category      text        NOT NULL,
  proficiency   integer     CHECK (proficiency IS NULL OR (proficiency >= 1 AND proficiency <= 100)),
  icon_name     text,
  display_order integer     NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- Index for category grouping
CREATE INDEX IF NOT EXISTS idx_skills_category ON public.skills (category);

-- Index for display ordering
CREATE INDEX IF NOT EXISTS idx_skills_display_order ON public.skills (display_order);

-- Add table comment
COMMENT ON TABLE public.skills IS 'Portfolio skills grouped by category';

-- ---------------------------------------------------------------------------
-- 5. Table: media
-- Registry of files in Supabase Storage.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.media (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  storage_path  text        NOT NULL,
  public_url    text        NOT NULL,
  alt_text      text,
  type          text        NOT NULL DEFAULT 'image',
  filename      text        NOT NULL,
  mime_type     text,
  size_bytes    bigint,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- Constraint: type must be one of allowed values
ALTER TABLE public.media
  ADD CONSTRAINT chk_media_type
  CHECK (type IN ('image', 'video', 'document'));

-- Add table comment
COMMENT ON TABLE public.media IS 'Registry of files uploaded to Supabase Storage';

-- ---------------------------------------------------------------------------
-- 6. Storage: create public bucket for portfolio assets
-- ---------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio', 'portfolio', true)
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Done! Tables created:
--   - public.profile     (single row — portfolio owner info)
--   - public.projects    (portfolio work items)
--   - public.skills      (skills by category)
--   - public.media       (storage file registry)
--   - storage.portfolio  (public bucket for uploads)
-- ---------------------------------------------------------------------------
