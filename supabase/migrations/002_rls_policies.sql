-- =============================================================================
-- Migration: 002_rls_policies.sql
-- Description: Enable RLS on all core tables + public read-only policies
-- Stage: A3 — Row Level Security
-- Created: 2026-09-11
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. Enable RLS on all core tables
-- ---------------------------------------------------------------------------
-- Once enabled, all access is DENIED by default unless a policy grants it.
-- This means INSERT, UPDATE, DELETE are blocked for all roles until
-- explicit policies are created (admin write policies come in A4).

ALTER TABLE public.profile  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media    ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- 2. Public read policies
-- ---------------------------------------------------------------------------
-- These grant SELECT access to the `anon` role (unauthenticated users).
-- Each policy is scoped to the appropriate visibility rules.

-- Profile: always readable (single-row table, always public)
CREATE POLICY profile_public_read
  ON public.profile
  FOR SELECT
  TO anon
  USING (true);

-- Projects: only published projects are visible to the public
CREATE POLICY projects_public_read
  ON public.projects
  FOR SELECT
  TO anon
  USING (published = true);

-- Skills: always readable (no published flag, all skills are public)
CREATE POLICY skills_public_read
  ON public.skills
  FOR SELECT
  TO anon
  USING (true);

-- Media: always readable (files referenced by other public content)
CREATE POLICY media_public_read
  ON public.media
  FOR SELECT
  TO anon
  USING (true);

-- ---------------------------------------------------------------------------
-- 3. Storage bucket read policy
-- ---------------------------------------------------------------------------
-- Allow anyone to read (download) files from the 'portfolio' bucket.
-- This ensures uploaded images/PDFs are accessible via public URL.

CREATE POLICY portfolio_bucket_public_read
  ON storage.objects
  FOR SELECT
  TO anon
  USING (bucket_id = 'portfolio');

-- ---------------------------------------------------------------------------
-- Done! RLS is now active:
--   - All tables: deny-all by default (no INSERT/UPDATE/DELETE policies)
--   - Public SELECT on profile, skills, media (all rows)
--   - Public SELECT on projects (published = true only)
--   - Public read on portfolio storage bucket
--
-- Admin write access will be added in Stage A4 after auth setup.
-- ---------------------------------------------------------------------------
