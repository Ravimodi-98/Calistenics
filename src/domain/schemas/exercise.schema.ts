import { z } from 'zod';

export const exerciseCategoryEnum = z.enum([
  'no_equipment',
  'push',
  'pull',
  'legs',
  'core',
  'skills',
]);

export const exerciseEquipmentEnum = z.enum(['none', 'pull_up_bar']);

export const exerciseDifficultyEnum = z.enum([
  'beginner',
  'intermediate',
  'advanced',
]);

export const exerciseContentStatusEnum = z.enum([
  'draft',
  'reviewed',
  'published',
]);

export const exerciseInstructionStepSchema = z.object({
  step: z.number().int().positive(),
  title: z.string().min(1),
  cue: z.string().min(1),
});

export const exerciseSchema = z.object({
  id: z.string().uuid(),
  slug: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  category: exerciseCategoryEnum,
  equipment_required: exerciseEquipmentEnum,
  difficulty: exerciseDifficultyEnum,
  primary_muscles: z.array(z.string()).min(1),
  secondary_muscles: z.array(z.string()).default([]),
  instructions: z.array(exerciseInstructionStepSchema).min(1),
  prerequisites: z.array(z.string()).default([]),
  progression_exercises: z.array(z.string()).default([]),
  regressions: z.array(z.string()).default([]),
  safety_notes: z.string().nullable().optional(),
  disclaimer: z.string().nullable().optional(),
  animation_asset_path: z.string().min(1),
  animation_format: z.string().default('lottie_json'),
  content_status: exerciseContentStatusEnum,
  created_at: z.string(),
  updated_at: z.string(),
});

export type ExerciseSchemaType = z.infer<typeof exerciseSchema>;

