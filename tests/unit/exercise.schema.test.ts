import {
  exerciseSchema,
  exerciseCategoryEnum,
  exerciseEquipmentEnum,
  exerciseDifficultyEnum,
} from '../../src/domain/schemas/exercise.schema';
import { Exercise } from '../../src/domain/models/exercise.model';

describe('Exercise Zod Schemas & No Equipment First Rules', () => {
  const validExercise: Exercise = {
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    slug: 'prone-cobra',
    name: 'Prone Cobra',
    description: 'Floor-based upper back postural exercise.',
    category: 'no_equipment',
    equipment_required: 'none',
    difficulty: 'beginner',
    primary_muscles: ['rhomboids', 'rear_deltoids'],
    secondary_muscles: ['erector_spinae'],
    instructions: [
      { step: 1, title: 'Setup', cue: 'Lie flat face down.' },
      { step: 2, title: 'Squeeze', cue: 'Pinch shoulder blades together.' },
    ],
    prerequisites: [],
    progression_exercises: ['prone-y-t-w-raises'],
    regressions: [],
    safety_notes: 'Keep neck neutral.',
    disclaimer: 'Floor pulling builds posture but does not replace vertical pull-up resistance.',
    animation_asset_path: 'assets/animations/exercise-placeholder.json',
    animation_format: 'lottie_json',
    content_status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  test('valid exercise passes schema validation', () => {
    const result = exerciseSchema.safeParse(validExercise);
    expect(result.success).toBe(true);
  });

  test('accepts all 6 core categories', () => {
    const categories = ['no_equipment', 'push', 'pull', 'legs', 'core', 'skills'];
    categories.forEach((cat) => {
      const result = exerciseCategoryEnum.safeParse(cat);
      expect(result.success).toBe(true);
    });
  });

  test('rejects unauthorized exercise categories', () => {
    const result = exerciseCategoryEnum.safeParse('cardio_treadmill');
    expect(result.success).toBe(false);
  });

  test('strictly restricts equipment to "none" and "pull_up_bar"', () => {
    expect(exerciseEquipmentEnum.safeParse('none').success).toBe(true);
    expect(exerciseEquipmentEnum.safeParse('pull_up_bar').success).toBe(true);

    // Forbidden equipment in core MVP
    expect(exerciseEquipmentEnum.safeParse('dumbbells').success).toBe(false);
    expect(exerciseEquipmentEnum.safeParse('gym_access').success).toBe(false);
    expect(exerciseEquipmentEnum.safeParse('rings').success).toBe(false);
    expect(exerciseEquipmentEnum.safeParse('resistance_bands').success).toBe(false);
  });

  test('validates difficulties: beginner, intermediate, advanced', () => {
    expect(exerciseDifficultyEnum.safeParse('beginner').success).toBe(true);
    expect(exerciseDifficultyEnum.safeParse('intermediate').success).toBe(true);
    expect(exerciseDifficultyEnum.safeParse('advanced').success).toBe(true);
    expect(exerciseDifficultyEnum.safeParse('elite_olympian').success).toBe(false);
  });
});

