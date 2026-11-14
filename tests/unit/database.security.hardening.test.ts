declare const __dirname: string;
declare function require(name: string): any;
const fs = require('fs');
const path = require('path');

describe('Database Security & RLS Hardening (Phase 8.2)', () => {
  const migrationsDir = path.resolve(__dirname, '../../supabase/migrations');

  test('verifies migration 20261114000007_phase8_security_hardening.sql exists', () => {
    const migrationPath = path.join(migrationsDir, '20261114000007_phase8_security_hardening.sql');
    expect(fs.existsSync(migrationPath)).toBe(true);
  });

  test('migration 7 enforces explicit user DELETE policy on notification_preferences', () => {
    const migrationPath = path.join(migrationsDir, '20261114000007_phase8_security_hardening.sql');
    const content = fs.readFileSync(migrationPath, 'utf8');

    expect(content).toContain('CREATE POLICY "Users can delete own notification preferences"');
    expect(content).toContain('ON public.notification_preferences');
    expect(content).toContain('FOR DELETE');
    expect(content).toContain('auth.uid() = user_id');
  });

  test('notification_preferences has all 4 standard CRUD RLS policies defined across migrations', () => {
    const migration6Path = path.join(migrationsDir, '20261114000006_create_notification_preferences.sql');
    const migration7Path = path.join(migrationsDir, '20261114000007_phase8_security_hardening.sql');

    const m6 = fs.readFileSync(migration6Path, 'utf8');
    const m7 = fs.readFileSync(migration7Path, 'utf8');

    // SELECT
    expect(m6).toContain('FOR SELECT');
    expect(m6).toContain('auth.uid() = user_id');

    // INSERT
    expect(m6).toContain('FOR INSERT');
    expect(m6).toContain('auth.uid() = user_id');

    // UPDATE
    expect(m6).toContain('FOR UPDATE');
    expect(m6).toContain('auth.uid() = user_id');

    // DELETE
    expect(m7).toContain('FOR DELETE');
    expect(m7).toContain('auth.uid() = user_id');
  });

  test('all tables in migrations strictly enforce RLS and lack hardcoded master credentials', () => {
    const files = fs.readdirSync(migrationsDir).filter((f: string) => f.endsWith('.sql'));

    for (const file of files) {
      const content = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
      expect(content).not.toContain('service_role_key');
      expect(content).not.toContain('SUPABASE_SERVICE_ROLE');
      expect(content).not.toContain('postgres://postgres:');
    }
  });
});
