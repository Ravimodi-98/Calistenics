import { normalizeEquipment, isEquipmentAvailable } from '@/domain/utils/equipment';
import { RecommendationEngine } from '@/features/dashboard/services/recommendationEngine';
import { SkillService } from '@/features/skills/services/skillService';
import { Exercise } from '@/domain/models/exercise.model';
import { SkillCatalogItem } from '@/domain/models/skill.model';

describe('Equipment Normalization & Availability Engine (Phase 8.2)', () => {
  describe('normalizeEquipment', () => {
    test('normalizes legacy "pullup_bar" to canonical "pull_up_bar"', () => {
      expect(normalizeEquipment('pullup_bar')).toBe('pull_up_bar');
      expect(normalizeEquipment('pullupbar')).toBe('pull_up_bar');
      expect(normalizeEquipment('PULL_UP_BAR')).toBe('pull_up_bar');
      expect(normalizeEquipment('  pullup_bar  ')).toBe('pull_up_bar');
    });

    test('normalizes bodyweight variations to canonical "none"', () => {
      expect(normalizeEquipment('none')).toBe('none');
      expect(normalizeEquipment('no_equipment')).toBe('none');
      expect(normalizeEquipment('bodyweight')).toBe('none');
      expect(normalizeEquipment(null)).toBe('none');
      expect(normalizeEquipment(undefined)).toBe('none');
    });

    test('normalizes vertical pole / stall bars to canonical "vertical_support"', () => {
      expect(normalizeEquipment('vertical_support')).toBe('vertical_support');
      expect(normalizeEquipment('verticalsupport')).toBe('vertical_support');
      expect(normalizeEquipment('vertical_pole')).toBe('vertical_support');
    });
  });

  describe('isEquipmentAvailable', () => {
    test('no-equipment requirements are ALWAYS satisfied regardless of user equipment', () => {
      expect(isEquipmentAvailable(['none'], 'none')).toBe(true);
      expect(isEquipmentAvailable(['pull_up_bar'], 'none')).toBe(true);
      expect(isEquipmentAvailable(['pullup_bar'], 'none')).toBe(true);
      expect(isEquipmentAvailable([], 'none')).toBe(true);
    });

    test('pull_up_bar requirement is satisfied by canonical "pull_up_bar"', () => {
      expect(isEquipmentAvailable(['pull_up_bar'], 'pull_up_bar')).toBe(true);
      expect(isEquipmentAvailable(['none', 'pull_up_bar'], 'pull_up_bar')).toBe(true);
    });

    test('pull_up_bar requirement is satisfied by legacy "pullup_bar"', () => {
      expect(isEquipmentAvailable(['pullup_bar'], 'pull_up_bar')).toBe(true);
      expect(isEquipmentAvailable(['none', 'pullup_bar'], 'pull_up_bar')).toBe(true);
    });

    test('pull_up_bar requirement fails when user only has ["none"]', () => {
      expect(isEquipmentAvailable(['none'], 'pull_up_bar')).toBe(false);
      expect(isEquipmentAvailable([], 'pull_up_bar')).toBe(false);
    });

    test('handles legacy requirement "pullup_bar" correctly against canonical user equipment', () => {
      expect(isEquipmentAvailable(['pull_up_bar'], 'pullup_bar')).toBe(true);
    });

    test('strictly rejects invalid or unsupported equipment identifiers', () => {
      expect(isEquipmentAvailable(['none'], 'dumbbells')).toBe(false);
      expect(isEquipmentAvailable(['none'], 'resistance_bands')).toBe(false);
      expect(isEquipmentAvailable(['none'], 'cable_machine')).toBe(false);
    });
  });

  describe('RecommendationEngine filterByEquipment with normalized equipment', () => {
    const engine = new RecommendationEngine();

    const mockExercises: Exercise[] = [
      {
        id: 'ex-1',
        slug: 'push-up',
        name: 'Standard Push-Up',
        description: 'Horizontal pushing bodyweight movement.',
        category: 'push',
        equipment_required: 'none',
        difficulty: 'beginner',
        primary_muscles: ['chest', 'triceps'],
        secondary_muscles: ['core'],
        instructions: [{ step: 1, title: 'Setup', cue: 'Plank position' }],
        prerequisites: [],
        progression_exercises: [],
        regressions: [],
        safety_notes: null,
        disclaimer: null,
        animation_asset_path: 'push_up',
        animation_format: 'lottie',
        content_status: 'published',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'ex-2',
        slug: 'pull-up',
        name: 'Standard Pull-Up',
        description: 'Vertical pull using pull-up bar.',
        category: 'pull',
        equipment_required: 'pull_up_bar',
        difficulty: 'intermediate',
        primary_muscles: ['lats', 'biceps'],
        secondary_muscles: ['core'],
        instructions: [{ step: 1, title: 'Hang', cue: 'Overhand grip' }],
        prerequisites: [],
        progression_exercises: [],
        regressions: [],
        safety_notes: null,
        disclaimer: null,
        animation_asset_path: 'pull_up',
        animation_format: 'lottie',
        content_status: 'published',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    test('users with only "none" NEVER receive pull-up bar exercises', () => {
      const filtered = engine.filterByEquipment(mockExercises, ['none']);
      expect(filtered).toHaveLength(1);
      expect(filtered[0].id).toBe('ex-1');
      expect(filtered.some((e) => e.equipment_required === 'pull_up_bar')).toBe(false);
    });

    test('users with legacy "pullup_bar" receive both bodyweight and pull-up bar exercises', () => {
      const filtered = engine.filterByEquipment(mockExercises, ['pullup_bar']);
      expect(filtered).toHaveLength(2);
      expect(filtered.some((e) => e.equipment_required === 'pull_up_bar')).toBe(true);
    });

    test('users with canonical "pull_up_bar" receive both bodyweight and pull-up bar exercises', () => {
      const filtered = engine.filterByEquipment(mockExercises, ['none', 'pull_up_bar']);
      expect(filtered).toHaveLength(2);
      expect(filtered.some((e) => e.equipment_required === 'pull_up_bar')).toBe(true);
    });
  });

  describe('SkillService filterByEquipment with normalized equipment', () => {
    const service = new SkillService();

    const mockSkills: SkillCatalogItem[] = [
      {
        id: 'skill-1',
        slug: 'handstand',
        name: 'Handstand',
        description: 'Balance on hands.',
        difficulty: 'intermediate',
        equipment_required: 'none',
        primary_muscles: ['shoulders', 'core'],
        secondary_muscles: ['triceps'],
        prerequisites: [],
        safety_notes: null,
        animation_asset: 'handstand',
        content_status: 'published',
      },
      {
        id: 'skill-2',
        slug: 'muscle-up',
        name: 'Bar Muscle-Up',
        description: 'Pull-up transition into straight-bar dip.',
        difficulty: 'advanced',
        equipment_required: 'pull_up_bar',
        primary_muscles: ['lats', 'chest', 'triceps'],
        secondary_muscles: ['core'],
        prerequisites: [],
        safety_notes: null,
        animation_asset: 'muscle_up',
        content_status: 'published',
      },
    ];

    test('user with ["none"] sees only zero-equipment skills', () => {
      // Accessing private filter method through service catalog
      const result = (service as any).filterByEquipment(mockSkills, ['none']);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('skill-1');
    });

    test('user with legacy ["pullup_bar"] sees both handstand and muscle-up', () => {
      const result = (service as any).filterByEquipment(mockSkills, ['pullup_bar']);
      expect(result).toHaveLength(2);
    });

    test('user with canonical ["pull_up_bar"] sees both handstand and muscle-up', () => {
      const result = (service as any).filterByEquipment(mockSkills, ['none', 'pull_up_bar']);
      expect(result).toHaveLength(2);
    });
  });
});
