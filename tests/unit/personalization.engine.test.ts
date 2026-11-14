import { RecommendationEngine } from '../../src/features/dashboard/services/recommendationEngine';
import { Profile } from '../../src/domain/models/user.model';
import { Exercise } from '../../src/domain/models/exercise.model';
import { WorkoutSession } from '../../src/domain/models/workout.model';
import { UserSkillProgress } from '../../src/domain/models/skill.model';

describe('PersonalizationEngine & Dashboard Recommendation Rules', () => {
  let engine: RecommendationEngine;

  const mockExercises: Exercise[] = [
    {
      id: 'ex-1',
      slug: 'standard-push-up',
      name: 'Standard Push-up',
      description: 'Foundational chest pressing.',
      category: 'push',
      equipment_required: 'none',
      difficulty: 'beginner',
      primary_muscles: ['pectoralis_major', 'triceps_brachii'],
      secondary_muscles: ['core'],
      instructions: [{ step: 1, title: 'Setup', cue: 'Plank' }],
      prerequisites: [],
      progression_exercises: ['diamond-push-up'],
      regressions: ['incline-push-up'],
      safety_notes: null,
      disclaimer: null,
      animation_asset_path: 'placeholder.json',
      animation_format: 'lottie_json',
      content_status: 'published',
      created_at: '',
      updated_at: '',
    },
    {
      id: 'ex-2',
      slug: 'prone-cobra',
      name: 'Prone Cobra',
      description: 'Floor postural pulling.',
      category: 'no_equipment',
      equipment_required: 'none',
      difficulty: 'beginner',
      primary_muscles: ['rhomboids', 'rear_deltoids'],
      secondary_muscles: ['glutes'],
      instructions: [{ step: 1, title: 'Setup', cue: 'Lie prone' }],
      prerequisites: [],
      progression_exercises: [],
      regressions: [],
      safety_notes: null,
      disclaimer: 'Note: Floor pulling does not replace pull-ups.',
      animation_asset_path: 'placeholder.json',
      animation_format: 'lottie_json',
      content_status: 'published',
      created_at: '',
      updated_at: '',
    },
    {
      id: 'ex-3',
      slug: 'diamond-push-up',
      name: 'Diamond Push-up',
      description: 'Close grip triceps press.',
      category: 'push',
      equipment_required: 'none',
      difficulty: 'intermediate',
      primary_muscles: ['triceps_brachii'],
      secondary_muscles: ['chest'],
      instructions: [{ step: 1, title: 'Hands', cue: 'Diamond shape' }],
      prerequisites: ['standard-push-up'],
      progression_exercises: [],
      regressions: ['standard-push-up'],
      safety_notes: null,
      disclaimer: null,
      animation_asset_path: 'placeholder.json',
      animation_format: 'lottie_json',
      content_status: 'published',
      created_at: '',
      updated_at: '',
    },
    {
      id: 'ex-4',
      slug: 'dead-hang',
      name: 'Dead Hang',
      description: 'Grip and lat hang from bar.',
      category: 'pull',
      equipment_required: 'pull_up_bar',
      difficulty: 'beginner',
      primary_muscles: ['latissimus_dorsi', 'forearms'],
      secondary_muscles: [],
      instructions: [{ step: 1, title: 'Grip', cue: 'Hang from bar' }],
      prerequisites: [],
      progression_exercises: ['pull-up'],
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
      id: 'ex-5',
      slug: 'standard-pull-up',
      name: 'Standard Pull-up',
      description: 'Vertical bar pull.',
      category: 'pull',
      equipment_required: 'pull_up_bar',
      difficulty: 'intermediate',
      primary_muscles: ['latissimus_dorsi', 'biceps_brachii'],
      secondary_muscles: [],
      instructions: [{ step: 1, title: 'Grip', cue: 'Chin over bar' }],
      prerequisites: ['dead-hang'],
      progression_exercises: [],
      regressions: ['dead-hang'],
      safety_notes: null,
      disclaimer: null,
      animation_asset_path: 'placeholder.json',
      animation_format: 'lottie_json',
      content_status: 'published',
      created_at: '',
      updated_at: '',
    },
  ];

  beforeEach(() => {
    engine = new RecommendationEngine();
  });

  describe('Greeting and User Formatting Logic', () => {
    test('returns Good Morning for 9:00 AM', () => {
      const morningDate = new Date('2026-11-14T09:00:00');
      expect(engine.getTimeGreeting(morningDate)).toBe('Good Morning');
    });

    test('returns Good Afternoon for 2:30 PM', () => {
      const afternoonDate = new Date('2026-11-14T14:30:00');
      expect(engine.getTimeGreeting(afternoonDate)).toBe('Good Afternoon');
    });

    test('returns Good Evening for 8:00 PM', () => {
      const eveningDate = new Date('2026-11-14T20:00:00');
      expect(engine.getTimeGreeting(eveningDate)).toBe('Good Evening');
    });

    test('extracts first name accurately from full name', () => {
      expect(engine.getUserFirstName('Ravi Modi')).toBe('Ravi');
      expect(engine.getUserFirstName('  Elena  Rostova  ')).toBe('Elena');
      expect(engine.getUserFirstName(null)).toBe('Athlete');
      expect(engine.getUserFirstName('')).toBe('Athlete');
    });
  });

  describe('Equipment Filtering & No Equipment First Philosophy', () => {
    test('when user has only ["none"], pull-up bar exercises are strictly excluded', () => {
      const filtered = engine.filterByEquipment(mockExercises, ['none']);
      expect(filtered.length).toBe(3);
      expect(filtered.every((ex) => ex.equipment_required === 'none')).toBe(true);
      expect(filtered.some((ex) => ex.equipment_required === 'pull_up_bar')).toBe(false);
    });

    test('when user has ["pullup_bar"], both none and pull_up_bar exercises are allowed', () => {
      const filtered = engine.filterByEquipment(mockExercises, ['pullup_bar']);
      expect(filtered.length).toBe(5);
      expect(filtered.some((ex) => ex.equipment_required === 'pull_up_bar')).toBe(true);
    });
  });

  describe('Workout Recommendation by Experience Level & Rest Days', () => {
    const baseProfile: Profile = {
      id: 'usr-1',
      full_name: 'Ravi Modi',
      onboarding_completed: true,
      experience_level: 'beginner',
      available_equipment: ['none'],
      training_days: ['monday', 'wednesday', 'friday'],
      session_duration_minutes: 30,
      workout_preference: 'balanced',
      fitness_goals: ['build_strength'],
      target_skills: ['handstand'],
      created_at: '',
      updated_at: '',
    };

    test('detects rest day when current day is not in training_days', () => {
      // 2026-11-14 is a Saturday (not in Mon, Wed, Fri)
      const saturday = new Date('2026-11-14T10:00:00');
      const workout = engine.generateTodayWorkout(baseProfile, mockExercises, [], saturday);

      expect(workout.isRestDay).toBe(true);
      expect(workout.title).toBe('Active Recovery & Mobility');
      expect(workout.mobilitySuggestion).toBeDefined();
      expect(workout.mobilitySuggestion?.title).toContain('Joint & Scapular Flow');
    });

    test('generates active workout when current day is in training_days', () => {
      // 2026-11-16 is a Monday (included in Mon, Wed, Fri)
      const monday = new Date('2026-11-16T10:00:00');
      const workout = engine.generateTodayWorkout(baseProfile, mockExercises, [], monday);

      expect(workout.isRestDay).toBe(false);
      expect(workout.difficulty).toBe('beginner');
      expect(workout.exerciseCount).toBeGreaterThan(0);
      expect(workout.exercises.every((ex) => ex.equipment_required === 'none')).toBe(true);
    });

    test('recommends intermediate progressions for intermediate users', () => {
      const intermediateProfile: Profile = {
        ...baseProfile,
        experience_level: 'intermediate',
        training_days: ['monday', 'wednesday', 'friday'],
      };

      const monday = new Date('2026-11-16T10:00:00');
      const workout = engine.generateTodayWorkout(intermediateProfile, mockExercises, [], monday);

      expect(workout.isRestDay).toBe(false);
      expect(workout.difficulty).toBe('intermediate');
      expect(workout.exercises.some((e) => e.difficulty === 'intermediate')).toBe(true);
    });
  });

  describe('Skill Overview', () => {
    test('new user target skills default to not_assessed status', () => {
      const profile: Profile = {
        id: 'usr-1',
        full_name: 'Ravi',
        onboarding_completed: true,
        target_skills: ['handstand', 'l_sit'],
        created_at: '',
        updated_at: '',
      };

      const skills = engine.generateSkillOverview(profile, []);
      expect(skills.length).toBe(2);
      expect(skills[0].name).toBe('Handstand');
      expect(skills[0].assessment_status).toBe('not_assessed');
      expect(skills[1].name).toBe('L-Sit');
      expect(skills[1].assessment_status).toBe('not_assessed');
    });

    test('maps existing skill progress records when available', () => {
      const profile: Profile = {
        id: 'usr-1',
        full_name: 'Ravi',
        onboarding_completed: true,
        target_skills: ['handstand'],
        created_at: '',
        updated_at: '',
      };

      const savedProgress: UserSkillProgress[] = [
        {
          id: 'sk-1',
          user_id: 'usr-1',
          skill_slug: 'handstand',
          skill_name: 'Handstand',
          progression_level: 'Freestanding Kick-up Attempts',
          assessment_status: 'learning',
          notes: 'Balanced for 3s',
          updated_at: '',
        },
      ];

      const skills = engine.generateSkillOverview(profile, savedProgress);
      expect(skills[0].progression_level).toBe('Freestanding Kick-up Attempts');
      expect(skills[0].assessment_status).toBe('learning');
    });
  });

  describe('Weekly Activity & Real Achievements', () => {
    const profile: Profile = {
      id: 'usr-1',
      full_name: 'Ravi',
      onboarding_completed: true,
      training_days: ['monday', 'wednesday', 'friday'],
      created_at: '',
      updated_at: '',
    };

    test('generates empty weekly activity when user has 0 sessions', () => {
      const now = new Date('2026-11-14T10:00:00');
      const activity = engine.generateWeeklyActivity(profile, [], now);

      expect(activity.completedThisWeekCount).toBe(0);
      expect(activity.plannedDaysCount).toBe(3);
      expect(activity.days.length).toBe(7);
      expect(activity.days.every((d) => !d.isCompleted)).toBe(true);
    });

    test('unlocks First Step Taken achievement only after 1 completed session', () => {
      const now = new Date('2026-11-14T10:00:00');
      const emptyActivity = engine.generateWeeklyActivity(profile, [], now);
      const lockedAchievements = engine.calculateAchievements([], emptyActivity, []);

      const firstWorkoutAch = lockedAchievements.find((a) => a.id === 'ach-first-workout');
      expect(firstWorkoutAch?.isUnlocked).toBe(false);

      const completedSession: WorkoutSession = {
        id: 'sess-1',
        user_id: 'usr-1',
        workout_name: 'Push & Core Routine',
        category: 'no_equipment',
        status: 'completed',
        started_at: '2026-11-14T09:00:00Z',
        completed_at: '2026-11-14T09:30:00Z',
        duration_seconds: 1800,
        created_at: '2026-11-14T09:00:00Z',
      };

      const activeActivity = engine.generateWeeklyActivity(profile, [completedSession], now);
      const unlockedAchievements = engine.calculateAchievements([completedSession], activeActivity, []);

      const unlockedFirst = unlockedAchievements.find((a) => a.id === 'ach-first-workout');
      expect(unlockedFirst?.isUnlocked).toBe(true);
    });
  });
});

