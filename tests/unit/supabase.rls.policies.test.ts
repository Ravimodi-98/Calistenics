declare const __dirname: string;
declare function require(name: string): any;
const fs = require('fs');
const path = require('path');

describe('Supabase RLS Policy & Permissive OR Evaluation Audit', () => {
  const migrationsDir = path.resolve(__dirname, '../../supabase/migrations');

  const migration5Path = path.join(migrationsDir, '20261114000005_create_skills_and_progressions.sql');
  const migration8Path = path.join(migrationsDir, '20261114000008_phase8_4_published_progression_visibility.sql');

  const sql5 = fs.readFileSync(migration5Path, 'utf8');
  const sql8 = fs.readFileSync(migration8Path, 'utf8');

  test('identifies that Migration 5 originally introduced a permissive USING (true) policy', () => {
    expect(sql5).toMatch(/CREATE\s+POLICY\s+"Public can view skill progressions"/i);
    expect(sql5).toMatch(/ON\s+public\.skill_progressions/i);
    expect(sql5).toMatch(/FOR\s+SELECT/i);
    expect(sql5).toMatch(/USING\s*\(\s*true\s*\)/i);
  });

  test('verifies Migration 8 explicitly DROPS the obsolete permissive policy and its variants', () => {
    // Must drop the original policy name from Migration 5
    expect(sql8).toContain('DROP POLICY IF EXISTS "Public can view skill progressions" ON public.skill_progressions;');
    // Must drop any previous or draft published policy names
    expect(sql8).toContain('DROP POLICY IF EXISTS "Public can view published skill progressions" ON public.skill_progressions;');
    expect(sql8).toContain('DROP POLICY IF EXISTS "Skill progressions are viewable by everyone" ON public.skill_progressions;');
    expect(sql8).toContain('DROP POLICY IF EXISTS "Enable read access for all users" ON public.skill_progressions;');
    expect(sql8).toContain('DROP POLICY IF EXISTS "Allow public read access" ON public.skill_progressions;');
    expect(sql8).toContain('DROP POLICY IF EXISTS "Users can view skill progressions" ON public.skill_progressions;');
  });

  test('verifies Migration 8 creates the scoped policy for anon and authenticated users', () => {
    expect(sql8).toMatch(/CREATE\s+POLICY\s+"Public can view published skill progressions"/i);
    expect(sql8).toMatch(/ON\s+public\.skill_progressions/i);
    expect(sql8).toMatch(/FOR\s+SELECT/i);
    expect(sql8).toMatch(/TO\s+anon,\s*authenticated/i);
    expect(sql8).toMatch(/sc\.content_status\s*=\s*'published'/i);
  });

  test('verifies Migration 8 explicitly preserves administrator / service role access', () => {
    expect(sql8).toMatch(/CREATE\s+POLICY\s+"Admins have full access to skill progressions"/i);
    expect(sql8).toMatch(/FOR\s+ALL/i);
    expect(sql8).toMatch(/auth\.jwt\(\)->>'role'/i);
    expect(sql8).toMatch(/service_role/i);
  });

  test('demonstrates PostgreSQL permissive OR evaluation vulnerability and its resolution', () => {
    // Model PostgreSQL RLS Permissive Policy Combining Rule:
    // If multiple permissive policies apply to a table and command, PostgreSQL combines them with OR:
    // Result = Policy_1_Condition OR Policy_2_Condition
    
    interface SkillCatalogRow {
      id: string;
      content_status: 'draft' | 'published';
    }

    interface ProgressionRow {
      id: string;
      skill_id: string;
    }

    const parentSkills: SkillCatalogRow[] = [
      { id: 'published-skill', content_status: 'published' },
      { id: 'draft-skill', content_status: 'draft' },
    ];

    const draftProgression: ProgressionRow = {
      id: 'draft-prog-1',
      skill_id: 'draft-skill',
    };

    const policy5Condition = (_row: ProgressionRow) => true; // Migration 5: USING (true)
    const policy8Condition = (row: ProgressionRow) => {
      const parent = parentSkills.find((s) => s.id === row.skill_id);
      return parent ? parent.content_status === 'published' : false;
    };

    // VULNERABILITY DEMONSTRATION:
    // If Migration 5's policy is NOT dropped, PostgreSQL evaluates Policy5 OR Policy8:
    const leakingResult = policy5Condition(draftProgression) || policy8Condition(draftProgression);
    // Because policy5 is true, leakingResult is TRUE (Security Leak!)
    expect(leakingResult).toBe(true);

    // REMEDIATION VERIFICATION:
    // When Migration 8 drops Policy 5, only Policy 8 is evaluated:
    const remediatedResult = policy8Condition(draftProgression);
    // Draft progression read is strictly BLOCKED!
    expect(remediatedResult).toBe(false);
  });
});
