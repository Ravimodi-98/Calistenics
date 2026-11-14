import React, { useEffect } from 'react';
import { View, StyleSheet, Pressable, ViewStyle } from 'react-native';
import { CheckCircle2, X } from 'lucide-react-native';
import { colors, radii, spacing } from '@/theme';
import { AppText } from '@/components/ui/AppText';

export interface SuccessBannerProps {
  message: string;
  onDismiss?: () => void;
  autoDismissMs?: number;
  style?: ViewStyle;
}

export const SuccessBanner: React.FC<SuccessBannerProps> = ({
  message,
  onDismiss,
  autoDismissMs = 4000,
  style,
}) => {
  useEffect(() => {
    if (autoDismissMs && onDismiss) {
      const timer = setTimeout(() => {
        onDismiss();
      }, autoDismissMs);
      return () => clearTimeout(timer);
    }
  }, [autoDismissMs, onDismiss]);

  return (
    <View
      style={[styles.container, style]}
      accessible={true}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      accessibilityLabel={`Success: ${message}`}
    >
      <CheckCircle2 size={18} color="#065F46" style={styles.icon} />
      <View style={styles.textWrapper}>
        <AppText variant="body" color="#065F46" style={styles.text}>
          {message}
        </AppText>
      </View>
      {onDismiss && (
        <Pressable
          onPress={onDismiss}
          style={styles.closeButton}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Dismiss success notification"
        >
          <X size={16} color="#065F46" />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: radii.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginVertical: spacing.xs,
  },
  icon: {
    marginRight: spacing.xs,
  },
  textWrapper: {
    flex: 1,
  },
  text: {
    fontSize: 13,
    fontWeight: '500',
  },
  closeButton: {
    padding: spacing.xs,
    minHeight: 44, // Minimum touch target guideline
    minWidth: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
