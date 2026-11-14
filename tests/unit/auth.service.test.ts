import { AuthService } from '../../src/features/auth/services/authService';
import { supabase } from '../../src/services/supabase/client';

jest.mock('../../src/services/supabase/client', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      resetPasswordForEmail: jest.fn(),
      resend: jest.fn(),
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(),
    },
    from: jest.fn(),
  },
}));

describe('AuthService Unit Tests', () => {
  let service: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AuthService();
  });

  test('successful registration returns user and indicates verification status', async () => {
    (supabase.auth.signUp as jest.Mock).mockResolvedValue({
      data: {
        user: { id: 'user-123', email: 'athlete@example.com' },
        session: null, // email confirmation required
      },
      error: null,
    });

    const result = await service.signUp({
      fullName: 'Athlete One',
      email: 'athlete@example.com',
      password: 'StrongPassword123!',
      confirmPassword: 'StrongPassword123!',
    });

    expect(result.user.id).toBe('user-123');
    expect(result.needsEmailVerification).toBe(true);
    expect(supabase.auth.signUp).toHaveBeenCalledWith({
      email: 'athlete@example.com',
      password: 'StrongPassword123!',
      options: {
        data: { full_name: 'Athlete One' },
      },
    });
  });

  test('registration throws user-friendly message for duplicate email', async () => {
    (supabase.auth.signUp as jest.Mock).mockResolvedValue({
      data: { user: null, session: null },
      error: { message: 'User already registered' },
    });

    await expect(
      service.signUp({
        fullName: 'Athlete Two',
        email: 'athlete@example.com',
        password: 'StrongPassword123!',
        confirmPassword: 'StrongPassword123!',
      })
    ).rejects.toThrow('An account with this email address already exists. Please sign in instead.');
  });

  test('successful login returns user and active session', async () => {
    const mockSession = { access_token: 'token-abc', user: { id: 'user-123' } };
    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
      data: {
        user: { id: 'user-123', email: 'athlete@example.com' },
        session: mockSession,
      },
      error: null,
    });

    const result = await service.signIn({
      email: 'athlete@example.com',
      password: 'CorrectPassword!',
    });

    expect(result.user.id).toBe('user-123');
    expect(result.session).toBe(mockSession);
  });

  test('login throws user-friendly message for incorrect password', async () => {
    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
      data: { user: null, session: null },
      error: { message: 'Invalid login credentials' },
    });

    await expect(
      service.signIn({
        email: 'athlete@example.com',
        password: 'WrongPassword',
      })
    ).rejects.toThrow('Invalid email or password. Please verify and try again.');
  });

  test('password recovery dispatches email request', async () => {
    (supabase.auth.resetPasswordForEmail as jest.Mock).mockResolvedValue({
      data: {},
      error: null,
    });

    await expect(service.resetPassword('athlete@example.com')).resolves.toBeUndefined();
    expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalledWith('athlete@example.com');
  });

  test('session restoration retrieves active session', async () => {
    const mockSession = { user: { id: 'user-123' } };
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });

    const session = await service.getCurrentSession();
    expect(session).toBe(mockSession);
  });

  test('sign-out completes and clears session', async () => {
    (supabase.auth.signOut as jest.Mock).mockResolvedValue({
      error: null,
    });

    await expect(service.signOut()).resolves.toBeUndefined();
    expect(supabase.auth.signOut).toHaveBeenCalledTimes(1);
  });
});

