import { supabase } from '@/services/supabase/client';
import { Profile } from '@/domain/models/user.model';
import { OnboardingProfileInput, onboardingProfileSchema } from '@/domain/schemas/onboarding.schema';
import { normalizeEquipment } from '@/domain/utils/equipment';

export class OnboardingService {
  /**
   * Validates and persists completed onboarding selections to the user's Supabase profile.
   * Sets onboarding_completed to TRUE.
   */
  async saveOnboardingProfile(userId: string, input: OnboardingProfileInput): Promise<Profile> {
    // 1. Validate payload using strict Zod schema before database write
    const validatedData = onboardingProfileSchema.parse(input);

    // 2. Perform parameterized update restricted by user ID
    const { data, error } = await supabase
      .from('profiles')
      .update({
        experience_level: validatedData.experience_level,
        fitness_goals: validatedData.fitness_goals,
        target_skills: validatedData.target_skills,
        available_equipment: validatedData.available_equipment,
        training_days: validatedData.training_days,
        session_duration_minutes: validatedData.session_duration_minutes,
        preferred_training_time: validatedData.preferred_training_time,
        training_location: validatedData.training_location,
        coaching_style: validatedData.coaching_style,
        workout_preference: validatedData.workout_preference,
        training_notes: validatedData.training_notes?.trim() || null,
        onboarding_completed: true,
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to save onboarding profile: ${error.message}`);
    }

    if (!data) {
      throw new Error('Profile update completed but no profile record was returned.');
    }

    return data as Profile;
  }

  /**
   * Helper to resolve equipment selections and eliminate conflicts with "No Equipment".
   * Safely normalizes canonical and legacy equipment identifiers.
   */
  resolveEquipmentSelection(current: string[], selected: string): string[] {
    if (selected === 'none') {
      return ['none'];
    }

    const normSelected = normalizeEquipment(selected);
    const withoutNone = current.filter((item) => normalizeEquipment(item) !== 'none');
    const existingIndex = withoutNone.findIndex(
      (item) => normalizeEquipment(item) === normSelected
    );

    if (existingIndex >= 0) {
      const remaining = withoutNone.filter((_, idx) => idx !== existingIndex);
      return remaining.length === 0 ? ['none'] : remaining;
    }

    return [...withoutNone, selected];
  }
}

export const onboardingService = new OnboardingService();

