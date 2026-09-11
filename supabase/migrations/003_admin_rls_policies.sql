-- =============================================================================
-- Migration: 003_admin_rls_policies.sql
-- Description: Admin write + full-read policies for all core tables + storage
-- Stage: A4 — Auth Setup
-- Created: 2026-09-11
--
-- Admin User: maskedprogrammer.in@gmail.com
-- Admin UUID: 428d026c-33dd-4845-a903-4831adfb7e56
-- =============================================================================

-- ---------------------------------------------------------------------------
-- DESIGN NOTES
-- ---------------------------------------------------------------------------
-- Current state (from A3):
--   - RLS is enabled on all tables (deny-all default)
--   - Anon role has SELECT-only policies (public read)
--   - No write policies exist → all writes are blocked
--
-- What this migration adds:
--   1. Admin full-access SELECT on all tables (sees unpublished projects too)
--   2. Admin INSERT on all tables
--   3. Admin UPDATE on all tables
--   4. Admin DELETE on all tables
--   5. Admin full access to storage bucket (upload, update, delete files)
--
-- All admin policies check: auth.uid() = '<admin-uuid>'
-- This means ONLY the admin user can write. Any other authenticated user
-- (if one is ever created) would be denied by default.
-- ---------------------------------------------------------------------------

-- Store the admin UUID in a variable-like comment for clarity.
-- In Supabase SQL, we use the UUID directly in each policy.

-- =============================================
-- PROFILE TABLE — Admin Policies
-- =============================================

-- Admin can see all profile rows (same as anon for now, but explicit)
CREATE POLICY profile_admin_select
  ON public.profile
  FOR SELECT
  TO authenticated
  USING (auth.uid() = '428d026c-33dd-4845-a903-4831adfb7e56');

-- Admin can insert profile rows
CREATE POLICY profile_admin_insert
  ON public.profile
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = '428d026c-33dd-4845-a903-4831adfb7e56');

-- Admin can update profile rows
CREATE POLICY profile_admin_update
  ON public.profile
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = '428d026c-33dd-4845-a903-4831adfb7e56')
  WITH CHECK (auth.uid() = '428d026c-33dd-4845-a903-4831adfb7e56');

-- Admin can delete profile rows
CREATE POLICY profile_admin_delete
  ON public.profile
  FOR DELETE
  TO authenticated
  USING (auth.uid() = '428d026c-33dd-4845-a903-4831adfb7e56');


-- =============================================
-- PROJECTS TABLE — Admin Policies
-- =============================================

-- Admin can see ALL projects (including unpublished)
CREATE POLICY projects_admin_select
  ON public.projects
  FOR SELECT
  TO authenticated
  USING (auth.uid() = '428d026c-33dd-4845-a903-4831adfb7e56');

-- Admin can insert projects
CREATE POLICY projects_admin_insert
  ON public.projects
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = '428d026c-33dd-4845-a903-4831adfb7e56');

-- Admin can update projects
CREATE POLICY projects_admin_update
  ON public.projects
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = '428d026c-33dd-4845-a903-4831adfb7e56')
  WITH CHECK (auth.uid() = '428d026c-33dd-4845-a903-4831adfb7e56');

-- Admin can delete projects
CREATE POLICY projects_admin_delete
  ON public.projects
  FOR DELETE
  TO authenticated
  USING (auth.uid() = '428d026c-33dd-4845-a903-4831adfb7e56');


-- =============================================
-- SKILLS TABLE — Admin Policies
-- =============================================

-- Admin can see all skills
CREATE POLICY skills_admin_select
  ON public.skills
  FOR SELECT
  TO authenticated
  USING (auth.uid() = '428d026c-33dd-4845-a903-4831adfb7e56');

-- Admin can insert skills
CREATE POLICY skills_admin_insert
  ON public.skills
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = '428d026c-33dd-4845-a903-4831adfb7e56');

-- Admin can update skills
CREATE POLICY skills_admin_update
  ON public.skills
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = '428d026c-33dd-4845-a903-4831adfb7e56')
  WITH CHECK (auth.uid() = '428d026c-33dd-4845-a903-4831adfb7e56');

-- Admin can delete skills
CREATE POLICY skills_admin_delete
  ON public.skills
  FOR DELETE
  TO authenticated
  USING (auth.uid() = '428d026c-33dd-4845-a903-4831adfb7e56');


-- =============================================
-- MEDIA TABLE — Admin Policies
-- =============================================

-- Admin can see all media
CREATE POLICY media_admin_select
  ON public.media
  FOR SELECT
  TO authenticated
  USING (auth.uid() = '428d026c-33dd-4845-a903-4831adfb7e56');

-- Admin can insert media
CREATE POLICY media_admin_insert
  ON public.media
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = '428d026c-33dd-4845-a903-4831adfb7e56');

-- Admin can update media
CREATE POLICY media_admin_update
  ON public.media
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = '428d026c-33dd-4845-a903-4831adfb7e56')
  WITH CHECK (auth.uid() = '428d026c-33dd-4845-a903-4831adfb7e56');

-- Admin can delete media
CREATE POLICY media_admin_delete
  ON public.media
  FOR DELETE
  TO authenticated
  USING (auth.uid() = '428d026c-33dd-4845-a903-4831adfb7e56');


-- =============================================
-- STORAGE BUCKET — Admin Policies
-- =============================================

-- Admin can upload files to the portfolio bucket
CREATE POLICY portfolio_bucket_admin_insert
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'portfolio'
    AND auth.uid() = '428d026c-33dd-4845-a903-4831adfb7e56'
  );

-- Admin can update/overwrite files in the portfolio bucket
CREATE POLICY portfolio_bucket_admin_update
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'portfolio'
    AND auth.uid() = '428d026c-33dd-4845-a903-4831adfb7e56'
  )
  WITH CHECK (
    bucket_id = 'portfolio'
    AND auth.uid() = '428d026c-33dd-4845-a903-4831adfb7e56'
  );

-- Admin can delete files from the portfolio bucket
CREATE POLICY portfolio_bucket_admin_delete
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'portfolio'
    AND auth.uid() = '428d026c-33dd-4845-a903-4831adfb7e56'
  );

-- Admin can read ALL files in the portfolio bucket (authenticated context)
CREATE POLICY portfolio_bucket_admin_select
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'portfolio'
    AND auth.uid() = '428d026c-33dd-4845-a903-4831adfb7e56'
  );


-- ---------------------------------------------------------------------------
-- SUMMARY
-- ---------------------------------------------------------------------------
-- After this migration, the complete RLS picture is:
--
-- ANON (public visitors):
--   ✅ SELECT on profile, skills, media (all rows)
--   ✅ SELECT on projects (published = true only)
--   ✅ SELECT on storage.objects (portfolio bucket)
--   ❌ INSERT, UPDATE, DELETE on all tables (denied by default)
--
-- AUTHENTICATED (admin — 428d026c-33dd-4845-a903-4831adfb7e56):
--   ✅ SELECT on all tables (all rows, including unpublished)
--   ✅ INSERT on all tables
--   ✅ UPDATE on all tables
--   ✅ DELETE on all tables
--   ✅ Full CRUD on storage.objects (portfolio bucket)
--
-- ANY OTHER AUTHENTICATED USER:
--   ❌ All operations denied (no matching policies)
-- ---------------------------------------------------------------------------
