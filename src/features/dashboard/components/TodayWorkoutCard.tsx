import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Play, Coffee, Sparkles, Clock, Dumbbell } from 'lucide-react-native';
import { colors, radii, spacing } from '@/theme';
import { AppText } from '@/components/ui/AppText';
import { AppButton } from '@/components/ui/AppButton';
import { WorkoutRecommendation } from '@/domain/models/workout.model';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface TodayWorkoutCardProps {
  workout: WorkoutRecommendation;
  onStartWorkout?: () => void;
  onViewExercises?: () => void;
}

export const TodayWorkoutCard: React.FC<TodayWorkoutCardProps> = ({
  workout,
  onStartWorkout,
  onViewExercises,
}) => {
  const isReducedMotion = useReducedMotion();

  // If today is a rest/recovery day:
  if (workout.isRestDay) {
    return (
      <Animated.View
        style={[styles.card, styles.recoveryCard]}
        entering={isReducedMotion ? undefined : FadeInDown.delay(180).duration(400)}
        testID="recovery-day-card"
      >
        <View style={styles.badgeRow}>
          <View style={styles.recoveryBadge}>
            <Coffee size={13} color={colors.primaryDeep} />
            <AppText variant="caption" color={colors.primaryDeep} style={styles.badgeText}>
              RECOVERY DAY
            </AppText>
          </View>
        </View>

        <AppText variant="h2" color={colors.text} style={styles.title}>
          Today is your recovery day
        </AppText>

        <AppText variant="body" color={colors.textSecondary} style={styles.desc}>
          {workout.focusNotes}
        </AppText>

        {workout.mobilitySuggestion && (
          <View style={styles.mobilityBox} testID="mobility-suggestion-box">
            <View style={styles.mobilityHeader}>
              <Sparkles size={14} color="#8A5D10" />
              <AppText variant="caption" color="#5C3E0A" style={styles.mobilityTitle}>
                OPTIONAL MOBILITY • {workout.mobilitySuggestion.durationMinutes} MIN
              </AppText>
            </View>
            <AppText variant="body" color="#5C3E0A" style={styles.mobilityText}>
              {workout.mobilitySuggestion.title}: {workout.mobilitySuggestion.description}
            </AppText>
          </View>
        )}
      </Animated.View>
    );
  }

  // Active Training Day:
  return (
    <Animated.View
      style={[styles.card, styles.activeCard]}
      entering={isReducedMotion ? undefined : FadeInDown.delay(180).duration(400)}
      testID="today-workout-card"
    >
      {/* Top Tag Row */}
      <View style={styles.badgeRow}>
        <View style={styles.primaryBadge}>
          <AppText variant="caption" color="#FFFFFF" style={styles.badgeText}>
            TODAY'S WORKOUT
          </AppText>
        </View>
        <View style={styles.subBadge}>
          <AppText variant="caption" color={colors.primaryDeep} style={styles.badgeText}>
            {workout.difficulty.toUpperCase()}
          </AppText>
        </View>
        <View style={styles.metaRow}>
          <Clock size={13} color={colors.textSecondary} />
          <AppText variant="caption" color={colors.textSecondary}>
            {workout.estimatedDurationMinutes} min
          </AppText>
        </View>
        <View style={styles.metaRow}>
          <Dumbbell size={13} color={colors.textSecondary} />
          <AppText variant="caption" color={colors.textSecondary}>
            {workout.exerciseCount} moves
          </AppText>
        </View>
      </View>

      {/* Title & Focus Notes */}
      <AppText variant="h2" color={colors.text} style={styles.title}>
        {workout.title}
      </AppText>
      <AppText variant="body" color={colors.textSecondary} style={styles.desc}>
        {workout.focusNotes}
      </AppText>

      {/* Exercise Preview List */}
      {workout.exercises.length > 0 && (
        <View style={styles.exerciseChipsRow} testID="today-exercise-chips">
          {workout.exercises.map((ex) => (
            <View key={ex.id} style={styles.exerciseChip}>
              <AppText variant="caption" color={colors.primaryDeep} style={styles.exerciseChipText}>
                {ex.name}
              </AppText>
            </View>
          ))}
        </View>
      )}

      {/* Action Row */}
      <View style={styles.buttonRow}>
        <AppButton
          title="Start Workout"
          onPress={onStartWorkout || (() => {})}
          icon={<Play size={16} color={colors.textInverse} fill={colors.textInverse} />}
          variant="primary"
          size="md"
          style={styles.startButton}
          testID="start-workout-button"
        />
        {onViewExercises && (
          <AppButton
            title="Overview"
            onPress={onViewExercises}
            variant="secondary"
            size="md"
            fullWidth={false}
            testID="view-exercises-button"
          />
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  recoveryCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primaryLavender,
    backgroundColor: '#FAF9FE',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
    flexWrap: 'wrap',
  },
  primaryBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radii.full,
  },
  subBadge: {
    backgroundColor: colors.primaryLavender,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radii.full,
  },
  recoveryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primaryLavender,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radii.full,
  },
  badgeText: {
    fontWeight: '700',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  title: {
    marginBottom: 4,
  },
  desc: {
    lineHeight: 19,
    marginBottom: spacing.sm,
  },
  mobilityBox: {
    backgroundColor: '#FFF8EB',
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: radii.sm,
    padding: spacing.xs,
    marginTop: spacing.xs,
  },
  mobilityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  mobilityTitle: {
    fontWeight: '700',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  mobilityText: {
    fontSize: 12,
    lineHeight: 16,
  },
  exerciseChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: spacing.md,
  },
  exerciseChip: {
    backgroundColor: '#FAF8FE',
    borderWidth: 1,
    borderColor: colors.primaryLavender,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.xs,
  },
  exerciseChipText: {
    fontSize: 11,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  startButton: {
    flex: 1,
  },
});

