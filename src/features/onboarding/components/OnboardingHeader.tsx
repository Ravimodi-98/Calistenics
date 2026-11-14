import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing } from '@/theme';
import { AppText, ProgressBar } from '@/components';
import { ArrowLeft } from 'lucide-react-native';

export interface OnboardingHeaderProps {
  currentStep: number;
  totalSteps?: number;
  title: string;
  subtitle?: string;
  canGoBack?: boolean;
}

export const OnboardingHeader: React.FC<OnboardingHeaderProps> = ({
  currentStep,
  totalSteps = 8,
  title,
  subtitle,
  canGoBack = true,
}) => {
  const router = useRouter();
  const progressRatio = currentStep / totalSteps;

  return (
    <View style={styles.container}>
      {/* Top Nav Row */}
      <View style={styles.topRow}>
        {canGoBack && currentStep > 1 ? (
          <Pressable
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
            testID="onboarding-back-button"
          >
            <ArrowLeft size={22} color={colors.text} />
          </Pressable>
        ) : (
          <View style={styles.placeholder} />
        )}

        <View style={styles.stepBadge}>
          <AppText variant="caption" style={styles.stepBadgeText}>
            STEP {currentStep} OF {totalSteps}
          </AppText>
        </View>

        <View style={styles.placeholder} />
      </View>

      {/* Progress Bar */}
      <ProgressBar
        progress={progressRatio}
        height={6}
        color={colors.primary}
        trackColor={colors.primaryLavender}
        style={styles.progressBar}
      />

      {/* Title & Subtitle */}
      <View style={styles.titleContainer}>
        <AppText variant="h1" color={colors.text} style={styles.title}>
          {title}
        </AppText>
        {subtitle && (
          <AppText variant="body" color={colors.textSecondary} style={styles.subtitle}>
            {subtitle}
          </AppText>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  backButton: {
    padding: spacing.xs,
    marginLeft: -spacing.xs,
  },
  pressed: {
    opacity: 0.6,
  },
  placeholder: {
    width: 32,
  },
  stepBadge: {
    backgroundColor: colors.primaryLavender,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: 9999,
  },
  stepBadgeText: {
    color: colors.primaryDeep,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  progressBar: {
    marginVertical: spacing.xs,
  },
  titleContainer: {
    marginTop: spacing.sm,
  },
  title: {
    marginBottom: spacing.xxs,
  },
  subtitle: {
    lineHeight: 22,
  },
});

