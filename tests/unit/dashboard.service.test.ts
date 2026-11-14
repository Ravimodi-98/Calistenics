import { DashboardService } from '../../src/features/dashboard/services/dashboardService';
import { Profile } from '../../src/domain/models/user.model';

jest.mock('../../src/services/supabase/client', () => ({
  supabase: {
    from: jest.fn().mockImplementation((table: string) => {
      if (table === 'workout_sessions') {
        return {
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              order: jest.fn().mockResolvedValue({
                data: [],
                error: null,
              }),
            }),
          }),
        };
      }
      if (table === 'user_skill_progress') {
        return {
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({
              data: [],
              error: null,
            }),
          }),
        };
      }
      if (table === 'exercises') {
        return {
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              order: jest.fn().mockResolvedValue({
                data: [],
                error: null,
              }),
            }),
          }),
        };
      }
      return {
        select: jest.fn().mockResolvedValue({ data: [], error: null }),
      };
    }),
  },
}));

describe('DashboardService Unit Tests', () => {
  let service: DashboardService;

  beforeEach(() => {
    service = new DashboardService();
  });

  test('assembles personalized dashboard data for fully onboarded user', async () => {
    const profile: Profile = {
      id: 'usr-123',
      full_name: 'Ravi Modi',
      onboarding_completed: true,
      experience_level: 'beginner',
      available_equipment: ['none'],
      training_days: ['monday', 'wednesday', 'friday'],
      session_duration_minutes: 30,
      workout_preference: 'balanced',
      fitness_goals: ['build_strength'],
      target_skills: ['handstand', 'l_sit'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const dashboard = await service.getDashboardData('usr-123', profile);

    expect(dashboard.userFirstName).toBe('Ravi');
    expect(dashboard.needsOnboarding).toBe(false);
    expect(dashboard.todayWorkout).toBeDefined();
    expect(dashboard.todayWorkout.exerciseCount).toBeGreaterThanOrEqual(0);
    expect(dashboard.skills.length).toBe(2);
    expect(dashboard.weeklyActivity.days.length).toBe(7);
    expect(dashboard.achievements.length).toBe(4);
  });

  test('returns safe setup prompt when user profile is missing onboarding essentials', async () => {
    const incompleteProfile: Profile = {
      id: 'usr-456',
      full_name: 'New Athlete',
      onboarding_completed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const dashboard = await service.getDashboardData('usr-456', incompleteProfile);

    expect(dashboard.userFirstName).toBe('New');
    expect(dashboard.needsOnboarding).toBe(true);
    expect(dashboard.todayWorkout).toBeDefined();
    expect(dashboard.skills.length).toBeGreaterThan(0);
  });
});
