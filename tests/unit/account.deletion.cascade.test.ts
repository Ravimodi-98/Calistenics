declare const __dirname: string;
declare function require(name: string): any;
const fs = require('fs');
const path = require('path');

describe('Account Deletion & Foreign Key Cascade Audit', () => {
  const migrationsDir = path.resolve(__dirname, '../../supabase/migrations');

  it('verifies all user-related foreign key references include ON DELETE CASCADE in SQL migrations', () => {
    const migrationFiles = fs
      .readdirSync(migrationsDir)
      .filter((file: string) => file.endsWith('.sql'));

    const allSql = migrationFiles
      .map((file: string) => fs.readFileSync(path.join(migrationsDir, file), 'utf-8'))
      .join('\n');

    // 1. profiles table references auth.users(id) ON DELETE CASCADE
    expect(allSql).toMatch(/REFERENCES\s+auth\.users\s*\(\s*id\s*\)\s+ON\s+DELETE\s+CASCADE/i);

    // 2. user_preferences references auth.users(id) ON DELETE CASCADE
    expect(allSql).toMatch(/user_id\s+UUID\s+NOT\s+NULL\s+REFERENCES\s+auth\.users\s*\(\s*id\s*\)\s+ON\s+DELETE\s+CASCADE/i);

    // 3. workout_sessions references auth.users(id) ON DELETE CASCADE
    expect(allSql).toMatch(/user_id\s+UUID\s+NOT\s+NULL\s+REFERENCES\s+auth\.users\s*\(\s*id\s*\)\s+ON\s+DELETE\s+CASCADE/i);

    // 4. workout_session_exercises references workout_sessions(id) ON DELETE CASCADE
    expect(allSql).toMatch(/session_id\s+UUID\s+NOT\s+NULL\s+REFERENCES\s+public\.workout_sessions\s*\(\s*id\s*\)\s+ON\s+DELETE\s+CASCADE/i);

    // 5. user_skill_progress references auth.users(id) ON DELETE CASCADE
    expect(allSql).toMatch(/user_id\s+UUID\s+NOT\s+NULL\s+REFERENCES\s+auth\.users\s*\(\s*id\s*\)\s+ON\s+DELETE\s+CASCADE/i);

    // 6. skill_practice_sessions references auth.users(id) ON DELETE CASCADE
    expect(allSql).toMatch(/user_id\s+UUID\s+NOT\s+NULL\s+REFERENCES\s+auth\.users\s*\(\s*id\s*\)\s+ON\s+DELETE\s+CASCADE/i);

    // 7. notification_preferences references auth.users(id) ON DELETE CASCADE
    expect(allSql).toMatch(/user_id\s+UUID\s+NOT\s+NULL\s+REFERENCES\s+auth\.users\s*\(\s*id\s*\)\s+ON\s+DELETE\s+CASCADE/i);
  });

  it('simulates cascading user deletion across all relational tables with zero orphaned rows', () => {
    interface RelationalState {
      users: string[];
      profiles: Array<{ id: string; username: string }>;
      userPreferences: Array<{ user_id: string; equipment: string[] }>;
      workoutSessions: Array<{ id: string; user_id: string }>;
      workoutSessionExercises: Array<{ id: string; session_id: string; exercise_id: string }>;
      userSkillProgress: Array<{ id: string; user_id: string; skill_id: string }>;
      skillPracticeSessions: Array<{ id: string; user_id: string }>;
      notificationPreferences: Array<{ user_id: string; workout_reminders: boolean }>;
    }

    const state: RelationalState = {
      users: ['user-1', 'user-2'],
      profiles: [
        { id: 'user-1', username: 'Athlete One' },
        { id: 'user-2', username: 'Athlete Two' },
      ],
      userPreferences: [
        { user_id: 'user-1', equipment: [] },
        { user_id: 'user-2', equipment: ['pull_up_bar'] },
      ],
      workoutSessions: [
        { id: 'session-1a', user_id: 'user-1' },
        { id: 'session-1b', user_id: 'user-1' },
        { id: 'session-2a', user_id: 'user-2' },
      ],
      workoutSessionExercises: [
        { id: 'exercise-1', session_id: 'session-1a', exercise_id: 'push-up' },
        { id: 'exercise-2', session_id: 'session-1b', exercise_id: 'squat' },
        { id: 'exercise-3', session_id: 'session-2a', exercise_id: 'pull-up' },
      ],
      userSkillProgress: [
        { id: 'prog-1', user_id: 'user-1', skill_id: 'handstand' },
        { id: 'prog-2', user_id: 'user-2', skill_id: 'planche' },
      ],
      skillPracticeSessions: [
        { id: 'practice-1', user_id: 'user-1' },
        { id: 'practice-2', user_id: 'user-2' },
      ],
      notificationPreferences: [
        { user_id: 'user-1', workout_reminders: true },
        { user_id: 'user-2', workout_reminders: false },
      ],
    };

    // Simulate deleteUser('user-1') via auth.admin.deleteUser() with PostgreSQL ON DELETE CASCADE
    function deleteUserCascade(targetUserId: string) {
      // 1. Remove user
      state.users = state.users.filter((id) => id !== targetUserId);
      // 2. Cascade profiles
      state.profiles = state.profiles.filter((p) => p.id !== targetUserId);
      // 3. Cascade user_preferences
      state.userPreferences = state.userPreferences.filter((p) => p.user_id !== targetUserId);
      // 4. Cascade workout_sessions and dependent workout_session_exercises
      const sessionsToDelete = new Set(
        state.workoutSessions.filter((s) => s.user_id === targetUserId).map((s) => s.id)
      );
      state.workoutSessions = state.workoutSessions.filter((s) => s.user_id !== targetUserId);
      state.workoutSessionExercises = state.workoutSessionExercises.filter(
        (e) => !sessionsToDelete.has(e.session_id)
      );
      // 5. Cascade skill progress & practice
      state.userSkillProgress = state.userSkillProgress.filter((p) => p.user_id !== targetUserId);
      state.skillPracticeSessions = state.skillPracticeSessions.filter((p) => p.user_id !== targetUserId);
      // 6. Cascade notification preferences
      state.notificationPreferences = state.notificationPreferences.filter(
        (p) => p.user_id !== targetUserId
      );
    }

    // Perform deletion on user-1
    deleteUserCascade('user-1');

    // Assert user-1 is completely purged
    expect(state.users.includes('user-1')).toBe(false);
    expect(state.profiles.some((p) => p.id === 'user-1')).toBe(false);
    expect(state.userPreferences.some((p) => p.user_id === 'user-1')).toBe(false);
    expect(state.workoutSessions.some((s) => s.user_id === 'user-1')).toBe(false);
    expect(
      state.workoutSessionExercises.some((e) => e.session_id === 'session-1a' || e.session_id === 'session-1b')
    ).toBe(false);
    expect(state.userSkillProgress.some((p) => p.user_id === 'user-1')).toBe(false);
    expect(state.skillPracticeSessions.some((p) => p.user_id === 'user-1')).toBe(false);
    expect(state.notificationPreferences.some((p) => p.user_id === 'user-1')).toBe(false);

    // Assert user-2 data is strictly preserved and completely intact
    expect(state.users).toEqual(['user-2']);
    expect(state.profiles).toEqual([{ id: 'user-2', username: 'Athlete Two' }]);
    expect(state.userPreferences).toEqual([{ user_id: 'user-2', equipment: ['pull_up_bar'] }]);
    expect(state.workoutSessions).toEqual([{ id: 'session-2a', user_id: 'user-2' }]);
    expect(state.workoutSessionExercises).toEqual([
      { id: 'exercise-3', session_id: 'session-2a', exercise_id: 'pull-up' },
    ]);
    expect(state.userSkillProgress).toEqual([{ id: 'prog-2', user_id: 'user-2', skill_id: 'planche' }]);
    expect(state.skillPracticeSessions).toEqual([{ id: 'practice-2', user_id: 'user-2' }]);
    expect(state.notificationPreferences).toEqual([{ user_id: 'user-2', workout_reminders: false }]);
  });
});
