import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, radii } from '@/theme';
import { AppText, AppButton, ScreenContainer } from '@/components';
import { ExerciseAnimation } from '@/animations/components/ExerciseAnimation';

const sampleAnimation = require('@/animations/assets/sample-exercise.json');

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <ScreenContainer scrollable={false} padded style={styles.container}>
      {/* Top Brand Header */}
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <View style={styles.logoBadge}>
            <AppText variant="caption" style={styles.logoBadgeText}>
              CALISTHENICS COACH
            </AppText>
          </View>
        </View>

        <AppText variant="display" align="center" style={styles.title}>
          Master Your Bodyweight
        </AppText>

        <AppText variant="bodyLarge" align="center" style={styles.subtitle}>
          Structured calisthenics progressions, reviewed technique cues, and smooth 2D movement demonstrations.
        </AppText>
      </View>

      {/* 2D Vector Illustration / Hero Animation */}
      <View style={styles.illustrationWrapper}>
        <View style={styles.illustrationBackdrop} />
        <ExerciseAnimation
          source={sampleAnimation}
          fallbackText="Calisthenics Form Demonstration"
          height={240}
        />
      </View>

      {/* Action Buttons */}
      <View style={styles.footer}>
        <AppButton
          title="Get Started"
          onPress={() => router.push('/(auth)/sign-up')}
          variant="primary"
          size="lg"
          style={styles.primaryButton}
          testID="welcome-get-started-button"
        />

        <AppButton
          title="Already have an account? Sign In"
          onPress={() => router.push('/(auth)/sign-in')}
          variant="ghost"
          size="md"
          style={styles.signInButton}
          testID="welcome-sign-in-button"
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
    marginTop: spacing.lg,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  logoBadge: {
    backgroundColor: colors.primaryLavender,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: '#D4CCF0',
  },
  logoBadgeText: {
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
    lineHeight: 22,
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
    width: '90%',
    height: 200,
    borderRadius: radii.card,
    backgroundColor: colors.primaryLavender,
    opacity: 0.4,
    transform: [{ scale: 0.95 }, { translateY: 10 }],
  },
  footer: {
    width: '100%',
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  primaryButton: {
    marginVertical: spacing.xxs,
  },
  signInButton: {
    marginTop: spacing.xxs,
  },
});
