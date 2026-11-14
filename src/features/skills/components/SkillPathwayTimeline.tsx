import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import {
  CheckCircle2,
  Lock,
  ChevronDown,
  ChevronUp,
  Play,
  Award,
} from 'lucide-react-native';
import { colors, radii, spacing } from '@/theme';
import { AppText } from '@/components/ui/AppText';
import {
  SkillProgressionStage,
  UserSkillProgressRecord,
  SkillPracticeSession,
  SkillAssessmentStatus,
} from '@/domain/models/skill.model';
import { progressionReadinessEngine } from '../services/progressionReadinessEngine';

interface SkillPathwayTimelineProps {
  pathway: SkillProgressionStage[];
  userProgress: UserSkillProgressRecord | null;
  practiceSessions: SkillPracticeSession[];
  onSelectStage: (stage: SkillProgressionStage) => void;
  activeStageSlug?: string;
}

export const SkillPathwayTimeline: React.FC<SkillPathwayTimelineProps> = ({
  pathway,
  userProgress,
  practiceSessions,
  onSelectStage,
  activeStageSlug,
}) => {
  const [expandedStageSlug, setExpandedStageSlug] = useState<string | null>(activeStageSlug || null);

  const toggleExpand = (slug: string) => {
    setExpandedStageSlug((prev) => (prev === slug ? null : slug));
  };

  const getStatusBadge = (status: SkillAssessmentStatus) => {
    switch (status) {
      case 'completed':
        return { label: 'Completed', bg: colors.successMuted, text: colors.success };
      case 'ready_for_assessment':
        return { label: 'Ready for Assessment', bg: colors.accentMuted, text: '#8A5812' };
      case 'practicing':
        return { label: 'Practicing', bg: colors.primaryLavender, text: colors.primaryDeep };
      case 'learning':
        return { label: 'Learning Mechanics', bg: '#EDE9FA', text: colors.primaryDeep };
      default:
        return { label: 'Not Started', bg: colors.background, text: colors.textSecondary };
    }
  };

  return (
    <View style={styles.container} testID="skill-pathway-timeline">
      <View style={styles.timelineHeader}>
        <AppText variant="h2" color={colors.text}>
          Progression Pathway
        </AppText>
        <AppText variant="caption" color={colors.textSecondary}>
          {pathway.length} Sequential Stages
        </AppText>
      </View>

      {pathway.map((stage, index) => {
        const evaluation = progressionReadinessEngine.evaluateStageReadiness(
          stage,
          pathway,
          userProgress,
          practiceSessions
        );

        const statusStyle = getStatusBadge(evaluation.currentStatus);
        const isExpanded = expandedStageSlug === stage.stage_slug;
        const isLast = index === pathway.length - 1;
        const isLocked = !evaluation.prerequisitesMet;

        return (
          <View key={stage.stage_slug} style={styles.stageRow} testID={`pathway-stage-${stage.stage_slug}`}>
            {/* Left Timeline Connector */}
            <View style={styles.connectorColumn}>
              <View
                style={[
                  styles.nodeCircle,
                  evaluation.currentStatus === 'completed' && styles.nodeCompleted,
                  evaluation.currentStatus === 'ready_for_assessment' && styles.nodeReady,
                  isLocked && styles.nodeLocked,
                ]}
              >
                {evaluation.currentStatus === 'completed' ? (
                  <CheckCircle2 size={16} color="#FFFFFF" />
                ) : isLocked ? (
                  <Lock size={12} color={colors.textSecondary} />
                ) : (
                  <AppText
                    variant="caption"
                    color={evaluation.currentStatus === 'ready_for_assessment' ? '#FFFFFF' : colors.primaryDeep}
                    style={styles.nodeText}
                  >
                    {stage.stage_order}
                  </AppText>
                )}
              </View>
              {!isLast && <View style={styles.verticalLine} />}
            </View>

            {/* Stage Card */}
            <View style={styles.cardContainer}>
              <Pressable
                onPress={() => toggleExpand(stage.stage_slug)}
                style={({ pressed }) => [
                  styles.card,
                  isExpanded && styles.cardExpanded,
                  pressed && styles.cardPressed,
                ]}
                testID={`stage-card-${stage.stage_slug}`}
              >
                {/* Header Row */}
                <View style={styles.cardHeader}>
                  <View style={styles.titleColumn}>
                    <View style={styles.tagRow}>
                      <AppText variant="caption" color={colors.textSecondary} style={styles.stageOrderTag}>
                        STAGE {stage.stage_order}
                      </AppText>
                      <View style={[styles.statusPill, { backgroundColor: statusStyle.bg }]}>
                        <AppText variant="caption" color={statusStyle.text} style={styles.statusText}>
                          {statusStyle.label}
                        </AppText>
                      </View>
                    </View>
                    <AppText variant="h3" color={colors.text} style={styles.stageName}>
                      {stage.stage_name}
                    </AppText>
                  </View>

                  <View style={styles.headerRight}>
                    <View style={styles.targetPill}>
                      <AppText variant="caption" color={colors.primaryDeep} style={styles.targetText}>
                        {stage.target_value} {stage.target_type === 'hold_seconds' ? 'Sec' : 'Reps'}
                      </AppText>
                    </View>
                    {isExpanded ? (
                      <ChevronUp size={16} color={colors.textSecondary} />
                    ) : (
                      <ChevronDown size={16} color={colors.textSecondary} />
                    )}
                  </View>
                </View>

                {/* Short Description */}
                <AppText variant="body" color={colors.textSecondary} style={styles.description}>
                  {stage.description}
                </AppText>

                {/* Prerequisite Warning if locked */}
                {isLocked && evaluation.missingPrerequisites.length > 0 && (
                  <View style={styles.prereqBox}>
                    <Lock size={12} color="#8A5812" />
                    <AppText variant="caption" color="#8A5812" style={styles.prereqText}>
                      {evaluation.missingPrerequisites[0]}
                    </AppText>
                  </View>
                )}

                {/* Expanded Details: Technique Cues & Assessment Criteria */}
                {isExpanded && (
                  <View style={styles.expandedDetails} testID={`stage-details-${stage.stage_slug}`}>
                    <View style={styles.divider} />

                    {/* Technique Cues */}
                    <AppText variant="caption" color={colors.textSecondary} style={styles.sectionTitle}>
                      TECHNIQUE CUES
                    </AppText>
                    {stage.technique_cues.map((cue, idx) => (
                      <View key={idx} style={styles.cueRow}>
                        <View style={styles.bulletDot} />
                        <AppText variant="body" color={colors.text} style={styles.cueText}>
                          {cue}
                        </AppText>
                      </View>
                    ))}

                    {/* Assessment Criteria */}
                    <View style={styles.criteriaBox}>
                      <View style={styles.criteriaHeader}>
                        <Award size={14} color={colors.primaryDeep} />
                        <AppText variant="caption" color={colors.primaryDeep} style={styles.criteriaLabel}>
                          ASSESSMENT CRITERIA
                        </AppText>
                      </View>
                      <AppText variant="body" color={colors.text} style={styles.criteriaText}>
                        {stage.assessment_criteria}
                      </AppText>
                    </View>

                    {/* Recommendation Message */}
                    <AppText variant="caption" color={colors.textSecondary} style={styles.recommendationText}>
                      💡 {evaluation.recommendationMessage}
                    </AppText>

                    {/* Practice Stage CTA Button */}
                    <Pressable
                      style={({ pressed }) => [
                        styles.practiceButton,
                        pressed && styles.practiceButtonPressed,
                      ]}
                      onPress={() => onSelectStage(stage)}
                      testID={`practice-stage-btn-${stage.stage_slug}`}
                    >
                      <Play size={14} color="#FFFFFF" fill="#FFFFFF" />
                      <AppText variant="button" color="#FFFFFF" style={styles.practiceButtonText}>
                        Practice Stage {stage.stage_order}
                      </AppText>
                    </Pressable>
                  </View>
                )}
              </Pressable>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.sm,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  stageRow: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  connectorColumn: {
    width: 32,
    alignItems: 'center',
  },
  nodeCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.primaryLavender,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
    zIndex: 2,
  },
  nodeCompleted: {
    backgroundColor: colors.success,
  },
  nodeReady: {
    backgroundColor: colors.accent,
  },
  nodeLocked: {
    backgroundColor: colors.surfaceSecondary,
  },
  nodeText: {
    fontWeight: '800',
    fontSize: 11,
  },
  verticalLine: {
    flex: 1,
    width: 2,
    backgroundColor: colors.border,
    marginVertical: 2,
  },
  cardContainer: {
    flex: 1,
    paddingLeft: spacing.xs,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardExpanded: {
    borderColor: colors.primary,
    backgroundColor: '#FAF9FE',
  },
  cardPressed: {
    backgroundColor: colors.primaryMuted,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  titleColumn: {
    flex: 1,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: 4,
  },
  stageOrderTag: {
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radii.full,
  },
  statusText: {
    fontWeight: '700',
    fontSize: 9,
  },
  stageName: {
    fontWeight: '700',
  },
  headerRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  targetPill: {
    backgroundColor: '#EDE9FA',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radii.full,
  },
  targetText: {
    fontWeight: '700',
    fontSize: 10,
  },
  description: {
    fontSize: 12,
    lineHeight: 16,
  },
  prereqBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.accentMuted,
    padding: spacing.xs,
    borderRadius: radii.sm,
    marginTop: spacing.xs,
  },
  prereqText: {
    fontSize: 10,
    fontWeight: '600',
    flex: 1,
  },
  expandedDetails: {
    marginTop: spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
  },
  sectionTitle: {
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  cueRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginBottom: 4,
  },
  bulletDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
    marginTop: 6,
  },
  cueText: {
    fontSize: 12,
    lineHeight: 16,
    flex: 1,
  },
  criteriaBox: {
    backgroundColor: '#F3F0FA',
    padding: spacing.sm,
    borderRadius: radii.sm,
    marginVertical: spacing.xs,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  criteriaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  criteriaLabel: {
    fontWeight: '800',
    fontSize: 10,
  },
  criteriaText: {
    fontSize: 12,
    lineHeight: 16,
  },
  recommendationText: {
    fontSize: 11,
    fontStyle: 'italic',
    marginVertical: spacing.xs,
  },
  practiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    borderRadius: radii.button,
    marginTop: spacing.xs,
  },
  practiceButtonPressed: {
    backgroundColor: colors.primaryDeep,
  },
  practiceButtonText: {
    fontSize: 13,
  },
});
