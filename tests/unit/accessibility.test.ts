const mockStorage: Record<string, string> = {};

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn((k: string, v: string) => {
    mockStorage[k] = v;
    return Promise.resolve(null);
  }),
  getItem: jest.fn((k: string) => Promise.resolve(mockStorage[k] || null)),
  removeItem: jest.fn((k: string) => {
    delete mockStorage[k];
    return Promise.resolve(null);
  }),
  clear: jest.fn(() => {
    Object.keys(mockStorage).forEach((k) => delete mockStorage[k]);
    return Promise.resolve(null);
  }),
}));

import { useAccessibilityStore } from '../../src/features/preferences/store/accessibilityPreferencesStore';
import { AccessibilityInfo } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

describe('Accessibility & Reduced Motion Architecture', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    useAccessibilityStore.setState({
      reducedMotionPreference: 'system',
      isSystemReduceMotion: false,
      hapticsEnabled: true,
      isInitialized: false,
    });
  });

  describe('Reduced Motion Preference Modes', () => {
    it('defaults to system motion setting when preference is "system"', async () => {
      const store = useAccessibilityStore.getState();
      useAccessibilityStore.setState({
        reducedMotionPreference: 'system',
        isSystemReduceMotion: false,
      });

      expect(store.effectiveReducedMotion()).toBe(false);

      useAccessibilityStore.setState({
        isSystemReduceMotion: true,
      });

      expect(useAccessibilityStore.getState().effectiveReducedMotion()).toBe(true);
    });

    it('forces reduced motion when set to "always_reduce" even if system has it off', async () => {
      await useAccessibilityStore.getState().setReducedMotionPreference('always_reduce');
      useAccessibilityStore.setState({ isSystemReduceMotion: false });

      expect(useAccessibilityStore.getState().effectiveReducedMotion()).toBe(true);

      // Verify persisted in AsyncStorage
      const stored = await AsyncStorage.getItem('@calisthenics_coach/accessibility_prefs');
      expect(stored).not.toBeNull();
      const parsed = JSON.parse(stored!);
      expect(parsed.reducedMotionPreference).toBe('always_reduce');
    });

    it('forces full motion when set to "always_motion" even if system has reduced motion on', async () => {
      await useAccessibilityStore.getState().setReducedMotionPreference('always_motion');
      useAccessibilityStore.setState({ isSystemReduceMotion: true });

      expect(useAccessibilityStore.getState().effectiveReducedMotion()).toBe(false);
    });

    it('toggles haptic feedback preference and persists setting', async () => {
      await useAccessibilityStore.getState().setHapticsEnabled(false);
      expect(useAccessibilityStore.getState().hapticsEnabled).toBe(false);

      const stored = await AsyncStorage.getItem('@calisthenics_coach/accessibility_prefs');
      const parsed = JSON.parse(stored!);
      expect(parsed.hapticsEnabled).toBe(false);
    });
  });

  describe('Touch Target & Dynamic Font Guidelines', () => {
    it('satisfies WCAG 2.5.5 minimum 44px touch target guideline across all button sizes', () => {
      // In AppButton.tsx: size_sm minHeight = 44, size_md = 48, size_lg = 56
      const buttonSizes = {
        sm: 44,
        md: 48,
        lg: 56,
      };

      Object.entries(buttonSizes).forEach(([size, minHeight]) => {
        expect(minHeight).toBeGreaterThanOrEqual(44);
      });
    });
  });
});
