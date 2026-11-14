import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Play, Clock, Dumbbell, ShieldAlert, ChevronLeft, ArrowRight } from 'lucide-react-native';
import { colors, radii, spacing } from '@/theme';
import { AppText } from '@/components/ui/AppText';
import { AppButton } from '@/components/ui/AppButton';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { EmptyState } from '@/components/feedback';
import { useAuthStore } from '@/features/auth/store/authStore';
import { exerciseService } from '@/features/exercises/services/exerciseService';
import { recommendationEngine } from '@/features/dashboard/services/recommendationEngine';
import { useWorkoutSessionStore } from '@/features/workouts/store/workoutSessionStore';
import { WorkoutRecommendation } from '@/domain/models/workout.model';
import { PullDisclaimerBanner } from '@/features/exercises/components/PullDisclaimerBanner';
import { isEquipmentAvailable } from '@/domain/utils/equipment';

export default function WorkoutOverviewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { profile } = useAuthStore();
  const { initializeSession, startSession } = useWorkoutSessionStore();

  const userEquipment = profile?.available_equipment || ['none'];
  const hasPullupBar = isEquipmentAvailable(userEquipment, 'pull_up_bar');

  // Load exercises and construct workout matching ID or fallback
  const allExercises = exerciseService.getFallbackExercises();

  const workout: WorkoutRecommendation | null = useMemo(() => {
    if (!profile) return null;

    if (id === 'today') {
      return recommendationEngine.generateTodayWorkout(profile, allExercises);
    }

    // Custom or specific workout slug
    return recommendationEngine.generateTodayWorkout(profile, allExercises);
  }, [id, profile, allExercises]);

  if (!workout) {
    return (
      <ScreenContainer padded>
        <EmptyState
          title="Workout Not Found"
          description="We could not find the requested workout. Please choose another session from the dashboard."
          actionTitle="Back to Dashboard"
          onAction={() => router.replace('/(tabs)')}
        />
      </ScreenContainer>
    );
  }

  // Equipment validation check
  const requiresPullupBar = workout.exercises.some(
    (ex) => ex.equipment_required === 'pull_up_bar'
  );
  const equipmentBlocked = requiresPullupBar && !hasPullupBar;

  const handleStartWorkout = () => {
    if (equipmentBlocked) {
      return;
    }
    initializeSession(workout, userEquipment);
    startSession();
    router.push('/workout/session');
  };

  return (
    <ScreenContainer scrollable padded>
      {/* Back Button */}
      <Pressable
        style={styles.backButton}
        onPress={() => router.back()}
        accessibilityLabel="Go back"
        testID="workout-overview-back-button"
      >
        <ChevronLeft size={20} color={colors.primaryDeep} />
        <AppText variant="caption" color={colors.primaryDeep} style={styles.backText}>
          Dashboard
        </AppText>
      </Pressable>

      {/* Header Info */}
      <View style={styles.header}>
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <AppText variant="caption" color={colors.primaryDeep} style={styles.badgeText}>
              {workout.category.replace('_', ' ').toUpperCase()}
            </AppText>
          </View>
          <View style={styles.levelBadge}>
            <AppText variant="caption" color={colors.textSecondary} style={styles.badgeText}>
              {workout.difficulty.toUpperCase()}
            </AppText>
          </View>
        </View>

        <AppText variant="h1" color={colors.text} style={styles.title}>
          {workout.title}
        </AppText>

        <AppText variant="body" color={colors.textSecondary} style={styles.description}>
          {workout.focusNotes}
        </AppText>

        <View style={styles.metricsRow}>
          <View style={styles.metricItem}>
            <Clock size={16} color={colors.primary} />
            <AppText variant="caption" color={colors.text}>
              {workout.estimatedDurationMinutes} Minutes
            </AppText>
          </View>
          <View style={styles.metricItem}>
            <Dumbbell size={16} color={colors.primary} />
            <AppText variant="caption" color={colors.text}>
              {workout.exerciseCount} Exercises
            </AppText>
          </View>
        </View>
      </View>

      {/* Equipment Warning if user lacks equipment */}
      {equipmentBlocked && (
        <View style={styles.equipmentWarningCard} testID="equipment-warning-card">
          <ShieldAlert size={18} color="#9A3412" />
          <View style={styles.warningTextCol}>
            <AppText variant="h3" color="#9A3412" style={styles.warningTitle}>
              Pull-up Bar Required
            </AppText>
            <AppText variant="body" color="#7C2D12" style={styles.warningDesc}>
              This routine contains pull-up bar exercises, but your onboarding equipment is set to No Equipment.
            </AppText>
          </View>
        </View>
      )}

      {/* Pull Workout Transparent Disclaimer if floor pulling is present */}
      {workout.exercises.some((e) => e.disclaimer) && <PullDisclaimerBanner />}

      {/* Exercise List */}
      <View style={styles.exerciseSection}>
        <AppText variant="h2" color={colors.text} style={styles.sectionHeading}>
          Exercise Sequence
        </AppText>

        {workout.exercises.map((exercise, index) => {
          const isHold =
            exercise.slug.includes('hold') ||
            exercise.slug.includes('plank') ||
            exercise.slug.includes('hang');

          return (
            <View key={exercise.id} style={styles.exerciseRow} testID={`overview-exercise-${exercise.slug}`}>
              <View style={styles.indexCircle}>
                <AppText variant="caption" color="#FFFFFF" style={styles.indexText}>
                  {index + 1}
                </AppText>
              </View>

              <View style={styles.exerciseInfo}>
                <AppText variant="h3" color={colors.text} style={styles.exerciseName}>
                  {exercise.name}
                </AppText>
                <AppText variant="caption" color={colors.textSecondary}>
                  3 Sets • {isHold ? '30 seconds hold' : '10 reps'}
                </AppText>
              </View>

              <View style={styles.equipTag}>
                <AppText
                  variant="caption"
                  color={exercise.equipment_required === 'none' ? colors.primaryDeep : '#7C2D12'}
                  style={styles.equipText}
                >
                  {exercise.equipment_required === 'none' ? 'Zero Gear' : 'Bar'}
                </AppText>
              </View>
            </View>
          );
        })}
      </View>

      {/* Start Button */}
      <View style={styles.footer}>
        <AppButton
          title={equipmentBlocked ? 'Equipment Unavailable' : 'Start Workout Session'}
          onPress={handleStartWorkout}
          disabled={equipmentBlocked}
          icon={<Play size={18} color={colors.textInverse} fill={colors.textInverse} />}
          variant="primary"
          size="lg"
          testID="start-workout-session-button"
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
    alignSelf: 'flex-start',
  },
  backText: {
    fontWeight: '700',
  },
  header: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  badge: {
    backgroundColor: colors.primaryLavender,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radii.full,
  },
  levelBadge: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radii.full,
  },
  badgeText: {
    fontWeight: '700',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  title: {
    marginBottom: 6,
  },
  description: {
    lineHeight: 19,
    marginBottom: spacing.sm,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  equipmentWarningCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FDBA74',
    borderRadius: radii.sm,
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  warningTextCol: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 13,
    marginBottom: 2,
  },
  warningDesc: {
    fontSize: 11,
    lineHeight: 15,
  },
  exerciseSection: {
    marginBottom: spacing.lg,
  },
  sectionHeading: {
    marginBottom: spacing.xs,
  },
  exerciseRow: {
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
  indexCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indexText: {
    fontWeight: '800',
    fontSize: 11,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 14,
    marginBottom: 2,
  },
  equipTag: {
    backgroundColor: '#FAF8FE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.xs,
  },
  equipText: {
    fontSize: 10,
    fontWeight: '700',
  },
  footer: {
    marginTop: spacing.xs,
    marginBottom: spacing.xxl,
  },
});

