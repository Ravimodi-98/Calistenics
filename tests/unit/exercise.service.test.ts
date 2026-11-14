import { ExerciseService } from '../../src/features/exercises/services/exerciseService';
import { Exercise } from '../../src/domain/models/exercise.model';

jest.mock('../../src/services/supabase/client', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

describe('ExerciseService & No Equipment First Filtering Rules', () => {
  let service: ExerciseService;
  let mockExercises: Exercise[];

  beforeEach(() => {
    service = new ExerciseService();
    mockExercises = [
      {
        id: '1',
        slug: 'prone-cobra',
        name: 'Prone Cobra',
        description: 'Floor pulling and scapular retractions.',
        category: 'no_equipment',
        equipment_required: 'none',
        difficulty: 'beginner',
        primary_muscles: ['rhomboids'],
        secondary_muscles: [],
        instructions: [{ step: 1, title: 'Setup', cue: 'Lie down' }],
        prerequisites: [],
        progression_exercises: [],
        regressions: [],
        safety_notes: null,
        disclaimer: 'Floor pulling does not replace pull-ups.',
        animation_asset_path: 'placeholder.json',
        animation_format: 'lottie_json',
        content_status: 'published',
        created_at: '',
        updated_at: '',
      },
      {
        id: '2',
        slug: 'standard-push-up',
        name: 'Standard Push-up',
        description: 'Foundational chest pressing.',
        category: 'push',
        equipment_required: 'none',
        difficulty: 'beginner',
        primary_muscles: ['pectoralis_major'],
        secondary_muscles: [],
        instructions: [{ step: 1, title: 'Plank', cue: 'Press up' }],
        prerequisites: [],
        progression_exercises: [],
        regressions: [],
        safety_notes: null,
        disclaimer: null,
        animation_asset_path: 'placeholder.json',
        animation_format: 'lottie_json',
        content_status: 'published',
        created_at: '',
        updated_at: '',
      },
      {
        id: '3',
        slug: 'prone-y-t-w-raises',
        name: 'Prone Y-T-W Raises',
        description: 'Floor scapular pulling without equipment.',
        category: 'pull',
        equipment_required: 'none',
        difficulty: 'beginner',
        primary_muscles: ['lower_trapezius', 'rear_deltoids'],
        secondary_muscles: [],
        instructions: [{ step: 1, title: 'Arms up', cue: 'Pulse thumbs' }],
        prerequisites: [],
        progression_exercises: [],
        regressions: [],
        safety_notes: null,
        disclaimer: 'Floor-based pulling note.',
        animation_asset_path: 'placeholder.json',
        animation_format: 'lottie_json',
        content_status: 'published',
        created_at: '',
        updated_at: '',
      },
      {
        id: '4',
        slug: 'standard-pull-up',
        name: 'Standard Pull-up',
        description: 'Vertical hanging pull-up.',
        category: 'pull',
        equipment_required: 'pull_up_bar',
        difficulty: 'intermediate',
        primary_muscles: ['latissimus_dorsi'],
        secondary_muscles: [],
        instructions: [{ step: 1, title: 'Hang', cue: 'Pull up' }],
        prerequisites: [],
        progression_exercises: [],
        regressions: [],
        safety_notes: null,
        disclaimer: null,
        animation_asset_path: 'placeholder.json',
        animation_format: 'lottie_json',
        content_status: 'published',
        created_at: '',
        updated_at: '',
      },
    ];
  });

  test('default filter returns only No Equipment category exercises with none equipment', () => {
    const result = service.filterExercises(mockExercises, {
      category: 'no_equipment',
      equipment: 'none',
      difficulty: 'all',
      searchQuery: '',
    });

    expect(result.length).toBe(1);
    expect(result[0].slug).toBe('prone-cobra');
  });

  test('when equipment is "none", pull-up bar exercises are NEVER returned', () => {
    // Even if category is "pull"
    const result = service.filterExercises(mockExercises, {
      category: 'pull',
      equipment: 'none',
      difficulty: 'all',
      searchQuery: '',
    });

    expect(result.length).toBe(1);
    expect(result[0].slug).toBe('prone-y-t-w-raises');
    expect(result.some((ex) => ex.equipment_required === 'pull_up_bar')).toBe(false);
  });

  test('when category is "no_equipment", pull-up bar exercises are NEVER returned even if equipment is "all"', () => {
    const result = service.filterExercises(mockExercises, {
      category: 'no_equipment',
      equipment: 'all',
      difficulty: 'all',
      searchQuery: '',
    });

    expect(result.every((ex) => ex.equipment_required === 'none')).toBe(true);
  });

  test('filtering by equipment "pull_up_bar" returns bar exercises', () => {
    const result = service.filterExercises(mockExercises, {
      category: 'all',
      equipment: 'pull_up_bar',
      difficulty: 'all',
      searchQuery: '',
    });

    expect(result.length).toBe(1);
    expect(result[0].slug).toBe('standard-pull-up');
  });

  test('search query matches by name, description, and primary muscle', () => {
    const result = service.filterExercises(mockExercises, {
      category: 'all',
      equipment: 'all',
      difficulty: 'all',
      searchQuery: 'pectoralis',
    });

    expect(result.length).toBe(1);
    expect(result[0].slug).toBe('standard-push-up');
  });

  test('difficulty filter isolates beginner vs intermediate', () => {
    const beginnerResult = service.filterExercises(mockExercises, {
      category: 'all',
      equipment: 'all',
      difficulty: 'beginner',
      searchQuery: '',
    });
    expect(beginnerResult.every((ex) => ex.difficulty === 'beginner')).toBe(true);

    const intermediateResult = service.filterExercises(mockExercises, {
      category: 'all',
      equipment: 'all',
      difficulty: 'intermediate',
      searchQuery: '',
    });
    expect(intermediateResult.length).toBe(1);
    expect(intermediateResult[0].slug).toBe('standard-pull-up');
  });
});
