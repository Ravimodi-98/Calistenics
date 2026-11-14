/**
 * Unit tests for Protected Route State Machine Decisions
 */

export type NavigationTarget =
  | '/(auth)/welcome'
  | '/(auth)/verify-email'
  | '/(onboarding)/welcome'
  | '/(tabs)'
  | null; // null means allow staying on current route

export function evaluateNavigationTarget({
  user,
  profile,
  currentSegmentGroup,
  currentSubroute,
}: {
  user: { email_confirmed_at?: string; confirmed_at?: string; last_sign_in_at?: string } | null;
  profile: { onboarding_completed: boolean } | null;
  currentSegmentGroup: '(auth)' | '(tabs)' | '(onboarding)' | 'workout' | 'skills' | string;
  currentSubroute?: string;
}): NavigationTarget {
  const isProtectedAppRoute =
    currentSegmentGroup === '(tabs)' ||
    currentSegmentGroup === 'workout' ||
    currentSegmentGroup === 'skills';

  // Case 1: Unauthenticated
  if (!user) {
    if (isProtectedAppRoute || currentSegmentGroup === '(onboarding)') {
      return '/(auth)/welcome';
    }
    return null;
  }

  // Case 2: Unverified email (strictly requires email_confirmed_at or confirmed_at)
  const isVerified = !!user.email_confirmed_at || !!user.confirmed_at;
  if (!isVerified) {
    if (currentSubroute === 'verify-email') return null;
    return '/(auth)/verify-email';
  }

  // Case 3: Authenticated in (auth) group
  if (currentSegmentGroup === '(auth)') {
    if (profile?.onboarding_completed) {
      return '/(tabs)';
    }
    return '/(onboarding)/welcome';
  }

  // Case 4: Authenticated user attempting protected routes without completing onboarding
  if (isProtectedAppRoute && profile && !profile.onboarding_completed) {
    return '/(onboarding)/welcome';
  }

  // Case 5: Authenticated user attempting (onboarding) after completing onboarding
  if (currentSegmentGroup === '(onboarding)' && profile?.onboarding_completed) {
    return '/(tabs)';
  }

  return null;
}

describe('Protected Route Navigation Decision Logic', () => {
  test('unauthenticated user attempting to access tabs is redirected to welcome', () => {
    const target = evaluateNavigationTarget({
      user: null,
      profile: null,
      currentSegmentGroup: '(tabs)',
    });
    expect(target).toBe('/(auth)/welcome');
  });

  test('unauthenticated user attempting to access onboarding is redirected to welcome', () => {
    const target = evaluateNavigationTarget({
      user: null,
      profile: null,
      currentSegmentGroup: '(onboarding)',
    });
    expect(target).toBe('/(auth)/welcome');
  });

  test('authenticated but unverified user is redirected to email verification', () => {
    const target = evaluateNavigationTarget({
      user: { email_confirmed_at: undefined, confirmed_at: undefined, last_sign_in_at: undefined },
      profile: { onboarding_completed: false },
      currentSegmentGroup: '(tabs)',
    });
    expect(target).toBe('/(auth)/verify-email');
  });

  test('user with last_sign_in_at but missing email_confirmed_at is NOT considered verified and redirected to verify-email', () => {
    const target = evaluateNavigationTarget({
      user: {
        email_confirmed_at: undefined,
        confirmed_at: undefined,
        last_sign_in_at: '2026-11-14T12:00:00Z',
      },
      profile: { onboarding_completed: true },
      currentSegmentGroup: '(tabs)',
    });
    expect(target).toBe('/(auth)/verify-email');
  });

  test('user with confirmed_at is considered verified and allowed on dashboard', () => {
    const target = evaluateNavigationTarget({
      user: {
        email_confirmed_at: undefined,
        confirmed_at: '2026-11-14T12:00:00Z',
        last_sign_in_at: '2026-11-14T12:00:00Z',
      },
      profile: { onboarding_completed: true },
      currentSegmentGroup: '(tabs)',
    });
    expect(target).toBeNull();
  });

  test('authenticated and verified user with incomplete onboarding is redirected to onboarding welcome', () => {
    const target = evaluateNavigationTarget({
      user: { email_confirmed_at: '2026-11-14T12:00:00Z' },
      profile: { onboarding_completed: false },
      currentSegmentGroup: '(auth)',
      currentSubroute: 'sign-in',
    });
    expect(target).toBe('/(onboarding)/welcome');
  });

  test('authenticated and verified user with completed onboarding is redirected to dashboard tabs', () => {
    const target = evaluateNavigationTarget({
      user: { email_confirmed_at: '2026-11-14T12:00:00Z' },
      profile: { onboarding_completed: true },
      currentSegmentGroup: '(auth)',
      currentSubroute: 'sign-in',
    });
    expect(target).toBe('/(tabs)');
  });

  test('authenticated user who completed onboarding cannot re-enter onboarding flow', () => {
    const target = evaluateNavigationTarget({
      user: { email_confirmed_at: '2026-11-14T12:00:00Z' },
      profile: { onboarding_completed: true },
      currentSegmentGroup: '(onboarding)',
      currentSubroute: 'experience',
    });
    expect(target).toBe('/(tabs)');
  });

  describe('Deep Link and Route Hardening (Phase 8.2)', () => {
    test('unauthenticated user attempting to open workout session directly is redirected to welcome', () => {
      const target = evaluateNavigationTarget({
        user: null,
        profile: null,
        currentSegmentGroup: 'workout',
        currentSubroute: 'session',
      });
      expect(target).toBe('/(auth)/welcome');
    });

    test('unauthenticated user attempting to open skill detail directly is redirected to welcome', () => {
      const target = evaluateNavigationTarget({
        user: null,
        profile: null,
        currentSegmentGroup: 'skills',
        currentSubroute: 'muscle-up',
      });
      expect(target).toBe('/(auth)/welcome');
    });

    test('unauthenticated user attempting to open skill practice directly is redirected to welcome', () => {
      const target = evaluateNavigationTarget({
        user: null,
        profile: null,
        currentSegmentGroup: 'skills',
        currentSubroute: 'practice',
      });
      expect(target).toBe('/(auth)/welcome');
    });

    test('authenticated user with incomplete onboarding opening workout is redirected to onboarding', () => {
      const target = evaluateNavigationTarget({
        user: { email_confirmed_at: '2026-11-14T12:00:00Z' },
        profile: { onboarding_completed: false },
        currentSegmentGroup: 'workout',
        currentSubroute: 'today',
      });
      expect(target).toBe('/(onboarding)/welcome');
    });

    test('authenticated user with incomplete onboarding opening skills practice is redirected to onboarding', () => {
      const target = evaluateNavigationTarget({
        user: { email_confirmed_at: '2026-11-14T12:00:00Z' },
        profile: { onboarding_completed: false },
        currentSegmentGroup: 'skills',
        currentSubroute: 'practice',
      });
      expect(target).toBe('/(onboarding)/welcome');
    });

    test('unverified user attempting to access workout route is redirected to verify-email', () => {
      const target = evaluateNavigationTarget({
        user: { email_confirmed_at: undefined, confirmed_at: undefined, last_sign_in_at: undefined },
        profile: { onboarding_completed: true },
        currentSegmentGroup: 'workout',
        currentSubroute: 'session',
      });
      expect(target).toBe('/(auth)/verify-email');
    });

    test('authenticated verified user with completed onboarding is allowed on workout session', () => {
      const target = evaluateNavigationTarget({
        user: { email_confirmed_at: '2026-11-14T12:00:00Z' },
        profile: { onboarding_completed: true },
        currentSegmentGroup: 'workout',
        currentSubroute: 'session',
      });
      expect(target).toBeNull();
    });

    test('authenticated verified user with completed onboarding is allowed on skill practice', () => {
      const target = evaluateNavigationTarget({
        user: { email_confirmed_at: '2026-11-14T12:00:00Z' },
        profile: { onboarding_completed: true },
        currentSegmentGroup: 'skills',
        currentSubroute: 'practice',
      });
      expect(target).toBeNull();
    });

    test('user signing out while on a protected workout screen is immediately redirected to welcome', () => {
      const target = evaluateNavigationTarget({
        user: null,
        profile: null,
        currentSegmentGroup: 'workout',
        currentSubroute: 'session',
      });
      expect(target).toBe('/(auth)/welcome');
    });
  });
});
