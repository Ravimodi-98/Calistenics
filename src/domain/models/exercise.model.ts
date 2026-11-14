export type ExerciseCategory =
  | 'no_equipment'
  | 'push'
  | 'pull'
  | 'legs'
  | 'core'
  | 'skills';

export type ExerciseEquipment = 'none' | 'pull_up_bar';

export type ExerciseDifficulty = 'beginner' | 'intermediate' | 'advanced';

export type ExerciseContentStatus = 'draft' | 'reviewed' | 'published';

export interface ExerciseInstructionStep {
  step: number;
  title: string;
  cue: string;
}

export interface Exercise {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: ExerciseCategory;
  equipment_required: ExerciseEquipment;
  difficulty: ExerciseDifficulty;
  primary_muscles: string[];
  secondary_muscles: string[];
  instructions: ExerciseInstructionStep[];
  prerequisites: string[];
  progression_exercises: string[];
  regressions: string[];
  safety_notes: string | null;
  disclaimer: string | null;
  animation_asset_path: string;
  animation_format: string;
  content_status: ExerciseContentStatus;
  created_at: string;
  updated_at: string;
}

export interface ExerciseFilterOptions {
  category?: ExerciseCategory | 'all';
  equipment?: ExerciseEquipment | 'all';
  difficulty?: ExerciseDifficulty | 'all';
  searchQuery?: string;
}

