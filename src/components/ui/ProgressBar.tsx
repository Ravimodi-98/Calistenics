import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { colors, radii, spacing } from '@/theme';
import { AppText } from './AppText';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export interface ProgressBarProps {
  /** Progress from 0 to 1 (e.g. 0.65 for 65%) */
  progress: number;
  label?: string;
  showPercent?: boolean;
  color?: string;
  trackColor?: string;
  height?: number;
  style?: ViewStyle;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  label,
  showPercent = false,
  color = colors.primary,
  trackColor = colors.primaryLavender,
  height = 8,
  style,
}) => {
  const isReducedMotion = useReducedMotion();
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const animatedWidth = useSharedValue(clampedProgress);

  useEffect(() => {
    if (isReducedMotion) {
      animatedWidth.value = clampedProgress;
    } else {
      animatedWidth.value = withTiming(clampedProgress, {
        duration: 300,
        easing: Easing.bezier(0.2, 0.0, 0, 1.0),
      });
    }
  }, [clampedProgress, isReducedMotion]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${animatedWidth.value * 100}%`,
    };
  });

  const percentText = `${Math.round(clampedProgress * 100)}%`;

  return (
    <View style={[styles.container, style]} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: clampedProgress * 100 }}>
      {(label || showPercent) && (
        <View style={styles.labelRow}>
          {label && (
            <AppText variant="caption" style={styles.labelText}>
              {label}
            </AppText>
          )}
          {showPercent && (
            <AppText variant="caption" style={styles.percentText}>
              {percentText}
            </AppText>
          )}
        </View>
      )}

      <View style={[styles.track, { height, backgroundColor: trackColor }]}>
        <Animated.View
          style={[
            styles.fill,
            { height, backgroundColor: color },
            animatedStyle,
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.xs,
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xxs,
  },
  labelText: {
    color: colors.textSecondary,
    fontWeight: '600',
  },
  percentText: {
    color: colors.primaryDeep,
    fontWeight: '700',
  },
  track: {
    width: '100%',
    borderRadius: radii.full,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: radii.full,
  },
});

