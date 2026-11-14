import { useWorkoutSessionStore } from '../../src/features/workouts/store/workoutSessionStore';
import { WorkoutRecommendation } from '../../src/domain/models/workout.model';
import { Exercise } from '../../src/domain/models/exercise.model';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn().mockResolvedValue(null),
  getItem: jest.fn().mockResolvedValue(null),
  removeItem: jest.fn().mockResolvedValue(null),
}));

// Mock Supabase client
jest.mock('../../src/services/supabase/client', () => ({
  supabase: {
    from: jest.fn().mockImplementation((table: string) => {
      if (table === 'workout_sessions') {
        return {
          insert: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: { id: 'saved-session-uuid-123' },
                error: null,
              }),
            }),
          }),
        };
      }
      if (table === 'workout_session_exercises') {
        return {
          insert: jest.fn().mockResolvedValue({ data: [], error: null }),
        };
      }
      return {
        insert: jest.fn().mockResolvedValue({ data: [], error: null }),
      };
    }),
  },
}));

describe('WorkoutSessionStore State Machine & Tracking Logic', () => {
  const pushUpExercise: Exercise = {
    id: 'ex-push',
    slug: 'standard-push-up',
    name: 'Standard Push-up',
    description: 'Chest press.',
    category: 'push',
    equipment_required: 'none',
    difficulty: 'beginner',
    primary_muscles: ['chest'],
    secondary_muscles: [],
    instructions: [{ step: 1, title: 'Setup', cue: 'Plank' }],
    prerequisites: [],
    progression_exercises: [],
    regressions: [],
    safety_notes: null,
    disclaimer: null,
    animation_asset_path: 'path',
    animation_format: 'lottie_json',
    content_status: 'published',
    created_at: '',
    updated_at: '',
  };

  const pullUpExercise: Exercise = {
    id: 'ex-pull',
    slug: 'standard-pull-up',
    name: 'Standard Pull-up',
    description: 'Vertical bar pull.',
    category: 'pull',
    equipment_required: 'pull_up_bar',
    difficulty: 'intermediate',
    primary_muscles: ['lats'],
    secondary_muscles: [],
    instructions: [{ step: 1, title: 'Hang', cue: 'Pull up' }],
    prerequisites: [],
    progression_exercises: [],
    regressions: [],
    safety_notes: null,
    disclaimer: null,
    animation_asset_path: 'path',
    animation_format: 'lottie_json',
    content_status: 'published',
    created_at: '',
    updated_at: '',
  };

  const sampleWorkout: WorkoutRecommendation = {
    isRestDay: false,
    title: 'Upper Body & Core Primer',
    category: 'no_equipment',
    difficulty: 'beginner',
    estimatedDurationMinutes: 20,
    exerciseCount: 2,
    exercises: [pushUpExercise, pullUpExercise],
    focusNotes: 'Focus on strict tempo.',
  };

  beforeEach(async () => {
    const store = useWorkoutSessionStore.getState();
    await store.clearSession();
  });

  describe('Equipment Validation on Session Initialization', () => {
    test('strictly filters out pull-up bar exercises if user only has No Equipment', () => {
      const store = useWorkoutSessionStore.getState();
      store.initializeSession(sampleWorkout, ['none']);

      const state = useWorkoutSessionStore.getState();
      expect(state.exercises.length).toBe(1);
      expect(state.exercises[0].exercise.slug).toBe('standard-push-up');
      expect(state.exercises.some((e) => e.exercise.equipment_required === 'pull_up_bar')).toBe(false);
    });

    test('includes pull-up bar exercises when user has pullup_bar in available equipment', () => {
      const store = useWorkoutSessionStore.getState();
      store.initializeSession(sampleWorkout, ['pullup_bar']);

      const state = useWorkoutSessionStore.getState();
      expect(state.exercises.length).toBe(2);
      expect(state.exercises.some((e) => e.exercise.equipment_required === 'pull_up_bar')).toBe(true);
    });
  });

  describe('State Machine & Set Completion Flow', () => {
    test('transitions through not_started -> in_progress -> resting -> completed', () => {
      const store = useWorkoutSessionStore.getState();
      store.initializeSession(sampleWorkout, ['none']);
      expect(useWorkoutSessionStore.getState().status).toBe('not_started');

      store.startSession();
      expect(useWorkoutSessionStore.getState().status).toBe('in_progress');
      expect(useWorkoutSessionStore.getState().startedAt).toBeDefined();

      // Complete Set 1 of 3
      store.completeSet(12);
      let state = useWorkoutSessionStore.getState();
      expect(state.status).toBe('resting');
      expect(state.isRestActive).toBe(true);
      expect(state.restTimeRemaining).toBe(60);
      expect(state.currentSetNumber).toBe(2);
      expect(state.exercises[0].completedSets).toBe(1);
      expect(state.exercises[0].loggedSets[0].repsOrSeconds).toBe(12);

      // Skip rest and resume
      store.skipRest();
      state = useWorkoutSessionStore.getState();
      expect(state.status).toBe('in_progress');
      expect(state.isRestActive).toBe(false);

      // Complete Set 2 of 3
      store.completeSet(10);
      expect(useWorkoutSessionStore.getState().currentSetNumber).toBe(3);
      store.skipRest();

      // Complete Set 3 of 3 (Final set of the only exercise)
      store.completeSet(8);
      state = useWorkoutSessionStore.getState();
      expect(state.status).toBe('completed');
      expect(state.completedAt).toBeDefined();
    });

    test('pauses and resumes cleanly without losing elapsed or rest state', () => {
      const store = useWorkoutSessionStore.getState();
      store.initializeSession(sampleWorkout, ['none']);
      store.startSession();

      store.pauseSession();
      expect(useWorkoutSessionStore.getState().status).toBe('paused');

      store.resumeSession();
      expect(useWorkoutSessionStore.getState().status).toBe('in_progress');
    });

    test('adds extra rest seconds and ticks accurately', () => {
      const store = useWorkoutSessionStore.getState();
      store.initializeSession(sampleWorkout, ['none']);
      store.startSession();
      store.completeSet(10); // Enters rest with 60s

      expect(useWorkoutSessionStore.getState().restTimeRemaining).toBe(60);

      store.addRestSeconds(15);
      expect(useWorkoutSessionStore.getState().restTimeRemaining).toBe(75);

      store.tickSecond();
      expect(useWorkoutSessionStore.getState().restTimeRemaining).toBe(74);
      expect(useWorkoutSessionStore.getState().elapsedSeconds).toBe(1);
    });

    test('navigates between exercises with next and previous actions', () => {
      const store = useWorkoutSessionStore.getState();
      store.initializeSession(sampleWorkout, ['pullup_bar']); // 2 exercises
      store.startSession();

      expect(useWorkoutSessionStore.getState().currentExerciseIndex).toBe(0);

      store.nextExercise();
      expect(useWorkoutSessionStore.getState().currentExerciseIndex).toBe(1);

      store.previousExercise();
      expect(useWorkoutSessionStore.getState().currentExerciseIndex).toBe(0);
    });
  });

  describe('Database Persistence of Completed Sessions', () => {
    test('saves workout session and completed exercise sets to Supabase', async () => {
      const store = useWorkoutSessionStore.getState();
      store.initializeSession(sampleWorkout, ['none']);
      store.startSession();
      store.completeSet(12);

      const result = await store.saveSessionToSupabase('test-user-uuid');
      expect(result.success).toBe(true);
      expect(result.sessionId).toBe('saved-session-uuid-123');
    });
  });
});

