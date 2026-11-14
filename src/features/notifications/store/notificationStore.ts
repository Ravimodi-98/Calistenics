import { create } from 'zustand';
import {
  NotificationPreferences,
  NotificationPermissionStatus,
} from '@/domain/models/notification.model';
import {
  notificationService,
  DEFAULT_NOTIFICATION_PREFERENCES,
} from '../services/notificationService';

interface NotificationState {
  preferences: NotificationPreferences | null;
  permissionStatus: NotificationPermissionStatus;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;

  // Actions
  initialize: (userId: string) => Promise<void>;
  requestPermission: (userId: string) => Promise<boolean>;
  toggleCategory: (
    userId: string,
    categoryKey: keyof Pick<
      NotificationPreferences,
      | 'workout_reminders'
      | 'skill_reminders'
      | 'rest_day_reminders'
      | 'weekly_summaries'
      | 'workout_completion_enabled'
    >
  ) => Promise<void>;
  updateReminderTime: (userId: string, hour: number, minute: number) => Promise<void>;
  toggleQuietHours: (userId: string, enabled: boolean) => Promise<void>;
  syncNotificationSchedules: (
    userId: string,
    trainingDays?: string[],
    targetSkills?: string[]
  ) => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  preferences: null,
  permissionStatus: 'undetermined',
  isLoading: false,
  isSaving: false,
  error: null,

  initialize: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const [permissionStatus, preferences] = await Promise.all([
        notificationService.getPermissionStatus(),
        notificationService.getPreferences(userId),
      ]);

      set({
        preferences,
        permissionStatus,
        isLoading: false,
      });
    } catch (err: any) {
      set({
        preferences: {
          user_id: userId,
          ...DEFAULT_NOTIFICATION_PREFERENCES,
        },
        permissionStatus: 'undetermined',
        isLoading: false,
        error: err?.message || 'Failed to load notification settings',
      });
    }
  },

  requestPermission: async (userId: string) => {
    try {
      const status = await notificationService.requestPermissions();
      set({ permissionStatus: status });

      if (status === 'granted') {
        const { preferences } = get();
        if (preferences) {
          await notificationService.syncSchedules(userId);
        }
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  toggleCategory: async (userId, categoryKey) => {
    const { preferences } = get();
    if (!preferences) return;

    const newValue = !preferences[categoryKey];
    const updated = {
      ...preferences,
      [categoryKey]: newValue,
    };

    set({ preferences: updated, isSaving: true });

    try {
      await notificationService.updatePreferences(userId, {
        [categoryKey]: newValue,
      });
      await notificationService.syncSchedules(userId);
    } catch (err: any) {
      set({ error: err?.message });
    } finally {
      set({ isSaving: false });
    }
  },

  updateReminderTime: async (userId, hour, minute) => {
    const { preferences } = get();
    if (!preferences) return;

    const updated = {
      ...preferences,
      reminder_hour: hour,
      reminder_minute: minute,
    };

    set({ preferences: updated, isSaving: true });

    try {
      await notificationService.updatePreferences(userId, {
        reminder_hour: hour,
        reminder_minute: minute,
      });
      await notificationService.syncSchedules(userId);
    } catch (err: any) {
      set({ error: err?.message });
    } finally {
      set({ isSaving: false });
    }
  },

  toggleQuietHours: async (userId, enabled) => {
    const { preferences } = get();
    if (!preferences) return;

    const updated = {
      ...preferences,
      quiet_hours_enabled: enabled,
    };

    set({ preferences: updated, isSaving: true });

    try {
      await notificationService.updatePreferences(userId, {
        quiet_hours_enabled: enabled,
      });
      await notificationService.syncSchedules(userId);
    } catch (err: any) {
      set({ error: err?.message });
    } finally {
      set({ isSaving: false });
    }
  },

  syncNotificationSchedules: async (userId, trainingDays, targetSkills) => {
    try {
      await notificationService.syncSchedules(userId, trainingDays, targetSkills);
    } catch {
      // Ignored
    }
  },
}));
