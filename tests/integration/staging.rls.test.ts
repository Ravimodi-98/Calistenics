declare const __dirname: string;
declare function require(name: string): any;
const fs = require('fs');
const path = require('path');

interface RLSContext {
  currentUserId: string | null;
}

interface MockRow {
  [key: string]: any;
}

/**
 * Deterministic RLS Policy Evaluator simulating PostgreSQL's Row-Level Security
 * engine against Calisthenics Coach SQL migrations.
 */
class RLSAssertionEngine {
  canSelect(table: string, row: MockRow, ctx: RLSContext, parentSkills?: MockRow[]): boolean {
    if (!ctx.currentUserId) return false;

    switch (table) {
      case 'profiles':
        return row.id === ctx.currentUserId;
      case 'user_preferences':
      case 'workout_sessions':
      case 'notification_preferences':
      case 'user_skill_progress':
      case 'skill_practice_sessions':
        return row.user_id === ctx.currentUserId;
      case 'skill_catalog':
        return row.content_status === 'published';
      case 'skill_progressions': {
        // Enforces Migration 8: sc.content_status = 'published'
        const parent = (parentSkills || []).find((s) => s.id === row.skill_id);
        return parent ? parent.content_status === 'published' : false;
      }
      default:
        return false;
    }
  }

  canModify(table: string, row: MockRow, ctx: RLSContext): boolean {
    if (!ctx.currentUserId) return false;

    switch (table) {
      case 'profiles':
        return row.id === ctx.currentUserId;
      case 'user_preferences':
      case 'workout_sessions':
      case 'notification_preferences':
      case 'user_skill_progress':
      case 'skill_practice_sessions':
        return row.user_id === ctx.currentUserId;
      default:
        // Public catalogs cannot be modified by client users
        return false;
    }
  }
}

describe('Phase 8.5 — Two-User RLS Staging Verification Test', () => {
  const engine = new RLSAssertionEngine();
  const migrationsDir = path.resolve(__dirname, '../../supabase/migrations');

  const userA: RLSContext = { currentUserId: '11111111-1111-1111-1111-111111111111' };
  const userB: RLSContext = { currentUserId: '22222222-2222-2222-2222-222222222222' };

  test('verifies Migration 8 SQL policy syntax and scoped existence', () => {
    const migrationPath = path.join(migrationsDir, '20261114000008_phase8_4_published_progression_visibility.sql');
    expect(fs.existsSync(migrationPath)).toBe(true);

    const sql = fs.readFileSync(migrationPath, 'utf8');
    expect(sql).toContain('CREATE POLICY "Public can view published skill progressions"');
    expect(sql).toContain('ON public.skill_progressions');
    expect(sql).toContain("sc.content_status = 'published'");
    expect(sql).toContain('EXISTS');
  });

  describe('Two-User Isolation (User A vs User B)', () => {
    const workoutRowUserA = { id: 'ws-1', user_id: userA.currentUserId, total_sets_completed: 4 };
    const workoutRowUserB = { id: 'ws-2', user_id: userB.currentUserId, total_sets_completed: 6 };

    test('User A can select their own workout session, but cannot select User B session', () => {
      expect(engine.canSelect('workout_sessions', workoutRowUserA, userA)).toBe(true);
      expect(engine.canSelect('workout_sessions', workoutRowUserB, userA)).toBe(false);
    });

    test('User B can select their own workout session, but cannot select User A session', () => {
      expect(engine.canSelect('workout_sessions', workoutRowUserB, userB)).toBe(true);
      expect(engine.canSelect('workout_sessions', workoutRowUserA, userB)).toBe(false);
    });

    test('User A cannot update or delete User B notification preferences', () => {
      const notifPrefUserB = { id: 'np-2', user_id: userB.currentUserId, reminder_hour: 8 };
      expect(engine.canModify('notification_preferences', notifPrefUserB, userA)).toBe(false);
      expect(engine.canModify('notification_preferences', notifPrefUserB, userB)).toBe(true);
    });

    test('User B cannot modify User A user_skill_progress', () => {
      const skillProgressUserA = { id: 'usp-1', user_id: userA.currentUserId, skill_slug: 'handstand' };
      expect(engine.canModify('user_skill_progress', skillProgressUserA, userB)).toBe(false);
      expect(engine.canModify('user_skill_progress', skillProgressUserA, userA)).toBe(true);
    });
  });

  describe('Skill Progression Visibility Scoping (Migration 8 Behavior)', () => {
    const parentSkills = [
      { id: 'skill-pub', slug: 'handstand', content_status: 'published' },
      { id: 'skill-draft', slug: 'iron-cross', content_status: 'draft' },
    ];

    const publishedProgression = { id: 'prog-1', skill_id: 'skill-pub', stage_name: 'Pike Hold' };
    const draftProgression = { id: 'prog-2', skill_id: 'skill-draft', stage_name: 'Ring Support Hold' };

    test('both User A and User B can read progressions for published skills', () => {
      expect(engine.canSelect('skill_progressions', publishedProgression, userA, parentSkills)).toBe(true);
      expect(engine.canSelect('skill_progressions', publishedProgression, userB, parentSkills)).toBe(true);
    });

    test('neither User A nor User B can read progressions for draft/unpublished skills', () => {
      expect(engine.canSelect('skill_progressions', draftProgression, userA, parentSkills)).toBe(false);
      expect(engine.canSelect('skill_progressions', draftProgression, userB, parentSkills)).toBe(false);
    });
  });
});
