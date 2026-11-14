declare const __dirname: string;
declare function require(name: string): any;
const fs = require('fs');
const path = require('path');

describe('Phase 4 Database Schema & RLS Policy Verification', () => {
  let migrationSql: string;

  beforeAll(() => {
    const migrationPath = path.resolve(
      __dirname,
      '../../supabase/migrations/20261114000003_create_dashboard_and_workout_history.sql'
    );
    migrationSql = fs.readFileSync(migrationPath, 'utf8');
  });

  test('workout_sessions has RLS enabled and enforces user ownership', () => {
    expect(migrationSql).toContain('ALTER TABLE public.workout_sessions ENABLE ROW LEVEL SECURITY;');
    expect(migrationSql).toContain('CREATE POLICY "Users can manage their own workout sessions"');
    expect(migrationSql).toContain('USING (auth.uid() = user_id)');
    expect(migrationSql).toContain('WITH CHECK (auth.uid() = user_id)');
  });

  test('workout_session_exercises has RLS enabled and scopes access through user sessions', () => {
    expect(migrationSql).toContain(
      'ALTER TABLE public.workout_session_exercises ENABLE ROW LEVEL SECURITY;'
    );
    expect(migrationSql).toContain(
      'CREATE POLICY "Users can manage session exercises through their sessions"'
    );
    expect(migrationSql).toContain('ws.user_id = auth.uid()');
  });

  test('user_skill_progress has RLS enabled and isolates user skill data', () => {
    expect(migrationSql).toContain(
      'ALTER TABLE public.user_skill_progress ENABLE ROW LEVEL SECURITY;'
    );
    expect(migrationSql).toContain('CREATE POLICY "Users can manage their own skill progress"');
    expect(migrationSql).toContain('USING (auth.uid() = user_id)');
  });

  test('enforces status check constraints for workout sessions', () => {
    expect(migrationSql).toContain(
      "CHECK (status IN ('in_progress', 'completed', 'abandoned'))"
    );
  });

  test('enforces assessment status check constraints for user skill progress', () => {
    expect(migrationSql).toContain(
      "CHECK (assessment_status IN ('not_assessed', 'learning', 'proficient', 'mastered'))"
    );
  });

  test('indexes are defined for user_id and foreign keys for high query performance', () => {
    expect(migrationSql).toContain('CREATE INDEX IF NOT EXISTS idx_workout_sessions_user_id');
    expect(migrationSql).toContain('CREATE INDEX IF NOT EXISTS idx_session_exercises_session_id');
    expect(migrationSql).toContain('CREATE INDEX IF NOT EXISTS idx_user_skill_progress_user');
  });
});
