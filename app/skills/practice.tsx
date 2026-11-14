import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ChevronLeft,
  Play,
  Pause,
  RotateCcw,
  Check,
  Star,
  Award,
} from 'lucide-react-native';
import { colors, radii, spacing } from '@/theme';
import { AppText } from '@/components/ui/AppText';
import { AppButton } from '@/components/ui/AppButton';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { LoadingState } from '@/components/feedback';
import { ExerciseAnimation } from '@/animations/components/ExerciseAnimation';
import {
  SkillCatalogItem,
  SkillProgressionStage,
} from '@/domain/models/skill.model';
import { skillService } from '@/features/skills/services/skillService';
import { notificationService } from '@/features/notifications/services/notificationService';
import { useAuthStore } from '@/features/auth/store/authStore';

export default function SkillPracticeScreen() {
  const { skillSlug, stageSlug } = useLocalSearchParams<{
    skillSlug: string;
    stageSlug: string;
  }>();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const [skill, setSkill] = useState<SkillCatalogItem | null>(null);
  const [stage, setStage] = useState<SkillProgressionStage | null>(null);
  const [loading, setLoading] = useState(true);

  // Practice session state
  const [setsCount, setSetsCount] = useState(3);
  const [recordedMetric, setRecordedMetric] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [effortRating, setEffortRating] = useState<number | null>(3);
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    async function loadStageData() {
      try {
        const [skillData, pathway] = await Promise.all([
          skillService.getSkillBySlug(skillSlug || 'handstand'),
          skillService.getSkillPathway(skillSlug || 'handstand'),
        ]);

        const selectedStage =
          pathway.find((s) => s.stage_slug === stageSlug) || pathway[0];

        setSkill(skillData);
        setStage(selectedStage);
        setRecordedMetric(selectedStage?.target_value || 10);
      } catch {
        // Fallback gracefully handled in skillService
      } finally {
        setLoading(false);
      }
    }
    loadStageData();
  }, [skillSlug, stageSlug]);

  // Practice Timer
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning]);

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimerSeconds(0);
  };

  const handleSave = async () => {
    if (!user) {
      Alert.alert('Sign In Required', 'Please sign in to log practice progress.');
      return;
    }

    if (recordedMetric <= 0) {
      Alert.alert('Invalid Entry', 'Please record at least 1 second or repetition.');
      return;
    }

    try {
      setIsSaving(true);
      const isHold = stage?.target_type === 'hold_seconds';

      await skillService.recordSkillPractice(user.id, {
        skill_slug: skillSlug || 'handstand',
        stage_slug: stage?.stage_slug || 'stage-1',
        duration_seconds: Math.max(timerSeconds, 60), // At least 1 min session
        completed_sets: setsCount,
        recorded_hold_seconds: isHold ? recordedMetric : 0,
        recorded_reps: isHold ? 0 : recordedMetric,
        effort_rating: effortRating,
        notes: notes.trim() || undefined,
      });

      notificationService.notifySkillPracticeLogged(
        skill?.name || 'Skill',
        stage?.stage_name || 'Stage',
        `${recordedMetric} ${isHold ? 'seconds' : 'reps'}`
      );

      Alert.alert(
        'Practice Logged!',
        `Logged ${setsCount} sets of ${stage?.stage_name} with best performance of ${recordedMetric} ${
          isHold ? 'seconds' : 'reps'
        }.`,
        [
          {
            text: 'View Pathway',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to record session.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || !stage) {
    return (
      <ScreenContainer padded>
        <LoadingState message="Loading practice stage..." />
      </ScreenContainer>
    );
  }

  const isHold = stage.target_type === 'hold_seconds';
  const minutes = Math.floor(timerSeconds / 60);
  const seconds = timerSeconds % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Navigation Bar */}
        <View style={styles.navBar}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            testID="practice-back-button"
          >
            <ChevronLeft size={22} color={colors.text} />
          </Pressable>
          <View style={styles.titleColumn}>
            <AppText variant="caption" color={colors.primaryDeep} style={styles.skillLabel}>
              {skill?.name || 'Skill Practice'} • STAGE {stage.stage_order}
            </AppText>
            <AppText variant="h3" color={colors.text} numberOfLines={1}>
              {stage.stage_name}
            </AppText>
          </View>
        </View>

        {/* 2D Vector Demonstration Stage */}
        <View style={styles.animationStage} testID="practice-animation-stage">
          <ExerciseAnimation
            slug={stage.skill_slug}
            exerciseName={stage.stage_name}
            isSkill={true}
            progressionStage={`Stage ${stage.stage_order}: ${stage.stage_name}`}
            height={220}
            autoPlay={true}
            loop={true}
          />
        </View>

        {/* Stage Target & Criteria Banner */}
        <View style={styles.stageTargetCard}>
          <View style={styles.targetHeader}>
            <Award size={16} color={colors.primaryDeep} />
            <AppText variant="caption" color={colors.primaryDeep} style={styles.targetHeading}>
              STAGE TARGET CRITERIA
            </AppText>
          </View>
          <AppText variant="h2" color={colors.text} style={styles.targetTitle}>
            {stage.target_value} {isHold ? 'Seconds Solid Hold' : 'Strict Repetitions'}
          </AppText>
          <AppText variant="caption" color={colors.textSecondary} style={styles.targetDesc}>
            {stage.assessment_criteria}
          </AppText>
        </View>

        {/* Practice Timer Controls */}
        <View style={styles.timerCard}>
          <AppText variant="caption" color={colors.textSecondary} style={styles.timerLabel}>
            SESSION DURATION
          </AppText>
          <AppText variant="h1" color={colors.text} style={styles.timerDisplay}>
            {timeFormatted}
          </AppText>

          <View style={styles.timerActionsRow}>
            <Pressable
              style={[styles.timerButton, isTimerRunning ? styles.pauseButton : styles.playButton]}
              onPress={toggleTimer}
              testID="practice-timer-toggle"
            >
              {isTimerRunning ? (
                <>
                  <Pause size={14} color="#FFFFFF" />
                  <AppText variant="button" color="#FFFFFF">
                    Pause
                  </AppText>
                </>
              ) : (
                <>
                  <Play size={14} color="#FFFFFF" fill="#FFFFFF" />
                  <AppText variant="button" color="#FFFFFF">
                    Start Timer
                  </AppText>
                </>
              )}
            </Pressable>

            <Pressable style={styles.resetButton} onPress={resetTimer} testID="practice-timer-reset">
              <RotateCcw size={14} color={colors.textSecondary} />
              <AppText variant="caption" color={colors.textSecondary}>
                Reset
              </AppText>
            </Pressable>
          </View>
        </View>

        {/* Set & Reps / Hold Logger */}
        <View style={styles.loggerCard}>
          <AppText variant="h3" color={colors.text} style={styles.loggerHeading}>
            Log Practice Output
          </AppText>

          {/* Sets Stepper */}
          <View style={styles.inputRow}>
            <AppText variant="body" color={colors.text}>
              Completed Sets
            </AppText>
            <View style={styles.stepperContainer}>
              <Pressable
                style={styles.stepBtn}
                onPress={() => setSetsCount(Math.max(1, setsCount - 1))}
                testID="decrement-sets-btn"
              >
                <AppText variant="h3" color={colors.primaryDeep}>
                  -
                </AppText>
              </Pressable>
              <AppText variant="h3" color={colors.text} style={styles.stepperVal}>
                {setsCount}
              </AppText>
              <Pressable
                style={styles.stepBtn}
                onPress={() => setSetsCount(Math.min(20, setsCount + 1))}
                testID="increment-sets-btn"
              >
                <AppText variant="h3" color={colors.primaryDeep}>
                  +
                </AppText>
              </Pressable>
            </View>
          </View>

          {/* Metric Stepper (Hold Secs or Reps) */}
          <View style={styles.inputRow}>
            <AppText variant="body" color={colors.text}>
              {isHold ? 'Best Hold Duration' : 'Best Set Repetitions'}
            </AppText>
            <View style={styles.stepperContainer}>
              <Pressable
                style={styles.stepBtn}
                onPress={() => setRecordedMetric(Math.max(0, recordedMetric - (isHold ? 5 : 1)))}
                testID="decrement-metric-btn"
              >
                <AppText variant="h3" color={colors.primaryDeep}>
                  -
                </AppText>
              </Pressable>
              <AppText variant="h3" color={colors.primaryDeep} style={styles.stepperVal}>
                {recordedMetric} {isHold ? 's' : ''}
              </AppText>
              <Pressable
                style={styles.stepBtn}
                onPress={() => setRecordedMetric(recordedMetric + (isHold ? 5 : 1))}
                testID="increment-metric-btn"
              >
                <AppText variant="h3" color={colors.primaryDeep}>
                  +
                </AppText>
              </Pressable>
            </View>
          </View>

          {/* Effort Rating (RPE 1 to 5) */}
          <View style={styles.rpeSection}>
            <AppText variant="caption" color={colors.textSecondary} style={styles.rpeLabel}>
              EFFORT RATING (RPE 1-5)
            </AppText>
            <View style={styles.rpeRow}>
              {[1, 2, 3, 4, 5].map((val) => (
                <Pressable
                  key={val}
                  style={[styles.rpeButton, effortRating === val && styles.rpeButtonActive]}
                  onPress={() => setEffortRating(val)}
                  testID={`rpe-button-${val}`}
                >
                  <Star
                    size={14}
                    color={effortRating === val ? '#FFFFFF' : colors.primaryDeep}
                    fill={effortRating === val ? '#FFFFFF' : 'none'}
                  />
                  <AppText
                    variant="caption"
                    color={effortRating === val ? '#FFFFFF' : colors.text}
                    style={styles.rpeText}
                  >
                    {val}
                  </AppText>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Practice Notes Input */}
          <View style={styles.notesSection}>
            <AppText variant="caption" color={colors.textSecondary} style={styles.notesLabel}>
              OPTIONAL NOTES (FORM FEEL, BALANCING CUES)
            </AppText>
            <TextInput
              style={styles.notesInput}
              placeholder="e.g. Felt solid fingertip pressure, maintained straight elbows..."
              placeholderTextColor={colors.textMuted}
              value={notes}
              onChangeText={setNotes}
              multiline
              maxLength={500}
              testID="practice-notes-input"
            />
          </View>

          {/* Submit Action Button */}
          <AppButton
            title="Record Practice Session"
            variant="primary"
            onPress={handleSave}
            loading={isSaving}
            testID="save-practice-session-btn"
            style={styles.saveButton}
          />
        </View>

        {/* Technique Reminders Box */}
        <View style={styles.techniqueBox}>
          <AppText variant="caption" color={colors.textSecondary} style={styles.techniqueHeading}>
            TECHNIQUE CUES FOR THIS STAGE
          </AppText>
          {stage.technique_cues.map((cue, idx) => (
            <View key={idx} style={styles.cueRow}>
              <View style={styles.bulletDot} />
              <AppText variant="body" color={colors.text} style={styles.cueText}>
                {cue}
              </AppText>
            </View>
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  titleColumn: {
    flex: 1,
  },
  skillLabel: {
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  animationStage: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: radii.card,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  stageTargetCard: {
    backgroundColor: '#EDE9FA',
    marginHorizontal: spacing.md,
    padding: spacing.md,
    borderRadius: radii.card,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: '#D8CEF2',
  },
  targetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  targetHeading: {
    fontWeight: '800',
    fontSize: 10,
  },
  targetTitle: {
    color: colors.primaryDeep,
    marginBottom: 4,
  },
  targetDesc: {
    fontSize: 11,
    lineHeight: 15,
  },
  timerCard: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    padding: spacing.md,
    borderRadius: radii.card,
    alignItems: 'center',
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  timerLabel: {
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  timerDisplay: {
    fontSize: 36,
    marginVertical: spacing.xs,
  },
  timerActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  timerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.full,
  },
  playButton: {
    backgroundColor: colors.primary,
  },
  pauseButton: {
    backgroundColor: colors.primaryDeep,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  loggerCard: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    padding: spacing.md,
    borderRadius: radii.card,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  loggerHeading: {
    marginBottom: spacing.sm,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  stepBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  stepperVal: {
    minWidth: 40,
    textAlign: 'center',
  },
  rpeSection: {
    marginTop: spacing.sm,
  },
  rpeLabel: {
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  rpeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.xs,
  },
  rpeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: colors.background,
    paddingVertical: 8,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rpeButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  rpeText: {
    fontWeight: '700',
    fontSize: 11,
  },
  notesSection: {
    marginTop: spacing.sm,
  },
  notesLabel: {
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  notesInput: {
    backgroundColor: colors.background,
    borderRadius: radii.sm,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: 12,
    color: colors.text,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  saveButton: {
    marginTop: spacing.md,
  },
  techniqueBox: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    padding: spacing.md,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  techniqueHeading: {
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
});
