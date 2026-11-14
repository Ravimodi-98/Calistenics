import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AccessibilityInfo } from 'react-native';

export type ReducedMotionPreference = 'system' | 'always_reduce' | 'always_motion';

interface AccessibilityPreferencesState {
  reducedMotionPreference: ReducedMotionPreference;
  isSystemReduceMotion: boolean;
  hapticsEnabled: boolean;
  isInitialized: boolean;

  // Actions
  initialize: () => Promise<void>;
  setReducedMotionPreference: (preference: ReducedMotionPreference) => Promise<void>;
  setHapticsEnabled: (enabled: boolean) => Promise<void>;
  effectiveReducedMotion: () => boolean;
}

const STORAGE_KEY = '@calisthenics_coach/accessibility_prefs';

export const useAccessibilityStore = create<AccessibilityPreferencesState>((set, get) => ({
  reducedMotionPreference: 'system',
  isSystemReduceMotion: false,
  hapticsEnabled: true,
  isInitialized: false,

  initialize: async () => {
    try {
      // 1. Check system accessibility setting
      const systemEnabled = await AccessibilityInfo.isReduceMotionEnabled().catch(() => false);

      // 2. Load stored user preference
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      let preference: ReducedMotionPreference = 'system';
      let haptics = true;

      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.reducedMotionPreference) {
          preference = parsed.reducedMotionPreference;
        }
        if (typeof parsed.hapticsEnabled === 'boolean') {
          haptics = parsed.hapticsEnabled;
        }
      }

      set({
        reducedMotionPreference: preference,
        isSystemReduceMotion: systemEnabled,
        hapticsEnabled: haptics,
        isInitialized: true,
      });

      // Listen to OS changes
      AccessibilityInfo.addEventListener('reduceMotionChanged', (enabled) => {
        set({ isSystemReduceMotion: enabled });
      });
    } catch {
      set({ isInitialized: true });
    }
  },

  setReducedMotionPreference: async (preference: ReducedMotionPreference) => {
    set({ reducedMotionPreference: preference });
    const { hapticsEnabled } = get();
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ reducedMotionPreference: preference, hapticsEnabled })
      );
    } catch {
      // Ignore
    }
  },

  setHapticsEnabled: async (enabled: boolean) => {
    set({ hapticsEnabled: enabled });
    const { reducedMotionPreference } = get();
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ reducedMotionPreference, hapticsEnabled: enabled })
      );
    } catch {
      // Ignore
    }
  },

  effectiveReducedMotion: () => {
    const { reducedMotionPreference, isSystemReduceMotion } = get();
    if (reducedMotionPreference === 'always_reduce') return true;
    if (reducedMotionPreference === 'always_motion') return false;
    return isSystemReduceMotion;
  },
}));
