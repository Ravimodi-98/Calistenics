import { supabase } from '@/services/supabase/client';
import {
  SkillCatalogItem,
  SkillProgressionStage,
  UserSkillProgressRecord,
  SkillPracticeSession,
  SkillAssessmentStatus,
} from '@/domain/models/skill.model';
import {
  recordSkillPracticeSchema,
  RecordSkillPracticeInput,
} from '@/domain/schemas/skill.schema';
import { FALLBACK_SKILL_CATALOG, FALLBACK_SKILL_PROGRESSIONS } from './fallbackSkillsData';
import { isEquipmentAvailable } from '@/domain/utils/equipment';

export class SkillService {
  /**
   * Fetch all published skills, optionally filtering by user equipment.
   */
  async getSkillCatalog(allowedEquipment?: string[]): Promise<SkillCatalogItem[]> {
    try {
      let query = supabase
        .from('skill_catalog')
        .select('*')
        .eq('content_status', 'published')
        .order('name', { ascending: true });

      const { data, error } = await query;

      if (error || !data || data.length === 0) {
        return this.filterByEquipment(FALLBACK_SKILL_CATALOG, allowedEquipment);
      }

      return this.filterByEquipment(data as SkillCatalogItem[], allowedEquipment);
    } catch {
      return this.filterByEquipment(FALLBACK_SKILL_CATALOG, allowedEquipment);
    }
  }

  /**
   * Fetch details for a single skill by slug.
   */
  async getSkillBySlug(slug: string): Promise<SkillCatalogItem | null> {
    try {
      const { data, error } = await supabase
        .from('skill_catalog')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (error || !data) {
        return FALLBACK_SKILL_CATALOG.find((s) => s.slug === slug) || null;
      }

      return data as SkillCatalogItem;
    } catch {
      return FALLBACK_SKILL_CATALOG.find((s) => s.slug === slug) || null;
    }
  }

  /**
   * Fetch the 6-stage progression pathway for a skill.
   */
  async getSkillPathway(skillSlug: string): Promise<SkillProgressionStage[]> {
    try {
      const { data, error } = await supabase
        .from('skill_progressions')
        .select('*')
        .eq('skill_slug', skillSlug)
        .order('stage_order', { ascending: true });

      if (error || !data || data.length === 0) {
        return FALLBACK_SKILL_PROGRESSIONS.filter((p) => p.skill_slug === skillSlug);
      }

      return data as SkillProgressionStage[];
    } catch {
      return FALLBACK_SKILL_PROGRESSIONS.filter((p) => p.skill_slug === skillSlug);
    }
  }

  /**
   * Fetch user's current progress on a specific skill.
   */
  async getUserSkillProgress(
    userId: string,
    skillSlug: string
  ): Promise<UserSkillProgressRecord | null> {
    try {
      const { data, error } = await supabase
        .from('user_skill_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('skill_slug', skillSlug)
        .maybeSingle();

      if (error || !data) {
        return null;
      }

      return data as UserSkillProgressRecord;
    } catch {
      return null;
    }
  }

  /**
   * Fetch user's progress records across all skills.
   */
  async getAllUserSkillProgress(userId: string): Promise<UserSkillProgressRecord[]> {
    try {
      const { data, error } = await supabase
        .from('user_skill_progress')
        .select('*')
        .eq('user_id', userId);

      if (error || !data) {
        return [];
      }

      return data as UserSkillProgressRecord[];
    } catch {
      return [];
    }
  }

  /**
   * Fetch practice history sessions for a skill.
   */
  async getSkillHistory(
    userId: string,
    skillSlug?: string
  ): Promise<SkillPracticeSession[]> {
    try {
      let query = supabase
        .from('skill_practice_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (skillSlug) {
        query = query.eq('skill_slug', skillSlug);
      }

      const { data, error } = await query;

      if (error || !data) {
        return [];
      }

      return data as SkillPracticeSession[];
    } catch {
      return [];
    }
  }

  /**
   * Record a skill practice session and update user's ongoing progress.
   */
  async recordSkillPractice(
    userId: string,
    input: RecordSkillPracticeInput
  ): Promise<{ session: SkillPracticeSession; progress: UserSkillProgressRecord }> {
    const validated = recordSkillPracticeSchema.parse(input);

    const now = new Date().toISOString();

    // 1. Insert practice session
    const sessionPayload = {
      user_id: userId,
      skill_slug: validated.skill_slug,
      stage_slug: validated.stage_slug,
      duration_seconds: validated.duration_seconds,
      completed_sets: validated.completed_sets,
      recorded_hold_seconds: validated.recorded_hold_seconds,
      recorded_reps: validated.recorded_reps,
      effort_rating: validated.effort_rating || null,
      notes: validated.notes || null,
      created_at: now,
    };

    let savedSession: SkillPracticeSession;

    try {
      const { data, error } = await supabase
        .from('skill_practice_sessions')
        .insert(sessionPayload)
        .select('*')
        .single();

      if (error || !data) {
        savedSession = { id: `local-${Date.now()}`, ...sessionPayload };
      } else {
        savedSession = data as SkillPracticeSession;
      }
    } catch {
      savedSession = { id: `local-${Date.now()}`, ...sessionPayload };
    }

    // 2. Fetch existing progress record to update metrics
    const existingProgress = await this.getUserSkillProgress(userId, validated.skill_slug);

    const bestHold = Math.max(
      existingProgress?.best_hold_seconds || 0,
      validated.recorded_hold_seconds
    );
    const bestReps = Math.max(
      existingProgress?.best_reps || 0,
      validated.recorded_reps
    );

    // Derive stage order
    const pathway = await this.getSkillPathway(validated.skill_slug);
    const activeStage = pathway.find((s) => s.stage_slug === validated.stage_slug);
    const stageOrder = activeStage?.stage_order || 1;

    let derivedStatus: SkillAssessmentStatus = 'practicing';
    if (activeStage) {
      const targetVal = activeStage.target_value;
      const metric = activeStage.target_type === 'hold_seconds' ? bestHold : bestReps;
      if (metric >= targetVal) {
        derivedStatus = stageOrder === pathway.length ? 'completed' : 'ready_for_assessment';
      }
    }

    const skill = await this.getSkillBySlug(validated.skill_slug);
    const skillName = skill?.name || validated.skill_slug.replace(/-/g, ' ');

    const progressPayload = {
      user_id: userId,
      skill_slug: validated.skill_slug,
      skill_name: skillName,
      progression_level: activeStage?.stage_name || 'Stage 1',
      current_stage_order: stageOrder,
      assessment_status: derivedStatus,
      best_hold_seconds: bestHold,
      best_reps: bestReps,
      last_practiced_at: now,
      notes: validated.notes || existingProgress?.notes || null,
      updated_at: now,
    };

    let updatedProgress: UserSkillProgressRecord;

    try {
      const { data, error } = await supabase
        .from('user_skill_progress')
        .upsert(progressPayload, { onConflict: 'user_id,skill_slug' })
        .select('*')
        .single();

      if (error || !data) {
        updatedProgress = { id: existingProgress?.id || `prog-${Date.now()}`, ...progressPayload };
      } else {
        updatedProgress = data as UserSkillProgressRecord;
      }
    } catch {
      updatedProgress = { id: existingProgress?.id || `prog-${Date.now()}`, ...progressPayload };
    }

    return {
      session: savedSession,
      progress: updatedProgress,
    };
  }

  /**
   * Filter skills list by allowed equipment.
   */
  private filterByEquipment(
    skills: SkillCatalogItem[],
    allowedEquipment?: string[]
  ): SkillCatalogItem[] {
    if (allowedEquipment === undefined) {
      return skills;
    }

    return skills.filter((s) => isEquipmentAvailable(allowedEquipment, s.equipment_required));
  }
}

export const skillService = new SkillService();
