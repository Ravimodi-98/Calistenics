import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Pressable, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import {
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Pause,
  Play,
  Clock,
  Plus,
  Minus,
  Sparkles,
  Info,
} from 'lucide-react-native';
import { colors, radii, spacing } from '@/theme';
import { AppText } from '@/components/ui/AppText';
import { AppButton } from '@/components/ui/AppButton';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { LoadingState } from '@/components/feedback';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useWorkoutSessionStore } from '@/features/workouts/store/workoutSessionStore';
import { useAuthStore } from '@/features/auth/store/authStore';
import { ExerciseAnimation } from '@/animations/components/ExerciseAnimation';
import { getExerciseAnimationMeta } from '@/animations/registry/exerciseAnimationRegistry';
import { RestTimerOverlay } from '@/features/workouts/components/RestTimerOverlay';

// Sample 2D calisthenics animation
const sampleExerciseJson = require('@/animations/assets/sample-exercise.json');

export default function WorkoutSessionScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    workoutTitle,
    exercises,
    currentExerciseIndex,
    currentSetNumber,
    status,
    elapsedSeconds,
    restTimeRemaining,
    restTotalDuration,
    isRestActive,
    isSaving,
    completeSet,
    skipRest,
    addRestSeconds,
    tickSecond,
    pauseSession,
    resumeSession,
    nextExercise,
    previousExercise,
    abandonSession,
    finishSessionEarly,
    saveSessionToSupabase,
    restoreSavedSession,
  } = useWorkoutSessionStore();

  const [isRestoring, setIsRestoring] = useState(exercises.length === 0);

  useEffect(() => {
    if (exercises.length === 0) {
      restoreSavedSession().finally(() => setIsRestoring(false));
    }
  }, [exercises.length, restoreSavedSession]);

  const currentExState = exercises[currentExerciseIndex];
  const currentExercise = currentExState?.exercise;

  // Reps / Hold input state for current set
  const [loggedValue, setLoggedValue] = useState<number>(10);

  // Sync loggedValue with exercise target when switching exercise or set
  useEffect(() => {
    if (currentExState) {
      setLoggedValue(currentExState.targetReps);
    }
  }, [currentExerciseIndex, currentSetNumber, currentExState]);

  // Elapsed timer ticker interval
  useEffect(() => {
    const interval = setInterval(() => {
      tickSecond();
    }, 1000);
    return () => clearInterval(interval);
  }, [tickSecond]);

  // Format elapsed time (MM:SS)
  const elapsedMin = Math.floor(elapsedSeconds / 60);
  const elapsedSec = elapsedSeconds % 60;
  const formattedElapsed = `${elapsedMin}:${elapsedSec < 10 ? '0' : ''}${elapsedSec}`;

  // If restoring saved session from disk
  if (isRestoring) {
    return (
      <ScreenContainer padded>
        <LoadingState message="Checking for saved workout session..." />
      </ScreenContainer>
    );
  }

  // If no active session, direct user back to dashboard
  if (!currentExercise || exercises.length === 0) {
    return (
      <ScreenContainer padded>
        <AppText variant="h2" align="center" style={styles.emptyTitle}>
          No Active Workout Session
        </AppText>
        <AppText variant="body" align="center" color={colors.textSecondary} style={styles.emptyDesc}>
          Please select a workout routine from the Dashboard or Exercise Library to begin.
        </AppText>
        <AppButton
          title="Go to Dashboard"
          onPress={() => router.replace('/(tabs)')}
          variant="primary"
          size="md"
        />
      </ScreenContainer>
    );
  }

  // Animation metadata from registry
  const animMeta = getExerciseAnimationMeta(currentExercise.slug);

  // Overall workout progress calculation
  const totalSetsInWorkout = exercises.reduce((acc, ex) => acc + ex.targetSets, 0);
  const completedSetsTotal = exercises.reduce((acc, ex) => acc + ex.completedSets, 0);
  const progressRatio = totalSetsInWorkout > 0 ? completedSetsTotal / totalSetsInWorkout : 0;

  // Next exercise for rest timer preview
  const nextExIndex = currentSetNumber >= currentExState.targetSets ? currentExerciseIndex + 1 : currentExerciseIndex;
  const nextExerciseObj = exercises[nextExIndex]?.exercise;
  const nextSet = currentSetNumber >= currentExState.targetSets ? 1 : currentSetNumber + 1;
  const nextTarget = exercises[nextExIndex]?.targetReps || 10;
  const nextIsHold = exercises[nextExIndex]?.isHold || false;

  const handleExit = () => {
    Alert.alert(
      'Exit Workout?',
      'Would you like to finish and save your recorded sets, or abandon this session?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Abandon',
          style: 'destructive',
          onPress: () => {
            abandonSession();
            router.replace('/(tabs)');
          },
        },
        {
          text: 'Finish & Save',
          onPress: async () => {
            finishSessionEarly();
            if (user?.id) {
              await saveSessionToSupabase(user.id);
            }
            router.replace('/workout/summary');
          },
        },
      ]
    );
  };

  const handleCompleteSet = () => {
    completeSet(loggedValue);

    // If workout just completed:
    if (
      currentExerciseIndex === exercises.length - 1 &&
      currentSetNumber >= currentExState.targetSets
    ) {
      if (user?.id) {
        saveSessionToSupabase(user.id);
      }
      router.replace('/workout/summary');
    }
  };

  return (
    <View style={styles.screen}>
      {/* REST TIMER OVERLAY (Active during rest periods) */}
      {isRestActive && (
        <RestTimerOverlay
          timeRemaining={restTimeRemaining}
          totalDuration={restTotalDuration}
          nextExercise={nextExerciseObj}
          nextSetNumber={nextSet}
          targetReps={nextTarget}
          isHold={nextIsHold}
          onSkip={skipRest}
          onAddSeconds={addRestSeconds}
        />
      )}

      {/* TOP BAR / HEADER */}
      <View style={styles.topBar}>
        <Pressable
          onPress={handleExit}
          style={styles.closeButton}
          accessibilityLabel="Exit workout"
          testID="exit-workout-button"
        >
          <X size={20} color={colors.text} />
        </Pressable>

        <View style={styles.headerInfo}>
          <AppText variant="caption" color={colors.primaryDeep} style={styles.workoutNameHeader}>
            {workoutTitle}
          </AppText>
          <View style={styles.elapsedBadge}>
            <Clock size={11} color={colors.textSecondary} />
            <AppText variant="caption" color={colors.textSecondary} style={styles.elapsedText}>
              {formattedElapsed}
            </AppText>
          </View>
        </View>

        <Pressable
          onPress={status === 'paused' ? resumeSession : pauseSession}
          style={styles.pauseButton}
          accessibilityLabel={status === 'paused' ? 'Resume workout' : 'Pause workout'}
          testID="pause-resume-button"
        >
          {status === 'paused' ? (
            <Play size={16} color={colors.primary} />
          ) : (
            <Pause size={16} color={colors.text} />
          )}
        </Pressable>
      </View>

      {/* OVERALL PROGRESS BAR */}
      <View style={styles.progressContainer}>
        <ProgressBar
          progress={progressRatio}
          height={6}
          color={colors.primary}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* EXERCISE TITLE & PROGRESS COUNTER */}
        <View style={styles.titleSection}>
          <View style={styles.tagRow}>
            <View style={styles.indexPill}>
              <AppText variant="caption" color={colors.primaryDeep} style={styles.indexPillText}>
                MOVE {currentExerciseIndex + 1} OF {exercises.length}
              </AppText>
            </View>
            <View style={styles.equipPill}>
              <AppText variant="caption" color={colors.textSecondary} style={styles.equipPillText}>
                {currentExercise.equipment_required === 'none' ? 'No Equipment' : 'Pull-up Bar'}
              </AppText>
            </View>
          </View>

          <AppText variant="h1" color={colors.text} style={styles.exerciseTitle}>
            {currentExercise.name}
          </AppText>
        </View>

        {/* 2D EXERCISE ANIMATION DEMONSTRATION STAGE */}
        <View style={styles.animationStage} testID="workout-animation-stage">
          <ExerciseAnimation
            slug={currentExercise.slug}
            exerciseName={currentExercise.name}
            diagramPattern={animMeta.diagramPattern}
            isHold={currentExState.isHold}
            isSkill={animMeta.isSkill}
            progressionStage={animMeta.progressionStage}
            height={220}
            autoPlay={status !== 'paused'}
            loop={true}
          />
        </View>

        {/* TARGET & SETS PROGRESS ROW */}
        <View style={styles.targetCard}>
          <View style={styles.targetHeader}>
            <AppText variant="caption" color={colors.textSecondary} style={styles.targetLabel}>
              CURRENT SET • {currentSetNumber} OF {currentExState.targetSets}
            </AppText>
            <AppText variant="caption" color={colors.primaryDeep} style={styles.targetGoal}>
              Target: {currentExState.targetReps} {currentExState.isHold ? 'Seconds' : 'Reps'}
            </AppText>
          </View>

          {/* Sets Pills */}
          <View style={styles.setsIndicatorRow}>
            {Array.from({ length: currentExState.targetSets }).map((_, idx) => {
              const setNum = idx + 1;
              const isCompleted = setNum < currentSetNumber;
              const isCurrent = setNum === currentSetNumber;

              return (
                <View
                  key={idx}
                  style={[
                    styles.setPill,
                    isCompleted && styles.setPillCompleted,
                    isCurrent && styles.setPillCurrent,
                  ]}
                >
                  {isCompleted ? (
                    <CheckCircle2 size={13} color="#FFFFFF" />
                  ) : (
                    <AppText
                      variant="caption"
                      color={isCurrent ? '#FFFFFF' : colors.textSecondary}
                      style={styles.setPillText}
                    >
                      Set {setNum}
                    </AppText>
                  )}
                </View>
              );
            })}
          </View>

          {/* Actual Logged Value Stepper */}
          <View style={styles.stepperContainer}>
            <AppText variant="caption" color={colors.textSecondary} style={styles.stepperLabel}>
              RECORD YOUR ACTUAL {currentExState.isHold ? 'SECONDS' : 'REPETITIONS'}:
            </AppText>
            <View style={styles.stepperRow}>
              <Pressable
                style={styles.stepBtn}
                onPress={() => setLoggedValue((prev) => Math.max(1, prev - 1))}
                accessibilityLabel="Decrease reps"
                testID="decrease-reps-button"
              >
                <Minus size={18} color={colors.text} />
              </Pressable>

              <View style={styles.valueDisplay}>
                <TextInput
                  style={styles.valueInput}
                  value={String(loggedValue)}
                  onChangeText={(val) => {
                    const num = parseInt(val, 10);
                    if (!isNaN(num)) setLoggedValue(Math.max(1, Math.min(num, 500)));
                  }}
                  keyboardType="numeric"
                  testID="logged-reps-input"
                />
                <AppText variant="caption" color={colors.textSecondary}>
                  {currentExState.isHold ? 'sec hold' : 'reps'}
                </AppText>
              </View>

              <Pressable
                style={styles.stepBtn}
                onPress={() => setLoggedValue((prev) => prev + 1)}
                accessibilityLabel="Increase reps"
                testID="increase-reps-button"
              >
                <Plus size={18} color={colors.text} />
              </Pressable>
            </View>
          </View>
        </View>

        {/* CUES & TECHNIQUE ACCORDION */}
        <View style={styles.techniqueBox}>
          <View style={styles.cuesHeader}>
            <Info size={14} color={colors.primaryDeep} />
            <AppText variant="caption" color={colors.primaryDeep} style={styles.cuesTitle}>
              TECHNIQUE CUES
            </AppText>
          </View>
          {animMeta.instructionalCues.map((cue, idx) => (
            <View key={idx} style={styles.cueRow}>
              <View style={styles.cueDot} />
              <AppText variant="body" color={colors.text} style={styles.cueText}>
                {cue}
              </AppText>
            </View>
          ))}
          {currentExercise.disclaimer && (
            <View style={styles.disclaimerNote}>
              <AppText variant="caption" color="#7C2D12" style={styles.disclaimerNoteText}>
                {currentExercise.disclaimer}
              </AppText>
            </View>
          )}
        </View>
      </ScrollView>

      {/* BOTTOM CONTROLS FOOTER */}
      <View style={styles.bottomFooter}>
        <View style={styles.navRow}>
          <Pressable
            style={[styles.navBtn, currentExerciseIndex === 0 && styles.navBtnDisabled]}
            onPress={previousExercise}
            disabled={currentExerciseIndex === 0}
            accessibilityLabel="Previous exercise"
            testID="previous-exercise-button"
          >
            <ChevronLeft size={20} color={currentExerciseIndex === 0 ? colors.border : colors.text} />
          </Pressable>

          <AppButton
            title={`Complete Set ${currentSetNumber}`}
            onPress={handleCompleteSet}
            loading={isSaving}
            variant="primary"
            size="lg"
            style={styles.completeSetButton}
            testID="complete-set-button"
          />

          <Pressable
            style={[
              styles.navBtn,
              currentExerciseIndex === exercises.length - 1 && styles.navBtnDisabled,
            ]}
            onPress={nextExercise}
            disabled={currentExerciseIndex === exercises.length - 1}
            accessibilityLabel="Next exercise"
            testID="next-exercise-button"
          >
            <ChevronRight
              size={20}
              color={currentExerciseIndex === exercises.length - 1 ? colors.border : colors.text}
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xs,
    backgroundColor: colors.surface,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: radii.full,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    alignItems: 'center',
  },
  workoutNameHeader: {
    fontWeight: '700',
    fontSize: 12,
  },
  elapsedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  elapsedText: {
    fontSize: 11,
    fontWeight: '600',
  },
  pauseButton: {
    width: 36,
    height: 36,
    borderRadius: radii.full,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressContainer: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xs,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: 110,
  },
  titleSection: {
    marginBottom: spacing.xs,
  },
  tagRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: 4,
  },
  indexPill: {
    backgroundColor: colors.primaryLavender,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radii.full,
  },
  indexPillText: {
    fontWeight: '800',
    fontSize: 9,
    letterSpacing: 0.5,
  },
  equipPill: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  equipPillText: {
    fontSize: 10,
    fontWeight: '600',
  },
  exerciseTitle: {
    fontSize: 22,
    lineHeight: 28,
  },
  animationStage: {
    marginBottom: spacing.md,
  },
  targetCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  targetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  targetLabel: {
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  targetGoal: {
    fontWeight: '700',
    fontSize: 12,
  },
  setsIndicatorRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  setPill: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: radii.sm,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  setPillCurrent: {
    backgroundColor: colors.primary,
  },
  setPillCompleted: {
    backgroundColor: colors.success,
  },
  setPillText: {
    fontWeight: '700',
    fontSize: 11,
  },
  stepperContainer: {
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  stepperLabel: {
    fontWeight: '700',
    fontSize: 9,
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  stepBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FAF8FE',
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueDisplay: {
    alignItems: 'center',
    minWidth: 80,
  },
  valueInput: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    padding: 0,
  },
  techniqueBox: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cuesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: spacing.xs,
  },
  cuesTitle: {
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  cueRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs,
    marginBottom: 6,
  },
  cueDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.primary,
    marginTop: 6,
  },
  cueText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
  },
  disclaimerNote: {
    backgroundColor: '#FFF7ED',
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
    padding: spacing.xs,
    borderRadius: radii.xs,
    marginTop: spacing.xs,
  },
  disclaimerNoteText: {
    fontSize: 11,
    lineHeight: 15,
  },
  bottomFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    paddingBottom: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  navBtn: {
    width: 48,
    height: 48,
    borderRadius: radii.sm,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  navBtnDisabled: {
    opacity: 0.4,
  },
  completeSetButton: {
    flex: 1,
  },
  emptyTitle: {
    marginTop: spacing.xl,
    marginBottom: spacing.xs,
  },
  emptyDesc: {
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
});
