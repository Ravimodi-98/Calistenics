import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Exercise } from '@/domain/models/exercise.model';
import { WorkoutRecommendation, WorkoutSessionStatus } from '@/domain/models/workout.model';
import { supabase } from '@/services/supabase/client';
import { isEquipmentAvailable } from '@/domain/utils/equipment';

export type SessionState =
  | 'not_started'
  | 'in_progress'
  | 'resting'
  | 'paused'
  | 'completed'
  | 'abandoned';

export interface SetLog {
  setNumber: number;
  repsOrSeconds: number;
  completedAt: string;
}

export interface WorkoutExerciseState {
  exercise: Exercise;
  targetSets: number;
  targetReps: number;
  isHold: boolean;
  completedSets: number;
  loggedSets: SetLog[];
}

interface WorkoutSessionStore {
  // Session State
  sessionId: string | null;
  workoutTitle: string;
  workoutCategory: string;
  status: SessionState;
  exercises: WorkoutExerciseState[];
  currentExerciseIndex: number;
  currentSetNumber: number;
  startedAt: string | null;
  completedAt: string | null;
  elapsedSeconds: number;

  // Rest Timer State
  restTimeRemaining: number;
  restTotalDuration: number;
  isRestActive: boolean;

  // Error & Saving
  isSaving: boolean;
  error: string | null;

  // Actions
  initializeSession: (workout: WorkoutRecommendation, userEquipment?: string[]) => void;
  startSession: () => void;
  completeSet: (repsOrSeconds: number) => void;
  skipRest: () => void;
  addRestSeconds: (seconds: number) => void;
  tickSecond: () => void;
  pauseSession: () => void;
  resumeSession: () => void;
  nextExercise: () => void;
  previousExercise: () => void;
  finishSessionEarly: () => void;
  abandonSession: () => void;
  saveSessionToSupabase: (userId: string) => Promise<{ success: boolean; sessionId?: string }>;
  restoreSavedSession: () => Promise<boolean>;
  clearSession: () => Promise<void>;
}

const STORAGE_KEY = '@calisthenics_active_session_v1';

export const useWorkoutSessionStore = create<WorkoutSessionStore>((set, get) => ({
  sessionId: null,
  workoutTitle: '',
  workoutCategory: 'no_equipment',
  status: 'not_started',
  exercises: [],
  currentExerciseIndex: 0,
  currentSetNumber: 1,
  startedAt: null,
  completedAt: null,
  elapsedSeconds: 0,
  restTimeRemaining: 0,
  restTotalDuration: 60,
  isRestActive: false,
  isSaving: false,
  error: null,

  initializeSession: (workout: WorkoutRecommendation, userEquipment = ['none']) => {
    // 1. Validate equipment requirements
    const validExercises = workout.exercises.filter((ex) =>
      isEquipmentAvailable(userEquipment, ex.equipment_required)
    );

    if (validExercises.length === 0) {
      set({
        error: 'No exercises available matching your equipment. No equipment exercises required.',
      });
      return;
    }

    // 2. Setup exercise states
    const exerciseStates: WorkoutExerciseState[] = validExercises.map((ex) => {
      const isHold =
        ex.slug.includes('hold') ||
        ex.slug.includes('plank') ||
        ex.slug.includes('hang') ||
        ex.slug.includes('bridge') ||
        ex.slug.includes('pose');

      return {
        exercise: ex,
        targetSets: 3,
        targetReps: isHold ? 30 : 10, // 30s for isometric holds, 10 reps for dynamic
        isHold,
        completedSets: 0,
        loggedSets: [],
      };
    });

    const newSessionId = `sess-${Date.now()}`;

    set({
      sessionId: newSessionId,
      workoutTitle: workout.title,
      workoutCategory: workout.category,
      status: 'not_started',
      exercises: exerciseStates,
      currentExerciseIndex: 0,
      currentSetNumber: 1,
      startedAt: null,
      completedAt: null,
      elapsedSeconds: 0,
      restTimeRemaining: 0,
      isRestActive: false,
      error: null,
    });
  },

  startSession: () => {
    const now = new Date().toISOString();
    set({
      status: 'in_progress',
      startedAt: now,
    });
    get().restoreSavedSession(); // Check sync
  },

  completeSet: (repsOrSeconds: number) => {
    const { exercises, currentExerciseIndex, currentSetNumber } = get();
    if (exercises.length === 0) return;

    // Validation: prevent zero or negative values
    const safeCount = Math.max(1, Math.min(repsOrSeconds, 500));

    const currentEx = exercises[currentExerciseIndex];
    if (!currentEx) return;

    const newLog: SetLog = {
      setNumber: currentSetNumber,
      repsOrSeconds: safeCount,
      completedAt: new Date().toISOString(),
    };

    const updatedExercises = [...exercises];
    const updatedEx = {
      ...currentEx,
      completedSets: currentEx.completedSets + 1,
      loggedSets: [...currentEx.loggedSets, newLog],
    };
    updatedExercises[currentExerciseIndex] = updatedEx;

    // Check if more sets remain for this exercise
    const moreSetsForThisEx = currentSetNumber < currentEx.targetSets;

    if (moreSetsForThisEx) {
      // Trigger rest timer
      set({
        exercises: updatedExercises,
        currentSetNumber: currentSetNumber + 1,
        status: 'resting',
        restTimeRemaining: 60,
        restTotalDuration: 60,
        isRestActive: true,
      });
    } else {
      // Check if more exercises remain in workout
      const moreExercises = currentExerciseIndex + 1 < exercises.length;
      if (moreExercises) {
        // Inter-exercise rest (90s)
        set({
          exercises: updatedExercises,
          currentExerciseIndex: currentExerciseIndex + 1,
          currentSetNumber: 1,
          status: 'resting',
          restTimeRemaining: 90,
          restTotalDuration: 90,
          isRestActive: true,
        });
      } else {
        // Complete workout!
        set({
          exercises: updatedExercises,
          status: 'completed',
          completedAt: new Date().toISOString(),
          isRestActive: false,
        });
      }
    }

    // Persist snapshot to storage
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(get())).catch(() => {});
  },

  skipRest: () => {
    set({
      status: 'in_progress',
      isRestActive: false,
      restTimeRemaining: 0,
    });
  },

  addRestSeconds: (seconds: number) => {
    const current = get().restTimeRemaining;
    const newTotal = current + seconds;
    set({
      restTimeRemaining: newTotal,
      restTotalDuration: Math.max(get().restTotalDuration, newTotal),
    });
  },

  tickSecond: () => {
    const { status, elapsedSeconds, isRestActive, restTimeRemaining } = get();

    if (status === 'in_progress' || status === 'resting') {
      const nextElapsed = elapsedSeconds + 1;

      if (isRestActive && restTimeRemaining > 0) {
        const nextRest = restTimeRemaining - 1;
        if (nextRest <= 0) {
          // Rest finished!
          set({
            elapsedSeconds: nextElapsed,
            restTimeRemaining: 0,
            isRestActive: false,
            status: 'in_progress',
          });
        } else {
          set({
            elapsedSeconds: nextElapsed,
            restTimeRemaining: nextRest,
          });
        }
      } else {
        set({ elapsedSeconds: nextElapsed });
      }
    }
  },

  pauseSession: () => {
    if (get().status === 'in_progress' || get().status === 'resting') {
      set({ status: 'paused' });
    }
  },

  resumeSession: () => {
    if (get().status === 'paused') {
      const wasResting = get().isRestActive;
      set({ status: wasResting ? 'resting' : 'in_progress' });
    }
  },

  nextExercise: () => {
    const { currentExerciseIndex, exercises } = get();
    if (currentExerciseIndex + 1 < exercises.length) {
      set({
        currentExerciseIndex: currentExerciseIndex + 1,
        currentSetNumber: 1,
        isRestActive: false,
        status: 'in_progress',
      });
    }
  },

  previousExercise: () => {
    const { currentExerciseIndex } = get();
    if (currentExerciseIndex > 0) {
      set({
        currentExerciseIndex: currentExerciseIndex - 1,
        currentSetNumber: 1,
        isRestActive: false,
        status: 'in_progress',
      });
    }
  },

  finishSessionEarly: () => {
    set({
      status: 'completed',
      completedAt: new Date().toISOString(),
      isRestActive: false,
    });
  },

  abandonSession: () => {
    set({
      status: 'abandoned',
      isRestActive: false,
    });
    AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
  },

  saveSessionToSupabase: async (userId: string) => {
    const state = get();
    set({ isSaving: true, error: null });

    try {
      let totalSets = 0;
      let totalReps = 0;

      state.exercises.forEach((ex) => {
        totalSets += ex.completedSets;
        ex.loggedSets.forEach((log) => {
          totalReps += log.repsOrSeconds;
        });
      });

      // 1. Insert session record into workout_sessions
      const { data: sessionData, error: sessionErr } = await supabase
        .from('workout_sessions')
        .insert({
          user_id: userId,
          workout_name: state.workoutTitle || 'Calisthenics Bodyweight Routine',
          category: state.workoutCategory || 'no_equipment',
          status: 'completed',
          started_at: state.startedAt || new Date().toISOString(),
          completed_at: state.completedAt || new Date().toISOString(),
          duration_seconds: state.elapsedSeconds || 60,
          total_sets_completed: totalSets,
          total_reps_completed: totalReps,
        })
        .select()
        .single();

      if (sessionErr) {
        throw new Error(`Failed to save workout session: ${sessionErr.message}`);
      }

      const savedSessionId = sessionData.id;

      // 2. Insert exercise records into workout_session_exercises
      const exerciseInserts = state.exercises
        .filter((ex) => ex.completedSets > 0)
        .map((ex, index) => {
          let repsCount = 0;
          let holdSeconds = 0;
          ex.loggedSets.forEach((l) => {
            if (ex.isHold) {
              holdSeconds += l.repsOrSeconds;
            } else {
              repsCount += l.repsOrSeconds;
            }
          });

          return {
            session_id: savedSessionId,
            exercise_id: ex.exercise.id,
            target_sets: ex.targetSets,
            target_reps: ex.targetReps,
            sets_completed: ex.completedSets,
            reps_completed: repsCount,
            hold_seconds_completed: holdSeconds,
            order_index: index,
          };
        });

      if (exerciseInserts.length > 0) {
        const { error: exErr } = await supabase
          .from('workout_session_exercises')
          .insert(exerciseInserts);

        if (exErr) {
          console.warn('WorkoutSessionStore: Could not save individual exercises:', exErr.message);
        }
      }

      await AsyncStorage.removeItem(STORAGE_KEY);
      set({ isSaving: false });
      return { success: true, sessionId: savedSessionId };
    } catch (err: any) {
      set({ isSaving: false, error: err.message || 'Error saving session' });
      return { success: false };
    }
  },

  restoreSavedSession: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      const parsed = JSON.parse(raw);
      if (parsed && parsed.status === 'in_progress') {
        set({
          sessionId: parsed.sessionId,
          workoutTitle: parsed.workoutTitle,
          workoutCategory: parsed.workoutCategory,
          status: 'paused', // Restore in paused state for safety
          exercises: parsed.exercises || [],
          currentExerciseIndex: parsed.currentExerciseIndex || 0,
          currentSetNumber: parsed.currentSetNumber || 1,
          startedAt: parsed.startedAt,
          elapsedSeconds: parsed.elapsedSeconds || 0,
        });
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  clearSession: async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    set({
      sessionId: null,
      workoutTitle: '',
      status: 'not_started',
      exercises: [],
      currentExerciseIndex: 0,
      currentSetNumber: 1,
      startedAt: null,
      completedAt: null,
      elapsedSeconds: 0,
      restTimeRemaining: 0,
      isRestActive: false,
      error: null,
    });
  },
}));

