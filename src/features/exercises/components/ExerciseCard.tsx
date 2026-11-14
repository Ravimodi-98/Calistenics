import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { colors, radii, spacing } from '@/theme';
import { AppText } from '@/components/ui/AppText';
import { AnimatedCard } from '@/components/cards/AnimatedCard';
import { Exercise } from '@/domain/models/exercise.model';
import { ExerciseAnimation } from '@/animations/components/ExerciseAnimation';

interface ExerciseCardProps {
  exercise: Exercise;
  index?: number;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, index = 0 }) => {
  const [expanded, setExpanded] = useState(false);

  const isNoEquipment = exercise.equipment_required === 'none';

  return (
    <AnimatedCard
      variant={isNoEquipment ? 'default' : 'outlined'}
      style={styles.card}
      delay={index * 40}
      testID={`exercise-card-${exercise.slug}`}
    >
      {/* Top Header Row with Badges */}
      <View style={styles.badgeRow}>
        <View
          style={[
            styles.equipmentBadge,
            isNoEquipment ? styles.noEquipmentBadge : styles.pullUpBarBadge,
          ]}
          testID={`equipment-badge-${exercise.equipment_required}`}
        >
          <AppText
            variant="caption"
            color={isNoEquipment ? colors.primaryDeep : '#4B382A'}
            style={styles.badgeText}
          >
            {isNoEquipment ? 'Zero Equipment' : 'Pull-up Bar Required'}
          </AppText>
        </View>

        <View style={styles.difficultyBadge}>
          <AppText variant="caption" color={colors.textSecondary} style={styles.badgeText}>
            {exercise.difficulty.toUpperCase()}
          </AppText>
        </View>

        <View style={styles.categoryBadge}>
          <AppText variant="caption" color={colors.textSecondary} style={styles.badgeText}>
            {exercise.category.replace('_', ' ').toUpperCase()}
          </AppText>
        </View>
      </View>

      {/* Exercise Name and Description */}
      <AppText variant="h2" color={colors.text} style={styles.name}>
        {exercise.name}
      </AppText>
      <AppText variant="body" color={colors.textSecondary} style={styles.description}>
        {exercise.description}
      </AppText>

      {/* Target Muscle Tags */}
      <View style={styles.musclesRow}>
        {exercise.primary_muscles.map((muscle) => (
          <View key={muscle} style={styles.muscleTag}>
            <AppText variant="caption" color={colors.primaryDeep} style={styles.muscleText}>
              {muscle.replace('_', ' ')}
            </AppText>
          </View>
        ))}
      </View>

      {/* Honest Disclaimer for Floor Pulling Exercises */}
      {exercise.disclaimer && (
        <View style={styles.disclaimerBox} testID="exercise-disclaimer-box">
          <AppText variant="caption" color={colors.text} style={styles.disclaimerText}>
            {exercise.disclaimer}
          </AppText>
        </View>
      )}

      {/* Expand / Collapse Button */}
      <Pressable
        style={styles.expandButton}
        onPress={() => setExpanded(!expanded)}
        testID={`toggle-technique-${exercise.slug}`}
      >
        <AppText variant="caption" color={colors.primary} style={styles.expandText}>
          {expanded ? 'Hide Technique Cues' : 'View Technique Cues & Safety'}
        </AppText>
      </Pressable>

      {/* Expanded Technique Steps & Safety Notes */}
      {expanded && (
        <View style={styles.expandedContent} testID={`technique-details-${exercise.slug}`}>
          {/* 2D Vector Animation Demonstration */}
          <View style={styles.animationPreviewContainer} testID={`animation-preview-${exercise.slug}`}>
            <ExerciseAnimation
              slug={exercise.slug}
              exerciseName={exercise.name}
              height={180}
            />
          </View>

          <AppText variant="caption" color={colors.textSecondary} style={styles.sectionHeading}>
            TECHNIQUE STEPS
          </AppText>
          {exercise.instructions.map((step) => (
            <View key={step.step} style={styles.stepRow}>
              <View style={styles.stepNumber}>
                <AppText variant="caption" color="#FFFFFF" style={styles.stepNumberText}>
                  {step.step}
                </AppText>
              </View>
              <View style={styles.stepTextContainer}>
                <AppText variant="body" color={colors.text} style={styles.stepTitle}>
                  {step.title}
                </AppText>
                <AppText variant="body" color={colors.textSecondary} style={styles.stepCue}>
                  {step.cue}
                </AppText>
              </View>
            </View>
          ))}

          {exercise.safety_notes && (
            <View style={styles.safetyBox}>
              <AppText variant="caption" color={colors.textSecondary} style={styles.safetyHeading}>
                SAFETY NOTE
              </AppText>
              <AppText variant="body" color={colors.text} style={styles.safetyText}>
                {exercise.safety_notes}
              </AppText>
            </View>
          )}

          {exercise.progression_exercises.length > 0 && (
            <View style={styles.progressionRow}>
              <AppText variant="caption" color={colors.textSecondary}>
                Next Progressions:{' '}
                <AppText variant="caption" color={colors.primaryDeep} style={styles.progressionList}>
                  {exercise.progression_exercises.join(', ')}
                </AppText>
              </AppText>
            </View>
          )}
        </View>
      )}
    </AnimatedCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.sm,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
    flexWrap: 'wrap',
  },
  equipmentBadge: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radii.full,
  },
  noEquipmentBadge: {
    backgroundColor: colors.primaryLavender, // Lavender
  },
  pullUpBarBadge: {
    backgroundColor: '#FBEED6', // Warm orange tint
  },
  difficultyBadge: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radii.full,
  },
  categoryBadge: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radii.full,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  name: {
    marginBottom: 4,
  },
  description: {
    lineHeight: 19,
    marginBottom: spacing.xs,
  },
  musclesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: spacing.xs,
  },
  muscleTag: {
    backgroundColor: '#FAF8FE',
    borderWidth: 1,
    borderColor: colors.primaryLavender,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radii.sm,
  },
  muscleText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  disclaimerBox: {
    backgroundColor: '#FFF7ED',
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
    padding: spacing.xs,
    borderRadius: radii.sm,
    marginBottom: spacing.xs,
  },
  disclaimerText: {
    fontSize: 11,
    lineHeight: 15,
    color: '#7C2D12',
  },
  expandButton: {
    paddingVertical: spacing.xxs,
    marginTop: spacing.xxs,
  },
  expandText: {
    fontWeight: '700',
  },
  expandedContent: {
    marginTop: spacing.sm,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  animationPreviewContainer: {
    marginBottom: spacing.sm,
    borderRadius: radii.card,
    overflow: 'hidden',
  },
  sectionHeading: {
    fontWeight: '700',
    fontSize: 10,
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
    gap: spacing.xs,
  },
  stepNumber: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  stepNumberText: {
    fontWeight: '800',
    fontSize: 10,
  },
  stepTextContainer: {
    flex: 1,
  },
  stepTitle: {
    fontWeight: '700',
    fontSize: 13,
  },
  stepCue: {
    fontSize: 12,
    lineHeight: 16,
  },
  safetyBox: {
    backgroundColor: colors.background,
    padding: spacing.xs,
    borderRadius: radii.sm,
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },
  safetyHeading: {
    fontWeight: '700',
    fontSize: 9,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  safetyText: {
    fontSize: 12,
    lineHeight: 16,
  },
  progressionRow: {
    marginTop: spacing.xxs,
  },
  progressionList: {
    fontWeight: '600',
  },
});
