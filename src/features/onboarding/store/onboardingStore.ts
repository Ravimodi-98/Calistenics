import { create } from 'zustand';
import { onboardingService } from '../services/onboardingService';
import { OnboardingProfileInput } from '@/domain/schemas/onboarding.schema';
import { Profile } from '@/domain/models/user.model';
import { useAuthStore } from '@/features/auth/store/authStore';

interface OnboardingStoreState {
  experience_level: 'beginner' | 'intermediate' | 'advanced';
  fitness_goals: string[];
  target_skills: string[];
  available_equipment: string[];
  training_days: string[];
  session_duration_minutes: 15 | 20 | 30 | 45 | 60;
  preferred_training_time: 'morning' | 'afternoon' | 'evening' | 'flexible';
  training_location: 'home' | 'gym' | 'outdoors';
  coaching_style: 'guided' | 'independent';
  workout_preference: 'strength' | 'skill' | 'balanced';
  training_notes: string;
  isSaving: boolean;
  error: string | null;

  // Setters
  setExperienceLevel: (level: 'beginner' | 'intermediate' | 'advanced') => void;
  toggleFitnessGoal: (goalId: string) => void;
  toggleTargetSkill: (skillId: string) => void;
  toggleEquipment: (equipmentId: string) => void;
  toggleTrainingDay: (day: string) => void;
  setSessionDuration: (duration: 15 | 20 | 30 | 45 | 60) => void;
  setPreferredTrainingTime: (time: 'morning' | 'afternoon' | 'evening' | 'flexible') => void;
  setTrainingPreferences: (prefs: {
    location?: 'home' | 'gym' | 'outdoors';
    coaching?: 'guided' | 'independent';
    preference?: 'strength' | 'skill' | 'balanced';
    notes?: string;
  }) => void;

  submitOnboarding: (userId: string) => Promise<Profile>;
  resetOnboarding: () => void;
  clearError: () => void;
}

const initialValues = {
  experience_level: 'beginner' as const,
  fitness_goals: ['build_strength'],
  target_skills: ['handstand'],
  available_equipment: ['none'],
  training_days: ['monday', 'wednesday', 'friday'],
  session_duration_minutes: 30 as const,
  preferred_training_time: 'flexible' as const,
  training_location: 'home' as const,
  coaching_style: 'guided' as const,
  workout_preference: 'balanced' as const,
  training_notes: '',
};

export const useOnboardingStore = create<OnboardingStoreState>((set, get) => ({
  ...initialValues,
  isSaving: false,
  error: null,

  setExperienceLevel: (level) => {
    set({ experience_level: level, error: null });
  },

  toggleFitnessGoal: (goalId) => {
    const current = get().fitness_goals;
    if (current.includes(goalId)) {
      // Must have at least 1 goal
      if (current.length > 1) {
        set({ fitness_goals: current.filter((g) => g !== goalId), error: null });
      }
    } else {
      set({ fitness_goals: [...current, goalId], error: null });
    }
  },

  toggleTargetSkill: (skillId) => {
    const current = get().target_skills;
    if (current.includes(skillId)) {
      set({ target_skills: current.filter((s) => s !== skillId), error: null });
    } else {
      set({ target_skills: [...current, skillId], error: null });
    }
  },

  toggleEquipment: (equipmentId) => {
    const current = get().available_equipment;
    const resolved = onboardingService.resolveEquipmentSelection(current, equipmentId);
    set({ available_equipment: resolved, error: null });
  },

  toggleTrainingDay: (day) => {
    const current = get().training_days;
    if (current.includes(day)) {
      if (current.length > 1) {
        set({ training_days: current.filter((d) => d !== day), error: null });
      }
    } else {
      set({ training_days: [...current, day], error: null });
    }
  },

  setSessionDuration: (duration) => {
    set({ session_duration_minutes: duration, error: null });
  },

  setPreferredTrainingTime: (time) => {
    set({ preferred_training_time: time, error: null });
  },

  setTrainingPreferences: (prefs) => {
    set((state) => ({
      training_location: prefs.location ?? state.training_location,
      coaching_style: prefs.coaching ?? state.coaching_style,
      workout_preference: prefs.preference ?? state.workout_preference,
      training_notes: prefs.notes !== undefined ? prefs.notes : state.training_notes,
      error: null,
    }));
  },

  submitOnboarding: async (userId: string) => {
    set({ isSaving: true, error: null });
    try {
      const state = get();
      const payload: OnboardingProfileInput = {
        experience_level: state.experience_level,
        fitness_goals: state.fitness_goals as any,
        target_skills: state.target_skills as any,
        available_equipment: state.available_equipment as any,
        training_days: state.training_days as any,
        session_duration_minutes: state.session_duration_minutes,
        preferred_training_time: state.preferred_training_time,
        training_location: state.training_location,
        coaching_style: state.coaching_style,
        workout_preference: state.workout_preference,
        training_notes: state.training_notes,
      };

      const updatedProfile = await onboardingService.saveOnboardingProfile(userId, payload);

      // Update global auth store with newly updated profile
      useAuthStore.setState({ profile: updatedProfile });

      set({ isSaving: false });
      return updatedProfile;
    } catch (err: any) {
      set({ isSaving: false, error: err.message });
      throw err;
    }
  },

  resetOnboarding: () => {
    set({ ...initialValues, isSaving: false, error: null });
  },

  clearError: () => {
    set({ error: null });
  },
}));

