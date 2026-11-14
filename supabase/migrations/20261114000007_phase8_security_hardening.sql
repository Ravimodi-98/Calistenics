-- =========================================================================
-- Migration: 20261114000007_phase8_security_hardening.sql
-- Description: Phase 8.2 Security Hardening
--              1. Adds explicit DELETE policy on notification_preferences
--                 scoped strictly to (auth.uid() = user_id).
--              2. Ensures RLS policy completeness for user data control.
-- =========================================================================

-- Explicit DELETE policy for user notification preferences
DROP POLICY IF EXISTS "Users can delete own notification preferences" ON public.notification_preferences;
CREATE POLICY "Users can delete own notification preferences"
  ON public.notification_preferences
  FOR DELETE
  USING (auth.uid() = user_id);
