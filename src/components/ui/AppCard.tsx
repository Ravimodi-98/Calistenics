import React from 'react';
import { View, Pressable, StyleSheet, ViewStyle } from 'react-native';
import { colors, radii, shadows, spacing } from '@/theme';

export type CardVariant = 'default' | 'lavender' | 'selected' | 'accent' | 'outlined';

export interface AppCardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  onPress?: () => void;
  style?: ViewStyle;
  testID?: string;
}

export const AppCard: React.FC<AppCardProps> = ({
  children,
  variant = 'default',
  onPress,
  style,
  testID,
}) => {
  const cardStyle = [
    styles.base,
    styles[variant],
    variant === 'default' && shadows.card,
    style,
  ];

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        testID={testID}
        accessibilityRole="button"
        style={({ pressed }) => [
          cardStyle,
          pressed && styles.pressed,
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View style={cardStyle} testID={testID}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.card,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'transparent',
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
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
});

