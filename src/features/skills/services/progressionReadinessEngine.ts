import {
  SkillProgressionStage,
  UserSkillProgressRecord,
  SkillPracticeSession,
  StageReadinessEvaluation,
  SkillAssessmentStatus,
  SkillEquipmentRequirement,
} from '@/domain/models/skill.model';
import { isEquipmentAvailable } from '@/domain/utils/equipment';

export class ProgressionReadinessEngine {
  /**
   * Evaluate readiness and progress status for a specific progression stage.
   *
   * RULES:
   * 1. A stage must NOT unlock merely because a certain number of sessions elapsed.
   * 2. Prerequisites must be satisfied.
   * 3. Target criteria (hold seconds or reps) must be legitimately attained.
   * 4. Never automatically claim mastery without user-recorded capability.
   */
  evaluateStageReadiness(
    stage: SkillProgressionStage,
    allStages: SkillProgressionStage[],
    userProgress: UserSkillProgressRecord | null,
    practiceSessions: SkillPracticeSession[]
  ): StageReadinessEvaluation {
    // 1. Check prerequisite stages
    const missingPrerequisites: string[] = [];
    const stageOrder = stage.stage_order;

    if (stageOrder > 1) {
      // Find previous stage in pathway
      const prevStage = allStages.find((s) => s.stage_order === stageOrder - 1);
      if (prevStage) {
        // Find if user has logged sessions meeting previous stage target
        const prevSessions = practiceSessions.filter((s) => s.stage_slug === prevStage.stage_slug);
        const prevBest = prevSessions.reduce((max, s) => {
          const val = prevStage.target_type === 'hold_seconds' ? s.recorded_hold_seconds : s.recorded_reps;
          return Math.max(max, val);
        }, 0);

        if (prevBest < prevStage.target_value) {
          missingPrerequisites.push(
            `Requires ${prevStage.stage_name} (${prevStage.target_value} ${
              prevStage.target_type === 'hold_seconds' ? 'seconds' : 'reps'
            }). Current best: ${prevBest}.`
          );
        }
      }
    }

    const prerequisitesMet = missingPrerequisites.length === 0;

    // 2. Filter practice sessions for this specific stage
    const stageSessions = practiceSessions.filter((s) => s.stage_slug === stage.stage_slug);
    const totalStageSessions = stageSessions.length;

    const bestPerformance = stageSessions.reduce((max, s) => {
      const val = stage.target_type === 'hold_seconds' ? s.recorded_hold_seconds : s.recorded_reps;
      return Math.max(max, val);
    }, 0);

    const criteriaMet = bestPerformance >= stage.target_value;

    // 3. Derive honest progress status
    let currentStatus: SkillAssessmentStatus = 'not_started';
    let recommendationMessage = '';

    if (!prerequisitesMet) {
      currentStatus = 'not_started';
      recommendationMessage = `Foundational prerequisite needed: ${missingPrerequisites[0]}`;
    } else if (totalStageSessions === 0) {
      currentStatus = 'not_started';
      recommendationMessage = `Ready to begin practice on ${stage.stage_name}. Target: ${stage.target_value} ${
        stage.target_type === 'hold_seconds' ? 'seconds' : 'reps'
      }.`;
    } else if (!criteriaMet && totalStageSessions < 3) {
      currentStatus = 'learning';
      recommendationMessage = `Learning stage mechanics. Best: ${bestPerformance}/${stage.target_value}. Focus on strict technique cues.`;
    } else if (!criteriaMet) {
      currentStatus = 'practicing';
      recommendationMessage = `Practicing consistently (${totalStageSessions} sessions). Best: ${bestPerformance}/${stage.target_value}. Build connective tendon density.`;
    } else {
      // Criteria attained!
      const maxStageOrder = Math.max(...allStages.map((s) => s.stage_order), 1);
      const isFinalStage = stageOrder >= maxStageOrder || stageOrder >= 6;
      if (isFinalStage) {
        currentStatus = 'completed';
        recommendationMessage = `Skill milestone achieved! You recorded ${bestPerformance} ${
          stage.target_type === 'hold_seconds' ? 'seconds' : 'reps'
        }. Maintain consistency.`;
      } else {
        currentStatus = 'ready_for_assessment';
        recommendationMessage = `Target met (${bestPerformance}/${stage.target_value})! Ready to assess and advance to next progression stage.`;
      }
    }

    return {
      isReady: prerequisitesMet,
      currentStatus,
      criteriaMet,
      prerequisitesMet,
      missingPrerequisites,
      recommendationMessage,
      stage,
    };
  }

  /**
   * Determine the current active and next recommended stage in a pathway.
   */
  getNextRecommendedStage(
    pathway: SkillProgressionStage[],
    userProgress: UserSkillProgressRecord | null,
    practiceSessions: SkillPracticeSession[]
  ): SkillProgressionStage {
    if (!pathway || pathway.length === 0) {
      throw new Error('Pathway cannot be empty');
    }

    // Sort by stage_order ascending
    const sorted = [...pathway].sort((a, b) => a.stage_order - b.stage_order);

    for (const stage of sorted) {
      const evaluation = this.evaluateStageReadiness(stage, sorted, userProgress, practiceSessions);
      // The first stage that is not completed or is currently active is our recommended stage
      if (evaluation.currentStatus !== 'completed' && evaluation.currentStatus !== 'ready_for_assessment') {
        return stage;
      }
    }

    // If all completed, return final stage
    return sorted[sorted.length - 1];
  }

  /**
   * Strictly validate equipment availability against skill requirement.
   */
  isEquipmentAvailable(
    requiredEquipment: SkillEquipmentRequirement,
    userEquipmentList: string[] = ['none']
  ): { allowed: boolean; reason?: string } {
    if (requiredEquipment === 'none') {
      return { allowed: true };
    }

    if (requiredEquipment === 'pull_up_bar') {
      const hasBar = isEquipmentAvailable(userEquipmentList, 'pull_up_bar');
      return {
        allowed: hasBar,
        reason: hasBar
          ? undefined
          : 'This skill requires a secure Pull-up Bar. Switch to floor-based skills like Handstand, Planche, or L-Sit, or update your equipment in profile.',
      };
    }

    if (requiredEquipment === 'vertical_support') {
      const hasSupport = userEquipmentList.includes('vertical_support') || userEquipmentList.includes('stall_bars');
      return {
        allowed: hasSupport,
        reason: hasSupport
          ? undefined
          : 'Human Flag requires a securely anchored vertical pole, stall bars, or robust calisthenics upright. Do not attempt on unstable fixtures.',
      };
    }

    return { allowed: true };
  }
}

export const progressionReadinessEngine = new ProgressionReadinessEngine();
