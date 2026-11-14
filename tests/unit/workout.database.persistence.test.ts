declare const __dirname: string;
declare function require(name: string): any;
const fs = require('fs');
const path = require('path');

describe('Phase 5 — Workout Player Database Schema & Migration Verification', () => {
  let migrationSql: string;

  beforeAll(() => {
    const migrationPath = path.resolve(
      __dirname,
      '../../supabase/migrations/20261114000004_extend_workout_session_tracking.sql'
    );
    migrationSql = fs.readFileSync(migrationPath, 'utf8');
  });

  test('workout_sessions is extended with total set and rep aggregate metrics', () => {
    expect(migrationSql).toContain('ALTER TABLE public.workout_sessions');
    expect(migrationSql).toContain('total_sets_completed INTEGER NOT NULL DEFAULT 0');
    expect(migrationSql).toContain('total_reps_completed INTEGER NOT NULL DEFAULT 0');
  });

  test('workout_session_exercises is extended with target sets, target reps, and hold seconds', () => {
    expect(migrationSql).toContain('ALTER TABLE public.workout_session_exercises');
    expect(migrationSql).toContain('target_sets INTEGER NOT NULL DEFAULT 3');
    expect(migrationSql).toContain('target_reps INTEGER NOT NULL DEFAULT 10');
    expect(migrationSql).toContain('hold_seconds_completed INTEGER NOT NULL DEFAULT 0');
    expect(migrationSql).toContain('order_index INTEGER NOT NULL DEFAULT 0');
  });

  test('seeds comprehensive push exercises with zero equipment', () => {
    expect(migrationSql).toContain("'wide-push-up'");
    expect(migrationSql).toContain("'decline-push-up'");
    expect(migrationSql).toContain("'pseudo-planche-push-up'");
  });

  test('seeds lower-body and core progressions with strict category constraints', () => {
    expect(migrationSql).toContain("'bulgarian-split-squat'");
    expect(migrationSql).toContain("'jump-squat'");
    expect(migrationSql).toContain("'pistol-squat-progression'");
    expect(migrationSql).toContain("'side-plank'");
    expect(migrationSql).toContain("'reverse-crunch'");
  });

  test('seeds chin-up and hanging-knee-raise requiring pull_up_bar', () => {
    expect(migrationSql).toContain("'chin-up'");
    expect(migrationSql).toContain("'hanging-knee-raise'");
    expect(migrationSql).toContain("'pull_up_bar'");
  });
});

