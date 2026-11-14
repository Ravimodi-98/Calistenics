import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, radii, spacing } from '@/theme';
import { AppText } from '@/components/ui/AppText';
import { AppButton } from '@/components/ui/AppButton';

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actionTitle?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionTitle,
  onAction,
  style,
}) => {
  return (
    <View style={[styles.container, style]} accessibilityRole="summary">
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <AppText variant="h2" align="center" style={styles.title}>
        {title}
      </AppText>
      {description && (
        <AppText variant="body" align="center" style={styles.description}>
          {description}
        </AppText>
      )}
      {actionTitle && onAction && (
        <View style={styles.actionContainer}>
          <AppButton
            title={actionTitle}
            onPress={onAction}
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
    width: 80,
    height: 80,
    borderRadius: radii.full,
    backgroundColor: colors.primaryLavender,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    color: colors.text,
    marginBottom: spacing.xs,
  },
  description: {
    color: colors.textSecondary,
    maxWidth: 320,
    lineHeight: 22,
  },
  actionContainer: {
    marginTop: spacing.lg,
  },
});

