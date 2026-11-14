import { OnboardingService } from '../../src/features/onboarding/services/onboardingService';
import { supabase } from '../../src/services/supabase/client';
import { OnboardingProfileInput } from '../../src/domain/schemas/onboarding.schema';

jest.mock('../../src/services/supabase/client', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

describe('OnboardingService Unit & Integration Tests', () => {
  let service: OnboardingService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new OnboardingService();
  });

  describe('resolveEquipmentSelection', () => {
    test('selecting "none" resets list to solely ["none"]', () => {
      const result = service.resolveEquipmentSelection(['pullup_bar', 'rings'], 'none');
      expect(result).toEqual(['none']);
    });

    test('selecting an item when current is ["none"] removes "none" and adds item', () => {
      const result = service.resolveEquipmentSelection(['none'], 'pullup_bar');
      expect(result).toEqual(['pullup_bar']);
    });

    test('selecting an unselected item adds it to the list', () => {
      const result = service.resolveEquipmentSelection(['pullup_bar'], 'resistance_bands');
      expect(result).toEqual(['pullup_bar', 'resistance_bands']);
    });

    test('deselecting an existing item removes it from the list', () => {
      const result = service.resolveEquipmentSelection(['pullup_bar', 'rings'], 'rings');
      expect(result).toEqual(['pullup_bar']);
    });

    test('deselecting the only item defaults back to ["none"]', () => {
      const result = service.resolveEquipmentSelection(['pullup_bar'], 'pullup_bar');
      expect(result).toEqual(['none']);
    });
  });

  describe('saveOnboardingProfile', () => {
    const validPayload: OnboardingProfileInput = {
      experience_level: 'intermediate',
      fitness_goals: ['build_strength'],
      target_skills: ['handstand'],
      available_equipment: ['pullup_bar'],
      training_days: ['monday', 'wednesday', 'friday'],
      session_duration_minutes: 45,
      preferred_training_time: 'evening',
      training_location: 'gym',
      coaching_style: 'guided',
      workout_preference: 'strength',
      training_notes: 'None',
    };

    test('successfully persists onboarding profile and sets onboarding_completed to true', async () => {
      const mockUpdatedProfile = {
        id: 'user-xyz-123',
        full_name: 'Alex Hunter',
        onboarding_completed: true,
        ...validPayload,
      };

      (supabase.from as jest.Mock).mockReturnValue({
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockUpdatedProfile,
          error: null,
        }),
      });

      const result = await service.saveOnboardingProfile('user-xyz-123', validPayload);

      expect(result.onboarding_completed).toBe(true);
      expect(result.experience_level).toBe('intermediate');
      expect(supabase.from).toHaveBeenCalledWith('profiles');
    });

    test('throws descriptive error when Supabase update fails', async () => {
      (supabase.from as jest.Mock).mockReturnValue({
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Database connection timeout' },
        }),
      });

      await expect(
        service.saveOnboardingProfile('user-xyz-123', validPayload)
      ).rejects.toThrow('Failed to save onboarding profile: Database connection timeout');
    });

    test('rejects payload that violates Zod schema before database write', async () => {
      const invalidPayload = {
        ...validPayload,
        fitness_goals: [], // invalid
      };

      await expect(
        service.saveOnboardingProfile('user-xyz-123', invalidPayload as any)
      ).rejects.toThrow();

      // Database should never be called when validation fails
      expect(supabase.from).not.toHaveBeenCalled();
    });
  });
});

