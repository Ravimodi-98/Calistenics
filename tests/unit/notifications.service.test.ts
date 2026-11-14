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

jest.mock('expo-notifications', () => ({
  setNotificationHandler: jest.fn(),
  getPermissionsAsync: jest.fn().mockResolvedValue({
    granted: true,
    canAskAgain: true,
    ios: { status: 2 },
  }),
  requestPermissionsAsync: jest.fn().mockResolvedValue({
    granted: true,
  }),
  scheduleNotificationAsync: jest.fn().mockResolvedValue('test-notification-id'),
  cancelAllScheduledNotificationsAsync: jest.fn().mockResolvedValue(undefined),
  SchedulableTriggerInputTypes: {
    WEEKLY: 'weekly',
  },
  IosAuthorizationStatus: {
    PROVISIONAL: 1,
    AUTHORIZED: 2,
  },
}));

jest.mock('../../src/services/supabase/client', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
      upsert: jest.fn().mockResolvedValue({ data: null, error: null }),
    })),
  },
}));

import {
  NotificationService,
  DEFAULT_NOTIFICATION_PREFERENCES,
} from '../../src/features/notifications/services/notificationService';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

describe('NotificationService & Schedule Architecture', () => {
  let service: NotificationService;

  beforeEach(async () => {
    jest.clearAllMocks();
    await AsyncStorage.clear();
    service = new NotificationService();
  });

  describe('Permissions & Status Checks', () => {
    it('returns granted status when notification permissions are granted', async () => {
      const status = await service.getPermissionStatus();
      expect(status).toBe('granted');
    });

    it('requests permissions and returns granted if accepted by user', async () => {
      const status = await service.requestPermissions();
      expect(status).toBe('granted');
      expect(Notifications.requestPermissionsAsync).toHaveBeenCalled();
    });

    it('returns denied status when user rejects permissions', async () => {
      (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValueOnce({
        granted: false,
      });

      const status = await service.requestPermissions();
      expect(status).toBe('denied');
    });
  });

  describe('Notification Preferences & Persistence', () => {
    it('loads default preferences when user has no stored settings', async () => {
      const prefs = await service.getPreferences('user-123');
      expect(prefs.user_id).toBe('user-123');
      expect(prefs.workout_reminders).toBe(true);
      expect(prefs.reminder_hour).toBe(8);
      expect(prefs.reminder_minute).toBe(0);
      expect(prefs.quiet_hours_enabled).toBe(false);
    });

    it('updates preferences and persists to storage and Supabase', async () => {
      const updated = await service.updatePreferences('user-123', {
        reminder_hour: 7,
        reminder_minute: 30,
        rest_day_reminders: false,
      });

      expect(updated.reminder_hour).toBe(7);
      expect(updated.reminder_minute).toBe(30);
      expect(updated.rest_day_reminders).toBe(false);

      // Verify cached in AsyncStorage
      const stored = await AsyncStorage.getItem(
        '@calisthenics_coach/notification_preferences_user-123'
      );
      expect(stored).not.toBeNull();
      const parsed = JSON.parse(stored!);
      expect(parsed.reminder_hour).toBe(7);
    });
  });

  describe('Schedule Synchronization & Duplicate Prevention', () => {
    it('cancels all previous notifications before scheduling new ones to eliminate duplicates', async () => {
      await service.syncSchedules('user-123', ['monday', 'wednesday', 'friday'], ['handstand']);

      // cancelAllScheduledNotificationsAsync must be called FIRST
      expect(Notifications.cancelAllScheduledNotificationsAsync).toHaveBeenCalledTimes(1);
    });

    it('schedules workout reminders on user training days', async () => {
      const descriptors = await service.syncSchedules(
        'user-123',
        ['monday', 'thursday'],
        []
      );

      const workoutReminders = descriptors.filter((d) => d.category === 'workout_reminder');
      expect(workoutReminders.length).toBe(2);
      expect(workoutReminders.map((d) => d.identifier)).toEqual([
        'workout_reminder_monday',
        'workout_reminder_thursday',
      ]);
    });

    it('schedules rest day recovery reminders on off days', async () => {
      const descriptors = await service.syncSchedules(
        'user-123',
        ['monday', 'wednesday', 'friday'],
        []
      );

      const restReminders = descriptors.filter((d) => d.category === 'rest_day');
      expect(restReminders.length).toBeGreaterThan(0);
      restReminders.forEach((r) => {
        expect(r.title).toContain('Recovery');
      });
    });

    it('schedules weekly progress summaries on Sunday', async () => {
      const descriptors = await service.syncSchedules(
        'user-123',
        ['monday', 'wednesday'],
        []
      );

      const weeklySummary = descriptors.find((d) => d.category === 'weekly_summary');
      expect(weeklySummary).toBeDefined();
      expect(weeklySummary?.weekday).toBe(1); // Sunday
    });

    it('disables workout reminders when category toggle is off', async () => {
      await service.updatePreferences('user-123', { workout_reminders: false });

      const descriptors = await service.syncSchedules(
        'user-123',
        ['monday', 'wednesday', 'friday'],
        []
      );

      const workoutReminders = descriptors.filter((d) => d.category === 'workout_reminder');
      expect(workoutReminders.length).toBe(0);
    });
  });

  describe('Immediate Workout Completion & Milestone Notifications', () => {
    it('triggers immediate workout completion notification', async () => {
      await service.notifyWorkoutCompleted('Upper Body Foundation', 12, 35);

      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          content: expect.objectContaining({
            title: 'Workout Completed!',
            body: expect.stringContaining('Upper Body Foundation'),
            categoryIdentifier: 'workout_completed',
          }),
          trigger: null,
        })
      );
    });

    it('triggers immediate skill milestone practice notification', async () => {
      await service.notifySkillPracticeLogged('Handstand', 'Chest-to-Wall Hold', '35 seconds');

      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          content: expect.objectContaining({
            title: 'Skill Practice Recorded',
            body: expect.stringContaining('Handstand • Chest-to-Wall Hold'),
          }),
          trigger: null,
        })
      );
    });
  });
});
