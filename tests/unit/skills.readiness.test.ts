import { progressionReadinessEngine } from '../../src/features/skills/services/progressionReadinessEngine';
import {
  SkillProgressionStage,
  SkillPracticeSession,
} from '../../src/domain/models/skill.model';

describe('ProgressionReadinessEngine & Honest Advancement Logic', () => {
  const mockStage1: SkillProgressionStage = {
    id: 'stage-1',
    skill_id: 'skill-handstand',
    skill_slug: 'handstand',
    stage_order: 1,
    stage_name: 'Wrist Prep & Scapular Elevation',
    stage_slug: 'wrist-prep-scapular-elevation',
    description: 'Establish foundational wrist flexibility and scapular protraction/elevation.',
    prerequisites: [],
    target_type: 'hold_seconds',
    target_value: 45,
    technique_cues: ['Press the floor away', 'Fingers spread wide'],
    safety_notes: 'Stop immediately if wrist pain occurs.',
    animation_asset: 'handstand-chest-wall',
    assessment_criteria: 'Hold 45 seconds clean without scapular collapse.',
  };

  const mockStage2: SkillProgressionStage = {
    id: 'stage-2',
    skill_id: 'skill-handstand',
    skill_slug: 'handstand',
    stage_order: 2,
    stage_name: 'Chest-to-Wall Handstand',
    stage_slug: 'chest-to-wall-handstand',
    description: 'Develop overhead alignment and endurance against a wall.',
    prerequisites: ['wrist-prep-scapular-elevation'],
    target_type: 'hold_seconds',
    target_value: 30,
    technique_cues: ['Look between thumbs', 'Glutes tight', 'Toes pointed'],
    safety_notes: 'Maintain hollow body; avoid hyper-extending the lumbar spine.',
    animation_asset: 'handstand-chest-wall',
    assessment_criteria: 'Hold 30 seconds chest-to-wall within 5 inches of wall.',
  };

  const mockStage6: SkillProgressionStage = {
    id: 'stage-6',
    skill_id: 'skill-handstand',
    skill_slug: 'handstand',
    stage_order: 6,
    stage_name: 'Freestanding Handstand',
    stage_slug: 'freestanding-handstand',
    description: 'Full balance and control without support.',
    prerequisites: ['toe-pulls-heel-pulls'],
    target_type: 'hold_seconds',
    target_value: 20,
    technique_cues: ['Micro-adjust with fingertips', 'Hollow body tension'],
    safety_notes: 'Learn pirouette bail before practicing freestanding in open space.',
    animation_asset: 'handstand-chest-wall',
    assessment_criteria: 'Hold 20 seconds completely freestanding with clean exit.',
  };

  const allStages = [mockStage1, mockStage2, mockStage6];

  describe('Prerequisite Checks', () => {
    it('grants readiness for stage 1 with no prerequisites', () => {
      const evaluation = progressionReadinessEngine.evaluateStageReadiness(
        mockStage1,
        allStages,
        null,
        []
      );

      expect(evaluation.prerequisitesMet).toBe(true);
      expect(evaluation.missingPrerequisites).toEqual([]);
      expect(evaluation.currentStatus).toBe('not_started');
      expect(evaluation.criteriaMet).toBe(false);
    });

    it('blocks advancement for stage 2 if stage 1 prerequisite is not met', () => {
      const evaluation = progressionReadinessEngine.evaluateStageReadiness(
        mockStage2,
        allStages,
        null,
        []
      );

      expect(evaluation.prerequisitesMet).toBe(false);
      expect(evaluation.missingPrerequisites.length).toBeGreaterThan(0);
      expect(evaluation.missingPrerequisites[0]).toContain('Wrist Prep & Scapular Elevation');
      expect(evaluation.recommendationMessage).toContain('Foundational prerequisite needed');
    });

    it('satisfies prerequisites when prior stage target has been met in practice sessions', () => {
      const stage1Sessions: SkillPracticeSession[] = [
        {
          id: 's1',
          user_id: 'u1',
          skill_slug: 'handstand',
          stage_slug: 'wrist-prep-scapular-elevation',
          duration_seconds: 120,
          completed_sets: 3,
          recorded_hold_seconds: 50, // exceeds target of 45
          recorded_reps: 0,
          effort_rating: 3,
          notes: null,
          created_at: new Date().toISOString(),
        },
      ];

      const evaluation = progressionReadinessEngine.evaluateStageReadiness(
        mockStage2,
        allStages,
        null,
        stage1Sessions
      );

      expect(evaluation.prerequisitesMet).toBe(true);
      expect(evaluation.missingPrerequisites).toEqual([]);
    });
  });

  describe('Target Metrics & Status Transitions', () => {
    it('sets status to "learning" when user has practiced 1-2 sessions but not met target', () => {
      const sessions: SkillPracticeSession[] = [
        {
          id: 's1',
          user_id: 'u1',
          skill_slug: 'handstand',
          stage_slug: 'wrist-prep-scapular-elevation',
          duration_seconds: 120,
          completed_sets: 2,
          recorded_hold_seconds: 25,
          recorded_reps: 0,
          effort_rating: 4,
          notes: null,
          created_at: new Date().toISOString(),
        },
      ];

      const evaluation = progressionReadinessEngine.evaluateStageReadiness(
        mockStage1,
        allStages,
        null,
        sessions
      );

      expect(evaluation.currentStatus).toBe('learning');
      expect(evaluation.criteriaMet).toBe(false);
      expect(evaluation.recommendationMessage).toContain('Learning stage mechanics');
    });

    it('sets status to "practicing" when user has 3+ sessions but target is not yet met', () => {
      const sessions: SkillPracticeSession[] = [1, 2, 3].map((i) => ({
        id: `s${i}`,
        user_id: 'u1',
        skill_slug: 'handstand',
        stage_slug: 'wrist-prep-scapular-elevation',
        duration_seconds: 120,
        completed_sets: 3,
        recorded_hold_seconds: 35, // target is 45
        recorded_reps: 0,
        effort_rating: 4,
        notes: null,
        created_at: new Date().toISOString(),
      }));

      const evaluation = progressionReadinessEngine.evaluateStageReadiness(
        mockStage1,
        allStages,
        null,
        sessions
      );

      expect(evaluation.currentStatus).toBe('practicing');
      expect(evaluation.criteriaMet).toBe(false);
      expect(evaluation.recommendationMessage).toContain('Practicing consistently');
    });

    it('marks stage as "ready_for_assessment" when target hold is achieved and prereqs are met', () => {
      const sessions: SkillPracticeSession[] = [
        {
          id: 's1',
          user_id: 'u1',
          skill_slug: 'handstand',
          stage_slug: 'wrist-prep-scapular-elevation',
          duration_seconds: 120,
          completed_sets: 3,
          recorded_hold_seconds: 48, // target is 45
          recorded_reps: 0,
          effort_rating: 3,
          notes: null,
          created_at: new Date().toISOString(),
        },
      ];

      const evaluation = progressionReadinessEngine.evaluateStageReadiness(
        mockStage1,
        allStages,
        null,
        sessions
      );

      expect(evaluation.criteriaMet).toBe(true);
      expect(evaluation.prerequisitesMet).toBe(true);
      expect(evaluation.currentStatus).toBe('ready_for_assessment');
      expect(evaluation.recommendationMessage).toContain('Target met');
    });

    it('marks final stage as "completed" upon achieving mastery metric', () => {
      // Prior stage completed
      const priorSession: SkillPracticeSession = {
        id: 'sp',
        user_id: 'u1',
        skill_slug: 'handstand',
        stage_slug: 'chest-to-wall-handstand',
        duration_seconds: 180,
        completed_sets: 3,
        recorded_hold_seconds: 35,
        recorded_reps: 0,
        effort_rating: 3,
        notes: null,
        created_at: new Date().toISOString(),
      };

      const finalStageSession: SkillPracticeSession = {
        id: 'sf',
        user_id: 'u1',
        skill_slug: 'handstand',
        stage_slug: 'freestanding-handstand',
        duration_seconds: 300,
        completed_sets: 5,
        recorded_hold_seconds: 24, // target is 20
        recorded_reps: 0,
        effort_rating: 4,
        notes: null,
        created_at: new Date().toISOString(),
      };

      const evaluation = progressionReadinessEngine.evaluateStageReadiness(
        mockStage6,
        allStages,
        null,
        [priorSession, finalStageSession]
      );

      expect(evaluation.criteriaMet).toBe(true);
      expect(evaluation.currentStatus).toBe('completed');
      expect(evaluation.recommendationMessage).toContain('Skill milestone achieved');
    });
  });

  describe('Equipment Verification Rules', () => {
    it('validates no equipment skills are accessible to everyone', () => {
      const check = progressionReadinessEngine.isEquipmentAvailable('none', ['none']);
      expect(check.allowed).toBe(true);
      expect(check.reason).toBeUndefined();
    });

    it('rejects pull-up bar skills if user only has "none"', () => {
      const check = progressionReadinessEngine.isEquipmentAvailable('pull_up_bar', ['none']);
      expect(check.allowed).toBe(false);
      expect(check.reason).toContain('requires a secure Pull-up Bar');
    });

    it('allows pull-up bar skills if user selected "pull_up_bar"', () => {
      const check = progressionReadinessEngine.isEquipmentAvailable('pull_up_bar', [
        'none',
        'pull_up_bar',
      ]);
      expect(check.allowed).toBe(true);
      expect(check.reason).toBeUndefined();
    });

    it('strictly forbids human flag unless vertical_support or stall_bars is available', () => {
      const checkWithBar = progressionReadinessEngine.isEquipmentAvailable('vertical_support', [
        'none',
        'pull_up_bar',
      ]);
      expect(checkWithBar.allowed).toBe(false);
      expect(checkWithBar.reason).toContain('Human Flag requires a securely anchored vertical pole');

      const checkWithPole = progressionReadinessEngine.isEquipmentAvailable('vertical_support', [
        'none',
        'pull_up_bar',
        'vertical_support',
      ]);
      expect(checkWithPole.allowed).toBe(true);
      expect(checkWithPole.reason).toBeUndefined();
    });
  });
});
