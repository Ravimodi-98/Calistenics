import { z } from 'zod';

export const experienceLevelEnum = z.enum(['beginner', 'intermediate', 'advanced']);

export const fitnessGoalsEnum = z.enum([
  'build_strength',
  'improve_endurance',
  'improve_flexibility',
  'master_skills',
  'general_fitness',
  'movement_control',
]);

export const targetSkillsEnum = z.enum([
  'handstand',
  'planche',
  'front_lever',
  'back_lever',
  'muscle_up',
  'l_sit',
  'human_flag',
  'pistol_squat',
]);

export const equipmentEnum = z.enum([
  'none',
  'pull_up_bar',
  'pullup_bar',
]);

export const trainingDaysEnum = z.enum([
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
]);

export const sessionDurationEnum = z.union([
  z.literal(15),
  z.literal(20),
  z.literal(30),
  z.literal(45),
  z.literal(60),
]);

export const preferredTrainingTimeEnum = z.enum([
  'morning',
  'afternoon',
  'evening',
  'flexible',
]);

export const trainingLocationEnum = z.enum(['home', 'gym', 'outdoors']);
export const coachingStyleEnum = z.enum(['guided', 'independent']);
export const workoutPreferenceEnum = z.enum(['strength', 'skill', 'balanced']);

// Full Onboarding Profile Schema
export const onboardingProfileSchema = z
  .object({
    experience_level: experienceLevelEnum,
    fitness_goals: z
      .array(fitnessGoalsEnum)
      .min(1, { message: 'Please select at least one fitness goal' }),
    target_skills: z.array(targetSkillsEnum).default([]),
    available_equipment: z
      .array(equipmentEnum)
      .min(1, { message: 'Please select your available equipment' }),
    training_days: z
      .array(trainingDaysEnum)
      .min(1, { message: 'Please select at least one preferred training day' }),
    session_duration_minutes: sessionDurationEnum,
    preferred_training_time: preferredTrainingTimeEnum,
    training_location: trainingLocationEnum,
    coaching_style: coachingStyleEnum,
    workout_preference: workoutPreferenceEnum,
    training_notes: z
      .string()
      .max(500, { message: 'Notes must not exceed 500 characters' })
      .optional()
      .nullable(),
  })
  .refine(
    (data) => {
      // If 'none' is selected, no other equipment can be selected simultaneously
      if (data.available_equipment.includes('none')) {
        return data.available_equipment.length === 1;
      }
      return true;
    },
    {
      message: 'Cannot select other equipment when "No Equipment" is chosen',
      path: ['available_equipment'],
    }
  );

export type OnboardingProfileInput = z.infer<typeof onboardingProfileSchema>;

