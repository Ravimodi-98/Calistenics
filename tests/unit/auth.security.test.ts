import { AuthService } from '../../src/features/auth/services/authService';
import { supabase } from '../../src/services/supabase/client';

jest.mock('../../src/services/supabase/client', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

describe('Profile RLS & Security Boundary Tests', () => {
  let service: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AuthService();
  });

  test('User A cannot read User B profile (returns null if RLS blocks or not found)', async () => {
    const userA_id = 'user-a-111';
    const userB_id = 'user-b-222';

    // Mock Supabase RLS rejection: returns null or error for cross-user read
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      maybeSingle: jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Row Level Security policy denied access' },
      }),
    });

    const result = await service.getProfile(userB_id);
    expect(result).toBeNull();
  });

  test('User A cannot update User B profile (throws error)', async () => {
    const userB_id = 'user-b-222';

    (supabase.from as jest.Mock).mockReturnValue({
      update: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Row Level Security policy violated' },
      }),
    });

    await expect(
      service.updateProfile(userB_id, { full_name: 'Hacked Name' })
    ).rejects.toThrow('Failed to update profile.');
  });

  test('Unauthenticated requests are denied access to private profile', async () => {
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      maybeSingle: jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'JWT missing or invalid' },
      }),
    });

    const result = await service.getProfile('any-user-id');
    expect(result).toBeNull();
  });
});

