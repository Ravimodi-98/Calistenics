import { User as SupabaseUser, Session as SupabaseSession } from '@supabase/supabase-js';

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';
export type PreferredTrainingTime = 'morning' | 'afternoon' | 'evening' | 'flexible';
export type TrainingLocation = 'home' | 'gym' | 'outdoors';
export type CoachingStyle = 'guided' | 'independent';
export type WorkoutPreference = 'strength' | 'skill' | 'balanced';

export interface Profile {
  id: string;
  full_name: string;
  avatar_url?: string | null;
  onboarding_completed: boolean;
  experience_level?: ExperienceLevel | null;
  fitness_goals?: string[];
  target_skills?: string[];
  available_equipment?: string[];
  training_days?: string[];
  session_duration_minutes?: number | null;
  preferred_training_time?: PreferredTrainingTime | null;
  training_location?: TrainingLocation | null;
  coaching_style?: CoachingStyle | null;
  workout_preference?: WorkoutPreference | null;
  training_notes?: string | null;
  created_at: string;
  updated_at: string;
}

export type AuthUser = SupabaseUser;
export type AuthSession = SupabaseSession;

export interface AuthState {
  user: AuthUser | null;
  profile: Profile | null;
  session: AuthSession | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
}
