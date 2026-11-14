-- Calisthenics Coach Phase 2: Extend Profiles Table for Onboarding & Personalization
-- Migration: 20261114000001_extend_profiles_onboarding.sql

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS experience_level TEXT CHECK (experience_level IN ('beginner', 'intermediate', 'advanced')),
  ADD COLUMN IF NOT EXISTS fitness_goals TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS target_skills TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS available_equipment TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS training_days TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS session_duration_minutes INTEGER CHECK (session_duration_minutes IN (15, 20, 30, 45, 60)),
  ADD COLUMN IF NOT EXISTS preferred_training_time TEXT CHECK (preferred_training_time IN ('morning', 'afternoon', 'evening', 'flexible')),
  ADD COLUMN IF NOT EXISTS training_location TEXT CHECK (training_location IN ('home', 'gym', 'outdoors')),
  ADD COLUMN IF NOT EXISTS coaching_style TEXT CHECK (coaching_style IN ('guided', 'independent')),
  ADD COLUMN IF NOT EXISTS workout_preference TEXT CHECK (workout_preference IN ('strength', 'skill', 'balanced')),
  ADD COLUMN IF NOT EXISTS training_notes TEXT NULL;

-- Index for querying experience level and onboarding status
CREATE INDEX IF NOT EXISTS idx_profiles_experience ON public.profiles(experience_level);

