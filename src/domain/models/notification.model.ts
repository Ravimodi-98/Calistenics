export type NotificationCategory =
  | 'workout_reminder'
  | 'skill_practice'
  | 'rest_day'
  | 'weekly_summary'
  | 'workout_completed';

export type NotificationPermissionStatus = 'granted' | 'denied' | 'undetermined';

export interface NotificationPreferences {
  id?: string;
  user_id: string;
  workout_reminders: boolean;
  skill_reminders: boolean;
  rest_day_reminders: boolean;
  weekly_summaries: boolean;
  workout_completion_enabled: boolean;
  reminder_hour: number;
  reminder_minute: number;
  quiet_hours_enabled: boolean;
  quiet_hours_start: string;
  quiet_hours_end: string;
  push_token?: string | null;
  device_timezone: string;
  created_at?: string;
  updated_at?: string;
}

export interface ScheduledNotificationDescriptor {
  identifier: string;
  category: NotificationCategory;
  title: string;
  body: string;
  weekday?: number; // 1 = Sunday, 2 = Monday, etc. or null for daily
  hour: number;
  minute: number;
  repeats: boolean;
}

export interface LocalNotificationPayload {
  title: string;
  body: string;
  data?: Record<string, unknown>;
  categoryIdentifier?: string;
}
