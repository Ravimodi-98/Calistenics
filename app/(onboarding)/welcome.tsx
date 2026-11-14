import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, radii } from '@/theme';
import { AppText, AppButton, ScreenContainer } from '@/components';
import { ExerciseAnimation } from '@/animations/components/ExerciseAnimation';

const sampleAnimation = require('@/animations/assets/sample-exercise.json');

export default function OnboardingWelcomeScreen() {
  const router = useRouter();

  return (
    <ScreenContainer scrollable={false} padded style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.badge}>
          <AppText variant="caption" style={styles.badgeText}>
            STEP 1 OF 8 • WELCOME
          </AppText>
        </View>

        <AppText variant="display" align="center" style={styles.title}>
          Let's Build Your Strength
        </AppText>

        <AppText variant="bodyLarge" align="center" style={styles.subtitle}>
          Your calisthenics journey starts here. Let's create a personalized training experience that matches your goals.
        </AppText>
      </View>

      {/* 2D Illustration Showcase */}
      <View style={styles.illustrationWrapper}>
        <View style={styles.illustrationBackdrop} />
        <ExerciseAnimation
          source={sampleAnimation}
          fallbackText="Calisthenics Onboarding Illustration"
          height={240}
        />
      </View>

      {/* Action Button */}
      <View style={styles.footer}>
        <AppButton
          title="Let's Get Started"
          onPress={() => router.push('/(onboarding)/experience')}
          variant="primary"
          size="lg"
          testID="onboarding-welcome-start-button"
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    backgroundColor: colors.background,
  },
  header: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  badge: {
    backgroundColor: colors.primaryLavender,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.full,
    marginBottom: spacing.md,
  },
  badgeText: {
    color: colors.primaryDeep,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  title: {
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: colors.textSecondary,
    maxWidth: 320,
    lineHeight: 24,
  },
  illustrationWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.md,
    position: 'relative',
  },
  illustrationBackdrop: {
    position: 'absolute',
    width: '85%',
    height: 200,
    borderRadius: radii.card,
    backgroundColor: colors.primaryLavender,
    opacity: 0.5,
  },
  footer: {
    width: '100%',
    marginBottom: spacing.lg,
  },
});

