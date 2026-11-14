import { z } from 'zod';

export const notificationCategorySchema = z.enum([
  'workout_reminder',
  'skill_practice',
  'rest_day',
  'weekly_summary',
  'workout_completed',
]);

export const notificationPreferencesSchema = z.object({
  user_id: z.string().min(1),
  workout_reminders: z.boolean().default(true),
  skill_reminders: z.boolean().default(true),
  rest_day_reminders: z.boolean().default(true),
  weekly_summaries: z.boolean().default(true),
  workout_completion_enabled: z.boolean().default(true),
  reminder_hour: z.number().int().min(0).max(23).default(8),
  reminder_minute: z.number().int().min(0).max(59).default(0),
  quiet_hours_enabled: z.boolean().default(false),
  quiet_hours_start: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).default('22:00'),
  quiet_hours_end: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).default('07:00'),
  push_token: z.string().nullable().optional(),
  device_timezone: z.string().default('UTC'),
});

export type NotificationPreferencesInput = z.infer<typeof notificationPreferencesSchema>;
