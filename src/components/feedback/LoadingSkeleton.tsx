import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { colors, radii, spacing } from '@/theme';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export interface LoadingSkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius = radii.sm,
  style,
}) => {
  const isReducedMotion = useReducedMotion();
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    if (!isReducedMotion) {
      opacity.value = withRepeat(
        withTiming(0.85, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    } else {
      opacity.value = 0.5;
    }
  }, [isReducedMotion, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width: width as any,
          height,
          borderRadius,
        },
        animatedStyle,
        style,
      ]}
      accessible={true}
      accessibilityRole="none"
      accessibilityLabel="Loading content"
    />
  );
};

export interface CardSkeletonProps {
  style?: ViewStyle;
}

export const CardSkeleton: React.FC<CardSkeletonProps> = ({ style }) => {
  return (
    <View style={[styles.cardContainer, style]} accessible={true} accessibilityLabel="Loading card">
      <LoadingSkeleton width="40%" height={16} borderRadius={radii.xs} style={styles.mb8} />
      <LoadingSkeleton width="75%" height={24} borderRadius={radii.sm} style={styles.mb12} />
      <LoadingSkeleton width="100%" height={60} borderRadius={radii.sm} style={styles.mb8} />
      <View style={styles.row}>
        <LoadingSkeleton width="30%" height={14} borderRadius={radii.xs} />
        <LoadingSkeleton width="25%" height={14} borderRadius={radii.xs} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#E7E4EA',
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: radii.card,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#ECEAEF',
  },
  mb8: {
    marginBottom: spacing.xs,
  },
  mb12: {
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
});
