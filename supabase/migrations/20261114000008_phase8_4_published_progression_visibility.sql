-- =========================================================================
-- Migration: 20261114000008_phase8_4_published_progression_visibility.sql
-- Description: Phase 8.6 Security Hardening & RLS Remediation
--              1. Drops all existing permissive SELECT policies on skill_progressions
--                 including the original 'USING (true)' policy to eliminate PostgreSQL
--                 permissive OR evaluation leaks.
--              2. Restricts public/authenticated read visibility strictly to progressions
--                 belonging to published skills (content_status = 'published').
--              3. Preserves legitimate administrative and service-role management access.
-- Note: PREPARED MIGRATION. DO NOT AUTO-APPLY TO PRODUCTION WITHOUT STAGING REVIEW.
-- =========================================================================

-- 1. Drop all obsolete permissive or un-scoped SELECT policies on skill_progressions
DROP POLICY IF EXISTS "Public can view skill progressions" ON public.skill_progressions;
DROP POLICY IF EXISTS "Public can view published skill progressions" ON public.skill_progressions;
DROP POLICY IF EXISTS "Skill progressions are viewable by everyone" ON public.skill_progressions;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.skill_progressions;
DROP POLICY IF EXISTS "Allow public read access" ON public.skill_progressions;
DROP POLICY IF EXISTS "Users can view skill progressions" ON public.skill_progressions;

-- 2. Create strictly scoped SELECT policy ensuring parent skill in skill_catalog is published
CREATE POLICY "Public can view published skill progressions"
  ON public.skill_progressions
  FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.skill_catalog sc
      WHERE sc.id = public.skill_progressions.skill_id
        AND sc.content_status = 'published'
    )
  );

-- 3. Explicitly preserve administrative access for admin role / service role tokens
DROP POLICY IF EXISTS "Admins have full access to skill progressions" ON public.skill_progressions;
CREATE POLICY "Admins have full access to skill progressions"
  ON public.skill_progressions
  FOR ALL
  TO authenticated
  USING (
    coalesce((auth.jwt()->>'role'), '') = 'service_role'
    OR coalesce((auth.jwt()->'app_metadata'->>'role'), '') = 'admin'
  )
  WITH CHECK (
    coalesce((auth.jwt()->>'role'), '') = 'service_role'
    OR coalesce((auth.jwt()->'app_metadata'->>'role'), '') = 'admin'
  );
