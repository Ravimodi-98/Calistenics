import {
  skillCatalogItemSchema,
  skillProgressionStageSchema,
  recordSkillPracticeSchema,
} from '../../src/domain/schemas/skill.schema';

describe('Skill Zod Schemas Validation', () => {
  describe('skillCatalogItemSchema', () => {
    it('validates a correct skill catalog item', () => {
      const validSkill = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        slug: 'planche',
        name: 'Planche',
        description: 'Elite horizontal bodyweight hold requiring supreme shoulder protraction.',
        difficulty: 'elite',
        equipment_required: 'none',
        primary_muscles: ['anterior_deltoids', 'scapular_protractors'],
        secondary_muscles: ['core'],
        prerequisites: ['pseudo-planche-pushup'],
        safety_notes: 'Warm up wrists thoroughly.',
        animation_asset: 'planche-lean',
        content_status: 'published',
      };

      const result = skillCatalogItemSchema.safeParse(validSkill);
      expect(result.success).toBe(true);
    });

    it('rejects unsupported equipment requirements', () => {
      const invalidSkill = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        slug: 'dumbbells-curl',
        name: 'Bicep Curl',
        description: 'Requires dumbbells for hypertrophy.',
        difficulty: 'beginner',
        equipment_required: 'dumbbells', // invalid!
        primary_muscles: ['biceps'],
        animation_asset: 'curl',
      };

      const result = skillCatalogItemSchema.safeParse(invalidSkill);
      expect(result.success).toBe(false);
    });
  });

  describe('skillProgressionStageSchema', () => {
    it('validates a correct progression stage', () => {
      const validStage = {
        id: '123e4567-e89b-12d3-a456-426614174001',
        skill_id: '123e4567-e89b-12d3-a456-426614174000',
        skill_slug: 'planche',
        stage_order: 1,
        stage_slug: 'planche-lean',
        stage_name: 'Planche Lean',
        description: 'Forward shoulder lean on hands with straight arms and protracted scapulae.',
        target_type: 'hold_seconds',
        target_value: 30,
        prerequisites: [],
        technique_cues: ['Protracted shoulders', 'Straight locked elbows', 'Hollow core'],
        safety_notes: 'Stop immediately if wrist anterior pain arises.',
        animation_asset: 'planche-lean',
        assessment_criteria: 'Hold 30 seconds at a 45-degree forward lean with locked arms.',
      };

      const result = skillProgressionStageSchema.safeParse(validStage);
      expect(result.success).toBe(true);
    });

    it('rejects invalid stage_order (< 1)', () => {
      const invalidStage = {
        skill_slug: 'planche',
        stage_order: 0, // invalid (< 1)
        stage_slug: 'invalid-stage',
        stage_name: 'Invalid',
        description: 'Should fail validation',
        target_type: 'hold_seconds',
        target_value: 30,
        animation_asset: 'planche-lean',
        assessment_criteria: 'Criteria description is long enough',
      };

      const result = skillProgressionStageSchema.safeParse(invalidStage);
      expect(result.success).toBe(false);
    });
  });

  describe('recordSkillPracticeSchema', () => {
    it('validates valid practice inputs with hold seconds and RPE', () => {
      const input = {
        skill_slug: 'l-sit',
        stage_slug: 'floor-tuck-l-sit',
        duration_seconds: 300,
        completed_sets: 4,
        recorded_hold_seconds: 22,
        effort_rating: 4,
        notes: 'Great compression today',
      };

      const result = recordSkillPracticeSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('rejects invalid RPE (e.g. 0 or 6)', () => {
      const invalidInput = {
        skill_slug: 'l-sit',
        stage_slug: 'floor-tuck-l-sit',
        duration_seconds: 300,
        completed_sets: 4,
        recorded_hold_seconds: 22,
        effort_rating: 6, // RPE is 1 to 5
      };

      const result = recordSkillPracticeSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('rejects zero or negative sets', () => {
      const invalidInput = {
        skill_slug: 'l-sit',
        stage_slug: 'floor-tuck-l-sit',
        duration_seconds: 120,
        completed_sets: 0,
      };

      const result = recordSkillPracticeSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
  });
});
