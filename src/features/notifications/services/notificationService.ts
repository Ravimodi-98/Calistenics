import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/services/supabase/client';
import {
  NotificationPreferences,
  NotificationPermissionStatus,
  ScheduledNotificationDescriptor,
} from '@/domain/models/notification.model';
import { notificationPreferencesSchema } from '@/domain/schemas/notification.schema';

const NOTIFICATION_PREFS_STORAGE_KEY = '@calisthenics_coach/notification_preferences';

// Configure foreground notification behavior (skip on web where unsupported)
if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

export const DEFAULT_NOTIFICATION_PREFERENCES: Omit<NotificationPreferences, 'user_id'> = {
  workout_reminders: true,
  skill_reminders: true,
  rest_day_reminders: true,
  weekly_summaries: true,
  workout_completion_enabled: true,
  reminder_hour: 8,
  reminder_minute: 0,
  quiet_hours_enabled: false,
  quiet_hours_start: '22:00',
  quiet_hours_end: '07:00',
  push_token: null,
  device_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
};

// Map day names to Expo weekday trigger numbers (1 = Sunday, 2 = Monday, etc.)
const DAY_NAME_TO_WEEKDAY: Record<string, number> = {
  sunday: 1,
  monday: 2,
  tuesday: 3,
  wednesday: 4,
  thursday: 5,
  friday: 6,
  saturday: 7,
};

export class NotificationService {
  /**
   * Check current device notification permissions.
   */
  async getPermissionStatus(): Promise<NotificationPermissionStatus> {
    if (Platform.OS === 'web') {
      return 'granted';
    }

    try {
      const settings = await Notifications.getPermissionsAsync();
      if (settings.granted || settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL) {
        return 'granted';
      }
      if (settings.canAskAgain) {
        return 'undetermined';
      }
      return 'denied';
    } catch {
      return 'undetermined';
    }
  }

  /**
   * Request device notification permissions.
   */
  async requestPermissions(): Promise<NotificationPermissionStatus> {
    if (Platform.OS === 'web') {
      return 'granted';
    }

    try {
      const response = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
        },
      });

      if (response.granted) {
        return 'granted';
      }
      return 'denied';
    } catch {
      return 'denied';
    }
  }

  /**
   * Get user notification preferences from Supabase with AsyncStorage cache fallback.
   */
  async getPreferences(userId: string): Promise<NotificationPreferences> {
    const defaultPrefs: NotificationPreferences = {
      user_id: userId,
      ...DEFAULT_NOTIFICATION_PREFERENCES,
      device_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    };

    // 1. Try local storage first for instant load
    try {
      const localJson = await AsyncStorage.getItem(`${NOTIFICATION_PREFS_STORAGE_KEY}_${userId}`);
      if (localJson) {
        const parsed = JSON.parse(localJson);
        const validated = notificationPreferencesSchema.safeParse(parsed);
        if (validated.success) {
          // Continue to fetch fresh from Supabase in background
          this.fetchAndCacheRemotePreferences(userId).catch(() => {});
          return validated.data as NotificationPreferences;
        }
      }
    } catch {
      // Ignore local storage error
    }

    // 2. Query Supabase
    return this.fetchAndCacheRemotePreferences(userId, defaultPrefs);
  }

  private async fetchAndCacheRemotePreferences(
    userId: string,
    fallback?: NotificationPreferences
  ): Promise<NotificationPreferences> {
    const defaultPrefs: NotificationPreferences = fallback || {
      user_id: userId,
      ...DEFAULT_NOTIFICATION_PREFERENCES,
      device_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    };

    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error || !data) {
        await this.saveLocalPreferences(defaultPrefs);
        return defaultPrefs;
      }

      const prefs: NotificationPreferences = {
        id: data.id,
        user_id: data.user_id,
        workout_reminders: data.workout_reminders ?? true,
        skill_reminders: data.skill_reminders ?? true,
        rest_day_reminders: data.rest_day_reminders ?? true,
        weekly_summaries: data.weekly_summaries ?? true,
        workout_completion_enabled: data.workout_completion_enabled ?? true,
        reminder_hour: data.reminder_hour ?? 8,
        reminder_minute: data.reminder_minute ?? 0,
        quiet_hours_enabled: data.quiet_hours_enabled ?? false,
        quiet_hours_start: data.quiet_hours_start ?? '22:00',
        quiet_hours_end: data.quiet_hours_end ?? '07:00',
        push_token: data.push_token,
        device_timezone: data.device_timezone || defaultPrefs.device_timezone,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };

      await this.saveLocalPreferences(prefs);
      return prefs;
    } catch {
      return defaultPrefs;
    }
  }

  /**
   * Save updated preferences to both Supabase and AsyncStorage.
   */
  async updatePreferences(
    userId: string,
    updates: Partial<NotificationPreferences>
  ): Promise<NotificationPreferences> {
    const current = await this.getPreferences(userId);
    const updated: NotificationPreferences = {
      ...current,
      ...updates,
      user_id: userId,
      updated_at: new Date().toISOString(),
    };

    // Save to AsyncStorage immediately
    await this.saveLocalPreferences(updated);

    // Sync to Supabase
    try {
      const payload = {
        user_id: userId,
        workout_reminders: updated.workout_reminders,
        skill_reminders: updated.skill_reminders,
        rest_day_reminders: updated.rest_day_reminders,
        weekly_summaries: updated.weekly_summaries,
        workout_completion_enabled: updated.workout_completion_enabled,
        reminder_hour: updated.reminder_hour,
        reminder_minute: updated.reminder_minute,
        quiet_hours_enabled: updated.quiet_hours_enabled,
        quiet_hours_start: updated.quiet_hours_start,
        quiet_hours_end: updated.quiet_hours_end,
        push_token: updated.push_token,
        device_timezone: updated.device_timezone,
        updated_at: updated.updated_at,
      };

      await supabase
        .from('notification_preferences')
        .upsert(payload, { onConflict: 'user_id' });
    } catch {
      // Supabase write failure handled gracefully; local copy persists
    }

    return updated;
  }

  private async saveLocalPreferences(prefs: NotificationPreferences): Promise<void> {
    try {
      await AsyncStorage.setItem(
        `${NOTIFICATION_PREFS_STORAGE_KEY}_${prefs.user_id}`,
        JSON.stringify(prefs)
      );
    } catch {
      // Storage error ignored
    }
  }

  /**
   * Reschedule all notifications for the user according to current preferences and training schedule.
   * Completely prevents duplicate scheduled notifications.
   */
  async syncSchedules(
    userId: string,
    trainingDays: string[] = ['monday', 'wednesday', 'friday'],
    targetSkills: string[] = ['handstand']
  ): Promise<ScheduledNotificationDescriptor[]> {
    if (Platform.OS === 'web') {
      return [];
    }

    // 1. Cancel all previous scheduled notifications to eliminate duplicates
    await this.cancelAllSchedules();

    // 2. Check permission status
    const perm = await this.getPermissionStatus();
    if (perm !== 'granted') {
      return [];
    }

    const prefs = await this.getPreferences(userId);
    const scheduledDescriptors: ScheduledNotificationDescriptor[] = [];

    const allDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const normalizedTrainingDays = trainingDays.map((d) => d.toLowerCase());
    const restDays = allDays.filter((d) => !normalizedTrainingDays.includes(d));

    // 3. Schedule Workout Reminders on Training Days
    if (prefs.workout_reminders) {
      for (const day of normalizedTrainingDays) {
        const weekday = DAY_NAME_TO_WEEKDAY[day];
        if (weekday) {
          const descriptor: ScheduledNotificationDescriptor = {
            identifier: `workout_reminder_${day}`,
            category: 'workout_reminder',
            title: 'Ready for Today’s Calisthenics Routine?',
            body: 'Your body is your equipment. Open your session to train with clean form and controlled rest.',
            weekday,
            hour: prefs.reminder_hour,
            minute: prefs.reminder_minute,
            repeats: true,
          };

          await this.scheduleWeeklyNotification(descriptor);
          scheduledDescriptors.push(descriptor);
        }
      }
    }

    // 4. Schedule Rest Day Reminders on Recovery Days
    if (prefs.rest_day_reminders && restDays.length > 0) {
      // Pick middle rest day or all rest days
      for (const day of restDays.slice(0, 2)) {
        const weekday = DAY_NAME_TO_WEEKDAY[day];
        if (weekday) {
          const descriptor: ScheduledNotificationDescriptor = {
            identifier: `rest_day_${day}`,
            category: 'rest_day',
            title: 'Recovery & Mobility Day',
            body: 'Strength and tendon density develop during rest. Prioritize good sleep and hydration.',
            weekday,
            hour: Math.min(prefs.reminder_hour + 1, 21),
            minute: prefs.reminder_minute,
            repeats: true,
          };

          await this.scheduleWeeklyNotification(descriptor);
          scheduledDescriptors.push(descriptor);
        }
      }
    }

    // 5. Schedule Skill Practice Reminders
    if (prefs.skill_reminders && targetSkills.length > 0) {
      const primarySkill = targetSkills[0].replace(/-/g, ' ');
      // Schedule skill practice mid-week afternoon
      const descriptor: ScheduledNotificationDescriptor = {
        identifier: 'skill_practice_reminder',
        category: 'skill_practice',
        title: `Skill Pathway: ${primarySkill.toUpperCase()}`,
        body: 'Dedicate 10 minutes to clean technical holds. Short, frequent practice builds neural pathways.',
        weekday: 4, // Wednesday
        hour: Math.min(prefs.reminder_hour + 4, 18),
        minute: 0,
        repeats: true,
      };

      await this.scheduleWeeklyNotification(descriptor);
      scheduledDescriptors.push(descriptor);
    }

    // 6. Schedule Weekly Progress Summary on Sunday Evening
    if (prefs.weekly_summaries) {
      const descriptor: ScheduledNotificationDescriptor = {
        identifier: 'weekly_summary_sunday',
        category: 'weekly_summary',
        title: 'Weekly Training Overview',
        body: 'Check your training consistency, completed sets, and skill progress this past week.',
        weekday: 1, // Sunday
        hour: 19,
        minute: 0,
        repeats: true,
      };

      await this.scheduleWeeklyNotification(descriptor);
      scheduledDescriptors.push(descriptor);
    }

    return scheduledDescriptors;
  }

  /**
   * Schedule a repeating weekly notification using Expo Notifications.
   */
  private async scheduleWeeklyNotification(
    descriptor: ScheduledNotificationDescriptor
  ): Promise<string | null> {
    try {
      const trigger: Notifications.WeeklyTriggerInput = {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday: descriptor.weekday || 1,
        hour: descriptor.hour,
        minute: descriptor.minute,
      };

      return await Notifications.scheduleNotificationAsync({
        identifier: descriptor.identifier,
        content: {
          title: descriptor.title,
          body: descriptor.body,
          sound: 'default',
          categoryIdentifier: descriptor.category,
        },
        trigger,
      });
    } catch {
      return null;
    }
  }

  /**
   * Immediate notification on workout completion (if enabled).
   */
  async notifyWorkoutCompleted(
    workoutName: string,
    completedSets: number,
    durationMinutes: number
  ): Promise<void> {
    if (Platform.OS === 'web') return;

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Workout Completed!',
          body: `Great discipline! Logged ${completedSets} sets in ${durationMinutes} minutes for ${workoutName}.`,
          sound: 'default',
          categoryIdentifier: 'workout_completed',
        },
        trigger: null, // deliver immediately
      });
    } catch {
      // Ignored
    }
  }

  /**
   * Immediate notification on skill milestone practice recorded.
   */
  async notifySkillPracticeLogged(
    skillName: string,
    stageName: string,
    metricText: string
  ): Promise<void> {
    if (Platform.OS === 'web') return;

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Skill Practice Recorded',
          body: `${skillName} • ${stageName}: Logged ${metricText}. Keep building honest mastery!`,
          sound: 'default',
          categoryIdentifier: 'skill_practice',
        },
        trigger: null,
      });
    } catch {
      // Ignored
    }
  }

  /**
   * Cancel all scheduled notifications to clear duplicates or on sign out.
   */
  async cancelAllSchedules(): Promise<void> {
    if (Platform.OS === 'web') return;

    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch {
      // Ignored
    }
  }
}

export const notificationService = new NotificationService();
