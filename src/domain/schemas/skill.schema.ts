import { z } from 'zod';

export const skillEquipmentSchema = z.enum(['none', 'pull_up_bar', 'vertical_support']);

export const skillDifficultySchema = z.enum(['beginner', 'intermediate', 'advanced', 'elite']);

export const skillAssessmentStatusSchema = z.enum([
  'not_started',
  'learning',
  'practicing',
  'ready_for_assessment',
  'completed',
  'not_assessed',
  'proficient',
  'mastered',
]);

export const skillCatalogItemSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(2),
  name: z.string().min(2),
  description: z.string().min(10),
  difficulty: skillDifficultySchema,
  equipment_required: skillEquipmentSchema,
  primary_muscles: z.array(z.string()),
  secondary_muscles: z.array(z.string()).default([]),
  prerequisites: z.array(z.string()).default([]),
  safety_notes: z.string().nullable().optional(),
  animation_asset: z.string().min(3),
  content_status: z.enum(['draft', 'reviewed', 'published']).default('published'),
});

export const skillProgressionStageSchema = z.object({
  id: z.string().uuid().optional(),
  skill_id: z.string().uuid().optional(),
  skill_slug: z.string().min(2),
  stage_order: z.number().int().min(1),
  stage_slug: z.string().min(2),
  stage_name: z.string().min(2),
  description: z.string().min(10),
  target_type: z.enum(['hold_seconds', 'repetitions']),
  target_value: z.number().int().min(1),
  prerequisites: z.array(z.string()).default([]),
  technique_cues: z.array(z.string()).default([]),
  safety_notes: z.string().nullable().optional(),
  animation_asset: z.string().min(3),
  assessment_criteria: z.string().min(10),
});

export const recordSkillPracticeSchema = z.object({
  skill_slug: z.string().min(2),
  stage_slug: z.string().min(2),
  duration_seconds: z.number().int().min(0).max(18000), // Max 5 hours
  completed_sets: z.number().int().min(1).max(50),
  recorded_hold_seconds: z.number().int().min(0).max(600).optional().default(0),
  recorded_reps: z.number().int().min(0).max(500).optional().default(0),
  effort_rating: z.number().int().min(1).max(5).nullable().optional(),
  notes: z.string().max(1000).nullable().optional(),
});

export type RecordSkillPracticeInput = z.input<typeof recordSkillPracticeSchema>;
