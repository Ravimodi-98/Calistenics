import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '../store/authStore';

export function useProtectedRoute() {
  const router = useRouter();
  const segments = useSegments();
  const { user, profile, isInitialized, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isInitialized || isLoading) return;

    const segArray = segments as unknown as string[];
    const rootSegment = segArray[0];
    const inAuthGroup = rootSegment === '(auth)';
    const inTabsGroup = rootSegment === '(tabs)';
    const inOnboardingGroup = rootSegment === '(onboarding)';
    const isWorkoutRoute = rootSegment === 'workout';
    const isSkillsRoute = rootSegment === 'skills';
    const isProtectedAppRoute = inTabsGroup || isWorkoutRoute || isSkillsRoute;

    // Case 1: Unauthenticated user attempting to access protected screens
    if (!user) {
      if (isProtectedAppRoute || inOnboardingGroup) {
        // Prevent access to protected routes and deep links
        router.replace('/(auth)/welcome');
      }
      return;
    }

    // Case 2: Authenticated but unverified email (when confirmation is required)
    const isVerified = !!user.email_confirmed_at || !!user.confirmed_at || !!user.last_sign_in_at;
    const isVerificationRoute = segArray[1] === 'verify-email' || segArray.includes('verify-email');

    if (!isVerified && !isVerificationRoute) {
      router.replace('/(auth)/verify-email');
      return;
    }

    // Case 3: Authenticated and verified user navigating in auth routes
    if (inAuthGroup && isVerified) {
      if (profile?.onboarding_completed) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(onboarding)/welcome');
      }
      return;
    }

    // Case 4: Authenticated user attempting to access main dashboard/workout/skills without completing onboarding
    if (isProtectedAppRoute && profile && !profile.onboarding_completed) {
      router.replace('/(onboarding)/welcome');
      return;
    }

    // Case 5: Authenticated user attempting to access onboarding after already completing it
    if (inOnboardingGroup && profile?.onboarding_completed) {
      router.replace('/(tabs)');
    }
  }, [user, profile, isInitialized, isLoading, segments, router]);
}
