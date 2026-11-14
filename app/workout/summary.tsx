import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { Award, CheckCircle2, Clock, Dumbbell, Sparkles } from 'lucide-react-native';
import { colors, radii, spacing } from '@/theme';
import { AppText } from '@/components/ui/AppText';
import { AppButton } from '@/components/ui/AppButton';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { useWorkoutSessionStore } from '@/features/workouts/store/workoutSessionStore';
import { ExerciseAnimation } from '@/animations/components/ExerciseAnimation';
import { notificationService } from '@/features/notifications/services/notificationService';

// Sample celebratory 2D animation
const sampleAnimationJson = require('@/animations/assets/sample-exercise.json');

export default function WorkoutSummaryScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    workoutTitle,
    workoutCategory,
    exercises,
    elapsedSeconds,
    clearSession,
  } = useWorkoutSessionStore();

  const totalMinutes = Math.max(1, Math.round(elapsedSeconds / 60));

  let totalSets = 0;
  let totalReps = 0;
  let totalHoldSecs = 0;

  exercises.forEach((ex) => {
    totalSets += ex.completedSets;
    ex.loggedSets.forEach((log) => {
      if (ex.isHold) {
        totalHoldSecs += log.repsOrSeconds;
      } else {
        totalReps += log.repsOrSeconds;
      }
    });
  });

  useEffect(() => {
    notificationService.notifyWorkoutCompleted(workoutTitle, totalSets, totalMinutes);
  }, [workoutTitle, totalSets, totalMinutes]);

  const handleReturnToDashboard = async () => {
    await clearSession();
    // Invalidate dashboard queries so latest workout session and weekly activity reload
    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    router.replace('/(tabs)');
  };

  return (
    <ScreenContainer scrollable padded>
      <View style={styles.celebrationCard} testID="workout-summary-card">
        {/* Celebration 2D Animation */}
        <View style={styles.animationContainer}>
          <ExerciseAnimation
            source={sampleAnimationJson}
            height={130}
            width={130}
            loop={false}
            autoPlay={true}
            fallbackText="Celebration"
          />
        </View>

        <View style={styles.badge}>
          <Sparkles size={12} color="#8A5D10" />
          <AppText variant="caption" color="#5C3E0A" style={styles.badgeText}>
            WORKOUT COMPLETED
          </AppText>
        </View>

        <AppText variant="h1" align="center" style={styles.title}>
          Great Work, Athlete!
        </AppText>
        <AppText variant="body" align="center" color={colors.textSecondary} style={styles.subtitle}>
          {workoutTitle}
        </AppText>

        {/* Real Summary Metrics */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricBox}>
            <Clock size={16} color={colors.primary} />
            <AppText variant="h2" color={colors.text}>
              {totalMinutes}
            </AppText>
            <AppText variant="caption" color={colors.textSecondary}>
              Minutes
            </AppText>
          </View>

          <View style={styles.metricBox}>
            <Dumbbell size={16} color={colors.primary} />
            <AppText variant="h2" color={colors.text}>
              {totalSets}
            </AppText>
            <AppText variant="caption" color={colors.textSecondary}>
              Sets Logged
            </AppText>
          </View>

          <View style={styles.metricBox}>
            <Award size={16} color={colors.accent} />
            <AppText variant="h2" color={colors.text}>
              {totalReps > 0 ? totalReps : `${totalHoldSecs}s`}
            </AppText>
            <AppText variant="caption" color={colors.textSecondary}>
              {totalReps > 0 ? 'Total Reps' : 'Hold Time'}
            </AppText>
          </View>
        </View>
      </View>

      {/* Completed Exercises Breakdown */}
      <View style={styles.breakdownSection}>
        <AppText variant="h2" color={colors.text} style={styles.sectionTitle}>
          Completed Exercises
        </AppText>

        {exercises
          .filter((ex) => ex.completedSets > 0)
          .map((ex) => (
            <View key={ex.exercise.id} style={styles.exerciseSummaryRow}>
              <View style={styles.checkIconCircle}>
                <CheckCircle2 size={16} color={colors.success} />
              </View>

              <View style={styles.exSummaryInfo}>
                <AppText variant="h3" color={colors.text} style={styles.exName}>
                  {ex.exercise.name}
                </AppText>
                <AppText variant="caption" color={colors.textSecondary}>
                  {ex.completedSets} sets completed •{' '}
                  {ex.loggedSets.map((l) => `${l.repsOrSeconds}${ex.isHold ? 's' : ''}`).join(', ')}
                </AppText>
              </View>
            </View>
          ))}
      </View>

      {/* Philosophy Reminder */}
      <View style={styles.philosophyBox}>
        <AppText variant="caption" color={colors.primaryDeep} style={styles.philosophyText}>
          Remember: Rest and nutrition are where adaptation happens. Hydrate and get adequate sleep before your next session.
        </AppText>
      </View>

      {/* Return to Dashboard */}
      <View style={styles.footer}>
        <AppButton
          title="Return to Dashboard"
          onPress={handleReturnToDashboard}
          variant="primary"
          size="lg"
          testID="return-to-dashboard-button"
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  celebrationCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.md,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  animationContainer: {
    width: 130,
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.accentMuted,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.accent,
    marginBottom: spacing.xs,
  },
  badgeText: {
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  title: {
    marginBottom: 4,
  },
  subtitle: {
    marginBottom: spacing.md,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
    width: '100%',
  },
  metricBox: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: radii.sm,
    padding: spacing.sm,
    alignItems: 'center',
  },
  breakdownSection: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    marginBottom: spacing.xs,
  },
  exerciseSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.sm,
    borderRadius: radii.sm,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  checkIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.successMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exSummaryInfo: {
    flex: 1,
  },
  exName: {
    fontSize: 13,
    marginBottom: 2,
  },
  philosophyBox: {
    backgroundColor: '#FAF8FE',
    borderWidth: 1,
    borderColor: colors.primaryLavender,
    borderRadius: radii.sm,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  philosophyText: {
    lineHeight: 16,
    fontSize: 11,
    textAlign: 'center',
  },
  footer: {
    marginBottom: spacing.xl,
  },
});

