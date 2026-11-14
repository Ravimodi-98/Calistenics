import React, { useEffect } from 'react';
import { StyleSheet, Pressable, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { colors, radii, shadows, spacing } from '@/theme';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export type AnimatedCardVariant = 'default' | 'lavender' | 'selected' | 'accent' | 'outlined';

export interface AnimatedCardProps {
  children: React.ReactNode;
  variant?: AnimatedCardVariant;
  onPress?: () => void;
  style?: ViewStyle;
  testID?: string;
  delay?: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  variant = 'default',
  onPress,
  style,
  testID,
  delay = 0,
}) => {
  const isReducedMotion = useReducedMotion();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(isReducedMotion ? 1 : 0);
  const translateY = useSharedValue(isReducedMotion ? 0 : 12);

  useEffect(() => {
    if (isReducedMotion) {
      opacity.value = 1;
      translateY.value = 0;
      return;
    }

    const timeout = setTimeout(() => {
      opacity.value = withTiming(1, {
        duration: 250,
        easing: Easing.bezier(0.2, 0.0, 0, 1.0),
      });
      translateY.value = withTiming(0, {
        duration: 250,
        easing: Easing.bezier(0.2, 0.0, 0, 1.0),
      });
    }, delay);

    return () => clearTimeout(timeout);
  }, [delay, isReducedMotion]);

  const handlePressIn = () => {
    if (!onPress || isReducedMotion) return;
    scale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    if (!onPress || isReducedMotion) return;
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      testID={testID}
      style={[
        styles.base,
        styles[variant],
        variant === 'default' && shadows.card,
        animatedStyle,
        style,
      ]}
    >
      {children}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.card,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: colors.surface,
  },
  default: {
    backgroundColor: colors.surface,
    borderColor: colors.borderLight,
  },
  lavender: {
    backgroundColor: colors.primaryLavender,
    borderColor: '#D4CCF0',
  },
  selected: {
    backgroundColor: colors.primaryLavender,
    borderColor: colors.primary,
    borderWidth: 2,
  },
  accent: {
    backgroundColor: colors.accentMuted,
    borderColor: colors.accent,
  },
  outlined: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
});

