import React from 'react';
import { View, StyleSheet, Pressable, ViewStyle } from 'react-native';
import { WifiOff, RefreshCw } from 'lucide-react-native';
import { colors, radii, spacing } from '@/theme';
import { AppText } from '@/components/ui/AppText';

export interface OfflineBannerProps {
  message?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
  style?: ViewStyle;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({
  message = 'You are currently offline. Your progress is saved locally and will sync when connected.',
  onRetry,
  isRetrying = false,
  style,
}) => {
  return (
    <View
      style={[styles.container, style]}
      accessible={true}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      accessibilityLabel={`Offline status: ${message}`}
    >
      <View style={styles.iconWrapper}>
        <WifiOff size={16} color="#B45309" />
      </View>
      <View style={styles.textWrapper}>
        <AppText variant="caption" color="#92400E" style={styles.text}>
          {message}
        </AppText>
      </View>
      {onRetry && (
        <Pressable
          onPress={onRetry}
          disabled={isRetrying}
          style={({ pressed }) => [
            styles.retryButton,
            pressed && styles.retryButtonPressed,
          ]}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Retry connection"
          accessibilityHint="Attempts to reconnect to server"
        >
          <RefreshCw size={13} color="#92400E" />
          <AppText variant="caption" color="#92400E" style={styles.retryText}>
            {isRetrying ? 'Checking...' : 'Retry'}
          </AppText>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: radii.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs,
  },
  iconWrapper: {
    marginRight: spacing.xs,
  },
  textWrapper: {
    flex: 1,
  },
  text: {
    fontSize: 12,
    lineHeight: 16,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.xs,
    paddingVertical: 4,
    borderRadius: radii.xs,
    backgroundColor: '#FDE68A',
    marginLeft: spacing.xs,
    minHeight: 44, // Minimum touch target guideline
    justifyContent: 'center',
  },
  retryButtonPressed: {
    opacity: 0.7,
  },
  retryText: {
    fontWeight: '600',
    fontSize: 11,
  },
});
