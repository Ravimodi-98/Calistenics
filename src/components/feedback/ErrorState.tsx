import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, radii, spacing } from '@/theme';
import { AppText } from '@/components/ui/AppText';
import { AppButton } from '@/components/ui/AppButton';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryTitle?: string;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'We encountered an unexpected issue. Please try again.',
  onRetry,
  retryTitle = 'Try Again',
  icon,
  style,
}) => {
  return (
    <View style={[styles.container, style]} accessibilityRole="alert">
      <View style={styles.iconContainer}>
        {icon || (
          <View style={styles.defaultErrorIcon}>
            <AppText variant="h2" style={styles.exclamation}>
              !
            </AppText>
          </View>
        )}
      </View>
      <AppText variant="h2" align="center" style={styles.title}>
        {title}
      </AppText>
      <AppText variant="body" align="center" style={styles.message}>
        {message}
      </AppText>
      {onRetry && (
        <View style={styles.actionContainer}>
          <AppButton
            title={retryTitle}
            onPress={onRetry}
            variant="primary"
            size="md"
            fullWidth={false}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 280,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: radii.full,
    backgroundColor: colors.errorMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  defaultErrorIcon: {
    width: 44,
    height: 44,
    borderRadius: radii.full,
    backgroundColor: colors.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exclamation: {
    color: colors.textInverse,
    fontWeight: '700',
  },
  title: {
    color: colors.text,
    marginBottom: spacing.xs,
  },
  message: {
    color: colors.textSecondary,
    maxWidth: 320,
    lineHeight: 22,
  },
  actionContainer: {
    marginTop: spacing.lg,
  },
});

