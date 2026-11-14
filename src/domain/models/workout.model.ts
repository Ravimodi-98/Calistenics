import { Exercise, ExerciseCategory, ExerciseDifficulty } from './exercise.model';

export type WorkoutSessionStatus = 'in_progress' | 'completed' | 'abandoned';

export interface WorkoutSession {
  id: string;
  user_id: string;
  workout_name: string;
  category: ExerciseCategory | 'full_body';
  status: WorkoutSessionStatus;
  started_at: string;
  completed_at: string | null;
  duration_seconds: number;
  created_at: string;
}

export interface WorkoutSessionExercise {
  id: string;
  session_id: string;
  exercise_id: string;
  sets_completed: number;
  reps_completed: number;
  created_at: string;
  exercise?: Exercise;
}

export interface WorkoutRecommendation {
  isRestDay: boolean;
  title: string;
  category: ExerciseCategory | 'full_body' | 'mobility';
  difficulty: ExerciseDifficulty;
  estimatedDurationMinutes: number;
  exerciseCount: number;
  exercises: Exercise[];
  focusNotes: string;
  mobilitySuggestion?: {
    title: string;
    description: string;
    durationMinutes: number;
  };
}

