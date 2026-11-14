import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { FastForward, Plus, ArrowRight } from 'lucide-react-native';
import { colors, radii, spacing } from '@/theme';
import { AppText } from '@/components/ui/AppText';
import { AppButton } from '@/components/ui/AppButton';
import { Exercise } from '@/domain/models/exercise.model';

interface RestTimerOverlayProps {
  timeRemaining: number;
  totalDuration: number;
  nextExercise?: Exercise;
  nextSetNumber: number;
  targetReps: number;
  isHold: boolean;
  onSkip: () => void;
  onAddSeconds: (seconds: number) => void;
}

export const RestTimerOverlay: React.FC<RestTimerOverlayProps> = ({
  timeRemaining,
  totalDuration,
  nextExercise,
  nextSetNumber,
  targetReps,
  isHold,
  onSkip,
  onAddSeconds,
}) => {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  // Progress percentage
  const progressRatio = totalDuration > 0 ? (totalDuration - timeRemaining) / totalDuration : 0;
  const progressPercentage = Math.round(progressRatio * 100);

  return (
    <Animated.View
      style={styles.overlay}
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(200)}
      testID="rest-timer-overlay"
    >
      <View style={styles.card}>
        {/* Rest Label */}
        <View style={styles.badge}>
          <AppText variant="caption" color={colors.primaryDeep} style={styles.badgeText}>
            REST & RECOVER
          </AppText>
        </View>

        {/* Circular Countdown Presentation */}
        <View style={styles.timerCircle}>
          <AppText variant="display" color={colors.primaryDeep} style={styles.timerText}>
            {formattedTime}
          </AppText>
          <AppText variant="caption" color={colors.textSecondary}>
            {progressPercentage}% elapsed
          </AppText>
        </View>

        {/* Add Time Buttons */}
        <View style={styles.addTimeRow}>
          <Pressable
            style={styles.timePill}
            onPress={() => onAddSeconds(15)}
            accessibilityRole="button"
            accessibilityLabel="Add 15 seconds rest"
            testID="add-15s-button"
          >
            <Plus size={12} color={colors.primary} />
            <AppText variant="caption" color={colors.primary} style={styles.timePillText}>
              +15s
            </AppText>
          </Pressable>

          <Pressable
            style={styles.timePill}
            onPress={() => onAddSeconds(30)}
            accessibilityRole="button"
            accessibilityLabel="Add 30 seconds rest"
            testID="add-30s-button"
          >
            <Plus size={12} color={colors.primary} />
            <AppText variant="caption" color={colors.primary} style={styles.timePillText}>
              +30s
            </AppText>
          </Pressable>
        </View>

        {/* Next Exercise Preview Card */}
        {nextExercise && (
          <View style={styles.nextPreviewBox} testID="next-exercise-preview">
            <View style={styles.previewHeader}>
              <ArrowRight size={12} color={colors.textSecondary} />
              <AppText variant="caption" color={colors.textSecondary} style={styles.previewLabel}>
                UP NEXT • SET {nextSetNumber}
              </AppText>
            </View>
            <AppText variant="h3" color={colors.text} style={styles.previewName}>
              {nextExercise.name}
            </AppText>
            <AppText variant="caption" color={colors.primaryDeep} style={styles.previewTarget}>
              Target: {targetReps} {isHold ? 'seconds hold' : 'reps'}
            </AppText>
          </View>
        )}

        {/* Skip Rest Button */}
        <AppButton
          title="Skip Rest & Begin"
          onPress={onSkip}
          icon={<FastForward size={16} color={colors.textInverse} />}
          variant="primary"
          size="md"
          style={styles.skipButton}
          testID="skip-rest-button"
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(32, 32, 34, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    zIndex: 100,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: spacing.lg,
    alignItems: 'center',
    shadowColor: '#202022',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  badge: {
    backgroundColor: colors.primaryLavender,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radii.full,
    marginBottom: spacing.md,
  },
  badgeText: {
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 0.8,
  },
  timerCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#FAF8FE',
    borderWidth: 6,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  timerText: {
    fontWeight: '800',
    fontSize: 36,
    lineHeight: 42,
  },
  addTimeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  timePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FAF8FE',
    borderWidth: 1,
    borderColor: colors.primaryLavender,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: radii.full,
  },
  timePillText: {
    fontWeight: '700',
    fontSize: 11,
  },
  nextPreviewBox: {
    width: '100%',
    backgroundColor: colors.background,
    borderRadius: radii.sm,
    padding: spacing.sm,
    marginBottom: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  previewLabel: {
    fontWeight: '700',
    fontSize: 9,
    letterSpacing: 0.5,
  },
  previewName: {
    fontSize: 14,
    marginBottom: 2,
  },
  previewTarget: {
    fontWeight: '700',
    fontSize: 11,
  },
  skipButton: {
    width: '100%',
  },
});
