import { SkillService } from '../../src/features/skills/services/skillService';
import { FALLBACK_SKILL_CATALOG } from '../../src/features/skills/services/fallbackSkillsData';

jest.mock('../../src/services/supabase/client', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: null, error: new Error('Fallback') }),
      maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
      insert: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: new Error('Local') }),
    })),
  },
}));

describe('SkillService & Equipment Filtering', () => {
  let service: SkillService;

  beforeEach(() => {
    service = new SkillService();
  });

  describe('Skill Catalog & No Equipment First Philosophy', () => {
    it('returns all 8 canonical skills when no equipment filter is applied', async () => {
      const skills = await service.getSkillCatalog();
      expect(skills.length).toBe(8);

      const slugs = skills.map((s) => s.slug).sort();
      expect(slugs).toEqual([
        'back-lever',
        'front-lever',
        'handstand',
        'human-flag',
        'l-sit',
        'muscle-up',
        'pistol-squat',
        'planche',
      ]);
    });

    it('strictly returns only bodyweight skills when equipment is "none"', async () => {
      const noEquipSkills = await service.getSkillCatalog(['none']);
      expect(noEquipSkills.length).toBe(4);

      const slugs = noEquipSkills.map((s) => s.slug).sort();
      expect(slugs).toEqual(['handstand', 'l-sit', 'pistol-squat', 'planche']);
      noEquipSkills.forEach((s) => {
        expect(s.equipment_required).toBe('none');
      });
    });

    it('returns pull-up bar skills when "pull_up_bar" is available, but excludes human flag', async () => {
      const barSkills = await service.getSkillCatalog(['none', 'pull_up_bar']);
      expect(barSkills.length).toBe(7);

      const hasHumanFlag = barSkills.some((s) => s.slug === 'human-flag');
      expect(hasHumanFlag).toBe(false);

      const pullUpSkills = barSkills.filter((s) => s.equipment_required === 'pull_up_bar');
      expect(pullUpSkills.length).toBe(3);
      expect(pullUpSkills.map((s) => s.slug).sort()).toEqual([
        'back-lever',
        'front-lever',
        'muscle-up',
      ]);
    });

    it('only includes human flag when "vertical_support" is explicitly in allowed equipment', async () => {
      const allSkills = await service.getSkillCatalog([
        'none',
        'pull_up_bar',
        'vertical_support',
      ]);
      expect(allSkills.length).toBe(8);

      const humanFlag = allSkills.find((s) => s.slug === 'human-flag');
      expect(humanFlag).toBeDefined();
      expect(humanFlag?.equipment_required).toBe('vertical_support');
    });
  });

  describe('Skill Detail & Pathway Retrieval', () => {
    it('fetches a skill by its slug correctly', async () => {
      const skill = await service.getSkillBySlug('handstand');
      expect(skill).not.toBeNull();
      expect(skill?.name).toBe('Handstand');
      expect(skill?.equipment_required).toBe('none');
    });

    it('returns null for unknown skill slug', async () => {
      const skill = await service.getSkillBySlug('unknown-skill');
      expect(skill).toBeNull();
    });

    it('retrieves exactly 6 sequential stages for every canonical skill pathway', async () => {
      for (const skill of FALLBACK_SKILL_CATALOG) {
        const stages = await service.getSkillPathway(skill.slug);
        expect(stages.length).toBe(6);

        // Verify sequential 1 to 6 order
        stages.forEach((stage, index) => {
          expect(stage.stage_order).toBe(index + 1);
          expect(stage.skill_slug).toBe(skill.slug);
          expect(stage.stage_name.length).toBeGreaterThan(0);
          expect(stage.target_value).toBeGreaterThan(0);
        });
      }
    });
  });

  describe('Practice Recording and Metric Updates', () => {
    it('records a hold session and creates a local fallback record if Supabase is offline', async () => {
      const result = await service.recordSkillPractice('test-user-id', {
        skill_slug: 'handstand',
        stage_slug: 'chest-to-wall-hold',
        duration_seconds: 180,
        completed_sets: 3,
        recorded_hold_seconds: 35,
        effort_rating: 4,
        notes: 'Felt solid wrist alignment and shoulder elevation',
      });

      expect(result.session).toBeDefined();
      expect(result.session.completed_sets).toBe(3);
      expect(result.session.recorded_hold_seconds).toBe(35);
      expect(result.progress).toBeDefined();
      expect(result.progress.skill_slug).toBe('handstand');
      expect(result.progress.best_hold_seconds).toBe(35);
    });

    it('records a rep session and tracks best reps', async () => {
      const result = await service.recordSkillPractice('test-user-id', {
        skill_slug: 'pistol-squat',
        stage_slug: 'box-pistol-squat',
        duration_seconds: 120,
        completed_sets: 4,
        recorded_reps: 8,
        effort_rating: 3,
      });

      expect(result.session.recorded_reps).toBe(8);
      expect(result.progress.best_reps).toBe(8);
    });
  });
});
