-- Migration: 20261114000003_create_dashboard_and_workout_history.sql
-- Description: Creates workout_sessions, workout_session_exercises, and user_skill_progress
--              with strict Row Level Security (RLS), foreign keys, and indexes for Phase 4.

-- 1. Create workout_sessions table
CREATE TABLE IF NOT EXISTS public.workout_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workout_name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('no_equipment', 'push', 'pull', 'legs', 'core', 'skills', 'full_body')),
  status TEXT NOT NULL CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  started_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  completed_at TIMESTAMPTZ,
  duration_seconds INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_workout_sessions_user_id ON public.workout_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_created_at ON public.workout_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_status ON public.workout_sessions(status);

ALTER TABLE public.workout_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own workout sessions" ON public.workout_sessions;
CREATE POLICY "Users can manage their own workout sessions"
  ON public.workout_sessions
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 2. Create workout_session_exercises table
CREATE TABLE IF NOT EXISTS public.workout_session_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.workout_sessions(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
  sets_completed INTEGER NOT NULL DEFAULT 0 CHECK (sets_completed >= 0),
  reps_completed INTEGER NOT NULL DEFAULT 0 CHECK (reps_completed >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_session_exercises_session_id ON public.workout_session_exercises(session_id);
CREATE INDEX IF NOT EXISTS idx_session_exercises_exercise_id ON public.workout_session_exercises(exercise_id);

ALTER TABLE public.workout_session_exercises ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage session exercises through their sessions" ON public.workout_session_exercises;
CREATE POLICY "Users can manage session exercises through their sessions"
  ON public.workout_session_exercises
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.workout_sessions ws
      WHERE ws.id = workout_session_exercises.session_id
      AND ws.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.workout_sessions ws
      WHERE ws.id = workout_session_exercises.session_id
      AND ws.user_id = auth.uid()
    )
  );

-- 3. Create user_skill_progress table
CREATE TABLE IF NOT EXISTS public.user_skill_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_slug TEXT NOT NULL,
  skill_name TEXT NOT NULL,
  progression_level TEXT NOT NULL,
  assessment_status TEXT NOT NULL CHECK (assessment_status IN ('not_assessed', 'learning', 'proficient', 'mastered')) DEFAULT 'not_assessed',
  notes TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE (user_id, skill_slug)
);

CREATE INDEX IF NOT EXISTS idx_user_skill_progress_user ON public.user_skill_progress(user_id);

ALTER TABLE public.user_skill_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own skill progress" ON public.user_skill_progress;
CREATE POLICY "Users can manage their own skill progress"
  ON public.user_skill_progress
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

