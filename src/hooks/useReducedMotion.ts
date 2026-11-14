import { useEffect } from 'react';
import { useAccessibilityStore } from '@/features/preferences/store/accessibilityPreferencesStore';

/**
 * Returns whether reduced motion is currently effective.
 * Combines the device OS setting with the user's in-app preference.
 */
export function useReducedMotion(): boolean {
  const { isInitialized, initialize, effectiveReducedMotion } = useAccessibilityStore();

  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [isInitialized, initialize]);

  return effectiveReducedMotion();
}
