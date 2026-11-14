import {
  onboardingProfileSchema,
  OnboardingProfileInput,
} from '../../src/domain/schemas/onboarding.schema';

describe('Onboarding Zod Validation Schemas', () => {
  const validProfile: OnboardingProfileInput = {
    experience_level: 'beginner',
    fitness_goals: ['build_strength', 'improve_flexibility'],
    target_skills: ['handstand', 'l_sit'],
    available_equipment: ['pullup_bar'],
    training_days: ['monday', 'wednesday', 'friday'],
    session_duration_minutes: 30,
    preferred_training_time: 'morning',
    training_location: 'home',
    coaching_style: 'guided',
    workout_preference: 'balanced',
    training_notes: 'Minor shoulder tightness on deep overhead reach.',
  };

  test('valid onboarding profile passes schema validation', () => {
    const result = onboardingProfileSchema.safeParse(validProfile);
    expect(result.success).toBe(true);
  });

  test('fails when experience_level is invalid', () => {
    const result = onboardingProfileSchema.safeParse({
      ...validProfile,
      experience_level: 'expert_ninja' as any,
    });
    expect(result.success).toBe(false);
  });

  test('fails when fitness_goals array is empty', () => {
    const result = onboardingProfileSchema.safeParse({
      ...validProfile,
      fitness_goals: [],
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Please select at least one fitness goal');
    }
  });

  test('fails when available_equipment has conflicting "none" with other equipment', () => {
    const result = onboardingProfileSchema.safeParse({
      ...validProfile,
      available_equipment: ['none', 'pullup_bar'],
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'Cannot select other equipment when "No Equipment" is chosen'
      );
    }
  });

  test('passes when available_equipment is solely ["none"]', () => {
    const result = onboardingProfileSchema.safeParse({
      ...validProfile,
      available_equipment: ['none'],
    });
    expect(result.success).toBe(true);
  });

  test('fails when training_days array is empty', () => {
    const result = onboardingProfileSchema.safeParse({
      ...validProfile,
      training_days: [],
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Please select at least one preferred training day');
    }
  });

  test('fails when session_duration_minutes is not one of [15, 20, 30, 45, 60]', () => {
    const result = onboardingProfileSchema.safeParse({
      ...validProfile,
      session_duration_minutes: 90 as any,
    });
    expect(result.success).toBe(false);
  });

  test('fails when training_notes exceeds 500 characters', () => {
    const longNotes = 'a'.repeat(501);
    const result = onboardingProfileSchema.safeParse({
      ...validProfile,
      training_notes: longNotes,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Notes must not exceed 500 characters');
    }
  });
});

