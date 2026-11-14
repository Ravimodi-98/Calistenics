export type SkillAssessmentStatus =
  | 'not_started'
  | 'learning'
  | 'practicing'
  | 'ready_for_assessment'
  | 'completed'
  | 'not_assessed'
  | 'proficient'
  | 'mastered';

export type SkillEquipmentRequirement = 'none' | 'pull_up_bar' | 'vertical_support';

export type SkillDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'elite';

export interface SkillCatalogItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  difficulty: SkillDifficulty;
  equipment_required: SkillEquipmentRequirement;
  primary_muscles: string[];
  secondary_muscles: string[];
  prerequisites: string[];
  safety_notes: string | null;
  animation_asset: string;
  content_status: 'draft' | 'reviewed' | 'published';
  created_at?: string;
}

export interface SkillProgressionStage {
  id: string;
  skill_id: string;
  skill_slug: string;
  stage_order: number;
  stage_slug: string;
  stage_name: string;
  description: string;
  target_type: 'hold_seconds' | 'repetitions';
  target_value: number;
  prerequisites: string[];
  technique_cues: string[];
  safety_notes: string | null;
  animation_asset: string;
  assessment_criteria: string;
  created_at?: string;
}

export interface UserSkillProgressRecord {
  id: string;
  user_id: string;
  skill_slug: string;
  skill_name: string;
  skill_id?: string | null;
  current_stage_id?: string | null;
  current_stage_order: number;
  progression_level: string;
  assessment_status: SkillAssessmentStatus;
  best_hold_seconds: number;
  best_reps: number;
  last_practiced_at: string | null;
  notes: string | null;
  updated_at: string;
}

export interface SkillPracticeSession {
  id: string;
  user_id: string;
  skill_id?: string | null;
  skill_slug: string;
  progression_id?: string | null;
  stage_slug: string;
  duration_seconds: number;
  completed_sets: number;
  recorded_hold_seconds: number;
  recorded_reps: number;
  effort_rating: number | null;
  notes: string | null;
  created_at: string;
}

export interface StageReadinessEvaluation {
  isReady: boolean;
  currentStatus: SkillAssessmentStatus;
  criteriaMet: boolean;
  prerequisitesMet: boolean;
  missingPrerequisites: string[];
  recommendationMessage: string;
  stage: SkillProgressionStage;
}

/**
 * Backward compatibility interfaces
 */
export interface UserSkillProgress {
  id: string;
  user_id: string;
  skill_slug: string;
  skill_name: string;
  progression_level: string;
  assessment_status: SkillAssessmentStatus;
  notes: string | null;
  updated_at: string;
}

export interface SkillItem {
  slug: string;
  name: string;
  description: string;
  targetMuscles: string[];
  progression_level: string;
  assessment_status: SkillAssessmentStatus;
  illustrationAsset: string;
  equipment_required?: SkillEquipmentRequirement;
  last_practiced_at?: string | null;
}
