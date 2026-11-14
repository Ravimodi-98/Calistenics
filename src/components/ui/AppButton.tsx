import React from 'react';
import {
  Pressable,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { colors, radii, spacing, typography } from '@/theme';
import { AppText } from './AppText';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  accessibilityLabel?: string;
  testID?: string;
}

export const AppButton: React.FC<AppButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = true,
  style,
  textStyle,
  accessibilityLabel,
  testID,
}) => {
  const isInteractive = !disabled && !loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={!isInteractive}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityState={{ disabled: !isInteractive, busy: loading }}
      testID={testID}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        styles[`size_${size}`],
        fullWidth && styles.fullWidth,
        pressed && isInteractive && styles[`${variant}_pressed`],
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'destructive' ? colors.textInverse : colors.primary}
        />
      ) : (
        <View style={styles.contentRow}>
          {icon && iconPosition === 'left' && <View style={styles.iconLeft}>{icon}</View>}
          <AppText
            variant={size === 'sm' ? 'buttonSmall' : 'button'}
            style={[
              styles.textBase,
              styles[`text_${variant}`],
              disabled && styles.textDisabled,
              textStyle,
            ]}
          >
            {title}
          </AppText>
          {icon && iconPosition === 'right' && <View style={styles.iconRight}>{icon}</View>}
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.button,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  fullWidth: {
    width: '100%',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: spacing.xs,
  },
  iconRight: {
    marginLeft: spacing.xs,
  },
  // Sizes
  size_sm: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    minHeight: 44, // Meets 44px minimum touch target guidelines
  },
  size_md: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    minHeight: 48,
  },
  size_lg: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    minHeight: 56,
  },
  // Variants
  primary: {
    backgroundColor: colors.primary,
  },
  primary_pressed: {
    backgroundColor: colors.primaryDeep,
  },
  secondary: {
    backgroundColor: colors.primaryLavender,
  },
  secondary_pressed: {
    backgroundColor: '#D1C8EF',
  },
  outline: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  outline_pressed: {
    backgroundColor: colors.background,
    borderColor: colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  ghost_pressed: {
    backgroundColor: colors.primaryMuted,
  },
  destructive: {
    backgroundColor: colors.error,
  },
  destructive_pressed: {
    backgroundColor: '#B23A40',
  },
  disabled: {
    opacity: 0.5,
  },
  // Text styles
  textBase: {
    textAlign: 'center',
  },
  text_primary: {
    color: colors.textInverse,
  },
  text_secondary: {
    color: colors.primaryDeep,
  },
  text_outline: {
    color: colors.text,
  },
  text_ghost: {
    color: colors.primary,
  },
  text_destructive: {
    color: colors.textInverse,
  },
  textDisabled: {
    color: colors.textMuted,
  },
});

