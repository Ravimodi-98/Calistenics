import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, radii } from '@/theme';
import { AppText, AppButton, AppCard, ScreenContainer } from '@/components';
import { OnboardingHeader } from '@/features/onboarding/components/OnboardingHeader';
import { useOnboardingStore } from '@/features/onboarding/store/onboardingStore';
import { useAuthStore } from '@/features/auth/store/authStore';
import { CheckCircle2, Dumbbell, Calendar, Target, Sparkles, MapPin } from 'lucide-react-native';

export default function SummaryScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    experience_level,
    fitness_goals,
    target_skills,
    available_equipment,
    training_days,
    session_duration_minutes,
    preferred_training_time,
    training_location,
    coaching_style,
    workout_preference,
    training_notes,
    submitOnboarding,
    isSaving,
    error,
  } = useOnboardingStore();

  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const handleCompleteSetup = async () => {
    if (!user) {
      setSubmissionError('User session expired. Please sign in again.');
      return;
    }

    setSubmissionError(null);
    try {
      await submitOnboarding(user.id);
      // After verified database persistence and profile state update, route to dashboard
      router.replace('/(tabs)');
    } catch (err: any) {
      setSubmissionError(err.message || 'Failed to complete setup. Please check your connection.');
    }
  };

  const formatList = (items: string[]) => {
    if (!items || items.length === 0) return 'None selected';
    return items
      .map((item) =>
        item
          .split('_')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ')
      )
      .join(', ');
  };

  return (
    <ScreenContainer scrollable padded>
      <OnboardingHeader
        currentStep={8}
        totalSteps={8}
        title="Your Training Profile"
        subtitle="Review your personalized selections. You can edit any category before completing setup."
      />

      {(submissionError || error) && (
        <View style={styles.errorBanner} accessibilityRole="alert">
          <AppText variant="caption" style={styles.errorText}>
            {submissionError || error}
          </AppText>
        </View>
      )}

      {/* Profile Overview Card */}
      <AppCard variant="lavender" style={styles.summaryCard}>
        <View style={styles.cardHeader}>
          <Sparkles size={20} color={colors.primaryDeep} />
          <AppText variant="h2" color={colors.primaryDeep} style={styles.cardTitle}>
            {experience_level.toUpperCase()} ATHLETE
          </AppText>
        </View>

        {/* 1. Goals */}
        <View style={styles.sectionRow}>
          <Target size={18} color={colors.primary} style={styles.rowIcon} />
          <View style={styles.rowContent}>
            <AppText variant="caption" color={colors.primaryDeep} style={styles.sectionLabel}>
              FITNESS GOALS
            </AppText>
            <AppText variant="body" color={colors.text}>
              {formatList(fitness_goals)}
            </AppText>
          </View>
        </View>

        {/* 2. Target Skills */}
        <View style={styles.sectionRow}>
          <CheckCircle2 size={18} color={colors.primary} style={styles.rowIcon} />
          <View style={styles.rowContent}>
            <AppText variant="caption" color={colors.primaryDeep} style={styles.sectionLabel}>
              TARGET SKILLS
            </AppText>
            <AppText variant="body" color={colors.text}>
              {formatList(target_skills)}
            </AppText>
          </View>
        </View>

        {/* 3. Available Equipment */}
        <View style={styles.sectionRow}>
          <Dumbbell size={18} color={colors.primary} style={styles.rowIcon} />
          <View style={styles.rowContent}>
            <AppText variant="caption" color={colors.primaryDeep} style={styles.sectionLabel}>
              EQUIPMENT
            </AppText>
            <AppText variant="body" color={colors.text}>
              {formatList(available_equipment)}
            </AppText>
          </View>
        </View>

        {/* 4. Schedule & Duration */}
        <View style={styles.sectionRow}>
          <Calendar size={18} color={colors.primary} style={styles.rowIcon} />
          <View style={styles.rowContent}>
            <AppText variant="caption" color={colors.primaryDeep} style={styles.sectionLabel}>
              SCHEDULE & DURATION
            </AppText>
            <AppText variant="body" color={colors.text}>
              {formatList(training_days)} • {session_duration_minutes} min/session ({preferred_training_time})
            </AppText>
          </View>
        </View>

        {/* 5. Preferences */}
        <View style={styles.sectionRow}>
          <MapPin size={18} color={colors.primary} style={styles.rowIcon} />
          <View style={styles.rowContent}>
            <AppText variant="caption" color={colors.primaryDeep} style={styles.sectionLabel}>
              ENVIRONMENT & COACHING
            </AppText>
            <AppText variant="body" color={colors.text}>
              {training_location.toUpperCase()} • {coaching_style} coaching • {workout_preference} focus
            </AppText>
            {training_notes ? (
              <AppText variant="caption" color={colors.textSecondary} style={styles.notesText}>
                Note: "{training_notes}"
              </AppText>
            ) : null}
          </View>
        </View>
      </AppCard>

      {/* Action Buttons */}
      <View style={styles.actionGroup}>
        <AppButton
          title="Complete Setup & Enter App"
          onPress={handleCompleteSetup}
          loading={isSaving}
          variant="primary"
          size="lg"
          testID="summary-complete-button"
        />

        <AppButton
          title="Edit Preferences"
          onPress={() => router.push('/(onboarding)/experience')}
          variant="outline"
          size="md"
          testID="summary-edit-button"
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  errorBanner: {
    backgroundColor: colors.errorMuted,
    borderWidth: 1,
    borderColor: colors.error,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.md,
  },
  errorText: {
    color: colors.error,
    fontWeight: '600',
  },
  summaryCard: {
    padding: spacing.lg,
    borderRadius: radii.card,
    marginVertical: spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#D4CCF0',
  },
  cardTitle: {
    marginLeft: spacing.xs,
    letterSpacing: 0.5,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: spacing.xs,
  },
  rowIcon: {
    marginRight: spacing.sm,
    marginTop: 2,
  },
  rowContent: {
    flex: 1,
  },
  sectionLabel: {
    fontWeight: '700',
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  notesText: {
    marginTop: spacing.xxs,
    fontStyle: 'italic',
  },
  actionGroup: {
    gap: spacing.sm,
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
});

